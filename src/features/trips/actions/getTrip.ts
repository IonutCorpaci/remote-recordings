'use server'

import { requireAuth } from "@/features/auth/utils/requireAuth"
import prisma from "@/lib/prisma";

export default async function getTrip(id: string) {
    await requireAuth();

    try {
        const trip = await prisma.trip.findUnique({
            where: { id: id },
            include: {
                participants: {
                    include: {
                        partner: true
                    }
                },
                cars: {
                    include: {
                        driver: {
                            include: {
                                partner: true
                            }
                        },
                        passengers: {
                            include: {
                                partner: true
                            }
                        }
                    }
                }
            }
        });

        if (!trip) return { error: "Поездка не найдена" };
        return { data: trip };

    } catch (error: unknown) {
        console.error("Ошибка при получении поездки со связями пар:", error);

        // Fallback: если база данных еще не обновлена (нет колонки partnerId),
        // загружаем поездку без вложенных пар, чтобы страница открывалась без падений
        try {
            const fallbackTrip = await prisma.trip.findUnique({
                where: { id: id },
                include: {
                    participants: true,
                    cars: {
                        include: {
                            driver: true,
                            passengers: true
                        }
                    }
                }
            });

            if (!fallbackTrip) return { error: "Поездка не найдена" };
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return { data: fallbackTrip as any };
        } catch (fallbackError) {
            console.error("Критическая ошибка загрузки поездки:", fallbackError);
            return { error: "Не удалось загрузить поездку" };
        }
    }
}