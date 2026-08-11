'use server'
import { requireAuth } from "@/features/auth/utils/requireAuth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";


export default async function deleteTrip(id: string) {
    await requireAuth();

    try {
        await prisma.trip.delete({
            where: { id }
        });
    } catch (error) {
        return {
            error: "Что-то пошло не так при удалении.",
        };
    }

    revalidatePath('/')
    redirect('/');

}