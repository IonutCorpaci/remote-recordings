'use server';

import { requireAuth } from "@/features/auth/utils/requireAuth";
import prisma from "@/lib/prisma";

export default async function getTrip(id: string) {
    await requireAuth();

    // 1. Пытаемся автоматически добавить колонку partnerId в базу, если её ещё нет
    try {
        await prisma.$executeRawUnsafe(`ALTER TABLE "Participant" ADD COLUMN IF NOT EXISTS "partnerId" TEXT;`);
    } catch {
        // Игнорируем, если нет прав или синтаксис другой
    }

    // 2. Пробуем загрузить поездку со связями пар
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
        console.error("Ошибка при получении поездки со связями пар, переключаемся на безопасный fallback:", error);

        // 3. Fallback: если колонки partnerId еще нет в таблице БД,
        // явно запрашиваем ТОЛЬКО существующие поля таблицы Participant,
        // чтобы база данных гарантированно не падала из-за отсутствующей колонки!
        try {
            const baseParticipantFields = {
                id: true,
                name: true,
                phone: true,
                tripId: true,
                carId: true,
                createdAt: true,
            };

            const fallbackTrip = await prisma.trip.findUnique({
                where: { id: id },
                include: {
                    participants: {
                        select: baseParticipantFields
                    },
                    cars: {
                        include: {
                            driver: {
                                select: baseParticipantFields
                            },
                            passengers: {
                                select: baseParticipantFields
                            }
                        }
                    }
                }
            });

            if (!fallbackTrip) return { error: "Поездка не найдена" };

            // Дополняем отсутствующие поля пар пустыми значениями для совместимости с типами UI
            const sanitizedTrip = {
                ...fallbackTrip,
                participants: (fallbackTrip.participants || []).map((p) => ({
                    ...p,
                    partnerId: null,
                    partner: null,
                })),
                cars: (fallbackTrip.cars || []).map((c) => ({
                    ...c,
                    driver: c.driver ? { ...c.driver, partnerId: null, partner: null } : null,
                    passengers: (c.passengers || []).map((p) => ({
                        ...p,
                        partnerId: null,
                        partner: null,
                    })),
                })),
            };

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return { data: sanitizedTrip as any };
        } catch (fallbackError: unknown) {
            console.error("Критическая ошибка загрузки поездки:", fallbackError);
            const message = fallbackError instanceof Error ? fallbackError.message : "Не удалось загрузить поездку";
            return { error: message };
        }
    }
}
