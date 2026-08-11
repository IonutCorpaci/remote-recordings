'use server'

import { requireAuth } from "@/features/auth/utils/requireAuth"
import prisma from "@/lib/prisma";

export default async function getTrip(id: string) {
    await requireAuth();

    try {

        const trip = await prisma.trip.findUnique({
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
        })

        if (!trip) return { error: "Поездка не найдена" };

        return { data: trip }

    } catch (error) {
        return { error: "Не удалось загрузить поездку" }
    }
}