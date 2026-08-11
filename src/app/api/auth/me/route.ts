import { verifyToken } from "@/features/auth/utils/jwt";
import { getSessionCookie } from "@/features/auth/utils/session";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";


export async function GET(request: Request) {
    try {
        const token = await getSessionCookie();

        if (!token) {
            return NextResponse.json({ error: "Что-то пошло не так" }, { status: 401 })
        }

        const payload = await verifyToken(token);

        if (!payload) {
            return NextResponse.json({ error: "Что-то пошло не так" }, { status: 401 })
        }

        const user = await prisma.user.findUnique(
            {
                where: { id: payload.userId as string },
                select: { id: true, name: true, email: true, role: true }
            })

        if (!user) {
            return NextResponse.json({ error: "Что-то пошло не так" }, { status: 401 })
        }

        return NextResponse.json({ user })

    } catch (error) {
        return NextResponse.json({ error: "Что-то пошло не так" }, { status: 500 });
    }
}