import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { registerSchema } from "@/features/auth/validations/authSchema";
import { hashPassword } from "@/features/auth/utils/password";
import { createToken } from "@/features/auth/utils/jwt";
import { setSessionCookie } from "@/features/auth/utils/session";
import { z } from "zod";


export async function POST(request: Request) {
    try {

        const body = await request.json();
        const { email, password, name } = registerSchema.parse(body)

        const isExistEmail = await prisma.user.findUnique({
            where: { email: email }
        })

        if (isExistEmail) {
            return NextResponse.json({ error: "Этот email уже занят" }, { status: 400 });
        }

        const hashedPassword = await hashPassword(password);

        const user = await prisma.user.create({
            data: {
                name: name,
                email: email,
                passwordHash: hashedPassword
            }
        })

        const token = await createToken({ userId: user.id })
        await setSessionCookie(token)
        return NextResponse.json({
            user: {
                id: user.id,
                email,
                name
            }
        }, { status: 201 })

        // Ваша логика здесь
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.issues[0].message }, { status: 400 });
        }

        // Для всех остальных (неожиданных) серверных ошибок
        console.error("Ошибка при регистрации:", error);
        return NextResponse.json({ error: "Что-то пошло не так" }, { status: 500 });
    }
}