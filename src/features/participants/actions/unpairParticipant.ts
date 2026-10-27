'use server';

import { requireAuth } from "@/features/auth/utils/requireAuth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export default async function unpairParticipant(participantId: string, tripId: string) {
    await requireAuth();

    if (!participantId) {
        return { error: "Участник не указан" };
    }

    try {
        await prisma.$transaction(async (tx) => {
            const participant = await tx.participant.findUnique({
                where: { id: participantId },
                select: { id: true, partnerId: true, tripId: true },
            });

            if (!participant) {
                throw new Error("Участник не найден");
            }

            if (participant.partnerId) {
                await tx.participant.update({
                    where: { id: participant.partnerId },
                    data: { partnerId: null },
                });
            }

            await tx.participant.update({
                where: { id: participantId },
                data: { partnerId: null },
            });
        });

        revalidatePath(`/trips/${tripId}`);
        return { success: true };
    } catch (error: unknown) {
        console.error("Ошибка при разъединении пары:", error);
        if (error instanceof Error) {
            return { error: error.message };
        }
        return { error: "Не удалось разъединить пару" };
    }
}
