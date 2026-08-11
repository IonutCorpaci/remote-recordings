'use server'

import { requireAuth } from "@/features/auth/utils/requireAuth";
import prisma from "@/lib/prisma";

export default async function getTrips() {
    await requireAuth();

    try {

        const trips = await prisma.trip.findMany({
            orderBy: {
                date: 'desc'
            },
            select: {
                id: true,
                title: true,
                destination: true,
                status: true,
                date: true,
                _count: {
                    select: {
                        cars: true,
                        participants: true
                    }
                }
            }
        })

        return { data: trips };

    } catch (error) {
        console.error("Ошибка при получении поездок:", error);
        return { error: "Не удалось загрузить список поездок" };
    }
}