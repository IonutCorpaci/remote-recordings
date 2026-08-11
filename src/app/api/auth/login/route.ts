import { createToken } from "@/features/auth/utils/jwt";
import { verifyPassword } from "@/features/auth/utils/password";
import { setSessionCookie } from "@/features/auth/utils/session";
import prisma from "@/lib/prisma";
import { loginSchema } from "@/features/auth/validations/authSchema";
import { NextResponse } from "next/server";
import { z } from "zod";


export async function POST(request: Request) {
    try {
        const body = await request.json();
        const parsed = loginSchema.safeParse(body);
        
        if (!parsed.success) {
            return NextResponse.json({ 
                error: "Ошибка валидации", 
                fieldErrors: parsed.error.flatten().fieldErrors 
            }, { status: 400 });
        }
        
        const { email, password } = parsed.data;

        const user = await prisma.user.findUnique({
            where: { email: email }
        })

        if (!user) {
            return NextResponse.json({ error: "Неверный email или пароль" }, { status: 401 })
        }

        const isPasswordCorrect = await verifyPassword(password, user.passwordHash);

        if (!isPasswordCorrect) {
            return NextResponse.json({ error: "Неверный email или пароль" }, { status: 401 })
        }

        const token = await createToken({ userId: user.id })
        await setSessionCookie(token)

        return NextResponse.json({
            user: {
                id: user.id,
                email,
                name: user.name
            }
        }, { status: 200 })

    } catch (error) {
        return NextResponse.json({ error: "Что-то пошло не так" }, { status: 500 });
    }
}