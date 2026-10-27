'use server'

import { requireAuth } from "@/features/auth/utils/requireAuth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export default async function removeParticipant(id: string, tripId: string) {
    await requireAuth();

    try {
        try {
            await prisma.participant.updateMany({
                where: { partnerId: id },
                data: { partnerId: null }
            });
        } catch {
            // Игнорируем ошибку, если колонка partnerId еще не создана в БД
        }

        await prisma.participant.delete({
            where: { id }
        });
    } catch (error) {
        console.error("Ошибка при удалении участника:", error);
        return { error: "Не удалось удалить участника" };
    }

    revalidatePath(`/trips/${tripId}`);
    return { success: true };
}