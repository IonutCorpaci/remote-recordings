'use server'
import { requireAuth } from "@/features/auth/utils/requireAuth";
import { createUpdateTripSchema } from "../validations/tripSchema";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";


export default async function updateTrip(id: string, prevState: unknown, formData: FormData) {
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

        await prisma.trip.update({
            where: { id },
            data: parsed.data,
        });
    } catch (error) {
        return {
            error: "Что-то пошло не так при обновлении.",
        };
    }

    revalidatePath(`/trips/${id}`)
    revalidatePath('/')
}