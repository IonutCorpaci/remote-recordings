'use server'

import { requireAuth } from "@/features/auth/utils/requireAuth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

import { addParticipantSchema } from "../validations/participantSchema";

export default async function addParticipant(tripId: string, name: string) {
    await requireAuth();

    const parsed = addParticipantSchema.safeParse({ name });
    if (!parsed.success) {
        return {
            error: "Ошибка валидации",
            fieldErrors: parsed.error.flatten().fieldErrors
        };
    }

    try {
        await prisma.participant.create({
            data: {
                tripId,
                name: parsed.data.name
            }
        });
    } catch (error) {
        return { error: "Не удалось добавить участника" };
    }

    revalidatePath(`/trips/${tripId}`);
    return { success: true };
}