import { getSessionCookie } from "./session";
import { verifyToken } from "./jwt";

export async function requireAuth() {
    const cookie = await getSessionCookie();

    if (!cookie) {
        throw new Error('Не авторизован');
    }

    const verifiedToken = await verifyToken(cookie);

    if (!verifiedToken) {
        throw new Error('Не авторизован');
    }

    return verifiedToken; // возвращаем полезную нагрузку (например, userId)
}
