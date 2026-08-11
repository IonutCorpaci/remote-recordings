import { JWTPayload, jwtVerify, SignJWT } from "jose";

const secretKey = process.env.JWT_SECRET;
if (!secretKey) {
    throw new Error("JWT_SECRET is not defined in environment variables");
}
const secret = new TextEncoder().encode(secretKey);


export async function createToken(payload: JWTPayload) {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime('30d')
        .sign(secret);
}

export async function verifyToken(token: string | undefined = ""): Promise<JWTPayload | null> {
    try {
        const { payload } = await jwtVerify(token, secret)
        return payload;
    } catch (e) {
        return null;
    }
}