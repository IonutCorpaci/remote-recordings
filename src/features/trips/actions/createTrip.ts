'use server'

import prisma from "@/lib/prisma";
import { requireAuth } from "@/features/auth/utils/requireAuth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createUpdateTripSchema } from "../validations/tripSchema";

export default async function createTrip(prevState: unknown, formData: FormData) {
    await requireAuth();

    const title = formData.get('title') as string;
    const destination = formData.get('destination') as string;
    const date = formData.get('date') as string;
    const notes = formData.get('notes') as string;

    try {
        const parsed = createUpdateTripSchema.safeParse({ title, destination, date, notes });

        if (!parsed.success) {
            return {
                error: "Ошибка валидации",
                fieldErrors: parsed.error.flatten().fieldErrors
            };
        }

        await prisma.trip.create({
            data: parsed.data,
        });
    } catch (error) {
        return {
            error: "Что-то пошло не так при создании.",
        };
    }

    revalidatePath('/trips/new')
    redirect("/");
}