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
        const { email, password } = loginSchema.parse(body)
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

        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.issues[0].message }, { status: 400 });
        }

        return NextResponse.json({ error: "Что-то пошло не так" }, { status: 500 });

    }
}