'use server'

import { requireAuth } from "@/features/auth/utils/requireAuth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export default async function assignParticipant(participantId: string, carId: string | null, tripId: string) {
    await requireAuth();

    try {
        if (carId) {
            await prisma.$transaction(async (tx) => {
                const car = await tx.car.findUnique({
                    where: { id: carId },
                    include: { passengers: true }
                });

                if (!car) {
                    throw new Error("Машина не найдена");
                }

                const passengerCapacity = car.totalSeats - 1; // Минус одно место для водителя
                const isAlreadyInCar = car.passengers.some(p => p.id === participantId);

                // Если участника ещё нет в этой машине и мест больше нет
                if (!isAlreadyInCar && car.passengers.length >= passengerCapacity) {
                    throw new Error("В этой машине больше нет свободных мест");
                }

                // Проверяем, не является ли этот участник водителем этой же машины
                if (car.driverId === participantId) {
                    throw new Error("Этот участник уже является водителем данной машины");
                }

                await tx.participant.update({
                    where: { id: participantId },
                    data: { carId }
                });
            });
        } else {
            // Если carId === null, просто снимаем участника с машины
            await prisma.participant.update({
                where: { id: participantId },
                data: { carId: null }
            });
        }
    } catch (error: unknown) {
        if (error instanceof Error) {
            return { error: error.message || "Не удалось назначить участника" };
        }
        return { error: "Не удалось назначить участника" };
    }

    revalidatePath(`/trips/${tripId}`);
    return { success: true };
}
