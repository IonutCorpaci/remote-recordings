'use server';

import { requireAuth } from "@/features/auth/utils/requireAuth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export default async function pairParticipants(participantId: string, partnerId: string, tripId: string) {
    await requireAuth();

    if (!participantId || !partnerId || participantId === partnerId) {
        return { error: "Некорректно выбраны участники для пары" };
    }

    try {
        await prisma.$transaction(async (tx) => {
            const p1 = await tx.participant.findUnique({
                where: { id: participantId },
                select: { id: true, partnerId: true, tripId: true },
            });
            const p2 = await tx.participant.findUnique({
                where: { id: partnerId },
                select: { id: true, partnerId: true, tripId: true },
            });

            if (!p1 || !p2) {
                throw new Error("Один или оба участника не найдены");
            }

            if (p1.tripId !== tripId || p2.tripId !== tripId) {
                throw new Error("Участники принадлежат разным поездкам");
            }

            // Если p1 уже был в паре с кем-то другим, сбрасываем старую пару
            if (p1.partnerId && p1.partnerId !== partnerId) {
                await tx.participant.update({
                    where: { id: p1.partnerId },
                    data: { partnerId: null },
                });
            }

            // Если p2 уже был в паре с кем-то другим, сбрасываем старую пару
            if (p2.partnerId && p2.partnerId !== participantId) {
                await tx.participant.update({
                    where: { id: p2.partnerId },
                    data: { partnerId: null },
                });
            }

            // Устанавливаем взаимную связь
            await tx.participant.update({
                where: { id: participantId },
                data: { partnerId: partnerId },
            });

            await tx.participant.update({
                where: { id: partnerId },
                data: { partnerId: participantId },
            });
        });

        revalidatePath(`/trips/${tripId}`);
        return { success: true };
    } catch (error: unknown) {
        if (error instanceof Error) {
            return { error: error.message };
        }
        return { error: "Не удалось связать участников в пару" };
    }
}
