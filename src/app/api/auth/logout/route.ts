import { deleteSessionCookie } from "@/features/auth/utils/session";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        await deleteSessionCookie();

        return NextResponse.json({ success: true }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ error: "Что-то пошло не так" }, { status: 500 });
    }
}