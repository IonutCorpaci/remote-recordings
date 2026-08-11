'use server'

import { requireAuth } from "@/features/auth/utils/requireAuth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export default async function addParticipant(tripId: string, name: string) {
    await requireAuth();

    try {
        await prisma.participant.create({
            data: {
                tripId,
                name
            }
        });
    } catch (error) {
        return { error: "Не удалось добавить участника" };
    }

    revalidatePath(`/trips/${tripId}`);
    return { success: true };
}