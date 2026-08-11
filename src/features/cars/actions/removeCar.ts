'use server'

import { requireAuth } from "@/features/auth/utils/requireAuth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export default async function removeCar(carId: string, tripId: string) {
    await requireAuth();

    try {
        await prisma.car.delete({
            where: { id: carId }
        });
    } catch (error) {
        return { error: "Не удалось удалить машину" };
    }

    revalidatePath(`/trips/${tripId}`);
    return { success: true };
}
