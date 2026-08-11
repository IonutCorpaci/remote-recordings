'use server'

import { requireAuth } from "@/features/auth/utils/requireAuth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export default async function removeParticipant(id: string, tripId: string) {
    await requireAuth();

    try {
        await prisma.participant.delete({
            where: { id }
        });
    } catch (error) {
        return { error: "Не удалось удалить участника" };
    }

    revalidatePath(`/trips/${tripId}`);
    return { success: true };
}