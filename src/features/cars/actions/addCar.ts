'use server'

import { requireAuth } from "@/features/auth/utils/requireAuth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

import { addCarSchema } from "../validations/carSchema";

export default async function addCar(
    tripId: string, 
    driverId: string | null, 
    newDriverName: string | null, 
    carModel: string | null, 
    totalSeats: number
) {
    await requireAuth();

    const parsed = addCarSchema.safeParse({ carModel, totalSeats });
    if (!parsed.success) {
        return {
            error: "Ошибка валидации",
            fieldErrors: parsed.error.flatten().fieldErrors
        };
    }

    try {
        let finalDriverId = driverId;

        if (!finalDriverId && newDriverName) {
            const newParticipant = await prisma.participant.create({
                data: {
                    tripId,
                    name: newDriverName
                }
            });
            finalDriverId = newParticipant.id;
        }

        if (!finalDriverId) throw new Error("No driver provided");

        await prisma.car.create({
            data: {
                tripId,
                driverId: finalDriverId,
                carModel,
                totalSeats
            }
        });

    } catch (error) {
        return { error: "Не удалось добавить машину" };
    }

    revalidatePath(`/trips/${tripId}`);
    return { success: true };
}