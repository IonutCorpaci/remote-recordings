import { cookies } from "next/headers";

const SESSION_COOKIE = "session_token";

export async function setSessionCookie(token: string) {
    (await cookies()).set(SESSION_COOKIE, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 30, // 30 дней
    });
}

export async function getSessionCookie() {
    return (await cookies()).get(SESSION_COOKIE)?.value || undefined;
}

export async function deleteSessionCookie() {
    (await cookies()).delete(SESSION_COOKIE);
}
