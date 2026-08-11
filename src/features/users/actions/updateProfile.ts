"use server";

import { requireAuth } from "@/features/auth/utils/requireAuth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const updateProfileSchema = z.object({
  name: z.string().min(2, "Имя должно содержать минимум 2 символа").max(50),
  email: z.string().email("Неверный формат email"),
});

export type ProfileState = {
  error?: string;
  message?: string;
  fieldErrors?: Record<string, string[]>;
  success?: boolean;
};

export async function updateProfile(prevState: ProfileState, formData: FormData): Promise<ProfileState> {
  try {
    const session = await requireAuth();
    if (!session || !session.userId) {
      return { error: "Не авторизован" };
    }

    const raw = Object.fromEntries(formData);
    const parsed = updateProfileSchema.safeParse(raw);

    if (!parsed.success) {
      return {
        error: "Ошибка валидации",
        fieldErrors: parsed.error.flatten().fieldErrors,
      };
    }

    const { name, email } = parsed.data;

    // Check if email is already taken by someone else
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser && existingUser.id !== session.userId) {
      return { error: "Этот email уже используется" };
    }

    await prisma.user.update({
      where: { id: session.userId as string },
      data: { name, email },
    });

    revalidatePath("/settings");
    return { success: true, message: "Профиль успешно обновлен" };
  } catch (error) {
    return { error: "Не удалось обновить профиль. Попробуйте позже." };
  }
}
