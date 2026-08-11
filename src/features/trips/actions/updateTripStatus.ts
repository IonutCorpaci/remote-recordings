'use server'

import { requireAuth } from "@/features/auth/utils/requireAuth"
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export default async function updateTripStatus(id: string, status: 'PLANNING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED') {
    await requireAuth();

    try {
        await prisma.trip.update({
            where: { id },
            data: { status }
        });
    } catch (error) {
        return { error: "Не удалось обновить статус" };
    }

    revalidatePath("/");
    revalidatePath(`/trips/${id}`);
    return { success: true };
}
