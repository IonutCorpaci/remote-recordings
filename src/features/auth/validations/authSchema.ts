import * as z from "zod"

export const loginSchema = z.object({
    email: z.string().email("Неверный формат почты"),
    password: z.string().min(1, "Введите пароль"),
})


export const registerSchema = z.object({
    email: z.string().email("Неверный формат почты"),
    password: z.string()
        .min(8, "Пароль должен быть не короче 8 символов")
        .max(32, "Пароль не должен превышать 32 символа")
        .regex(/[A-Z]/, "Пароль должен содержать хотя бы одну заглавную букву")
        .regex(/[a-z]/, "Пароль должен содержать хотя бы одну строчную букву")
        .regex(/[0-9]/, "Пароль должен содержать хотя бы одну цифру"),
    name: z.string().min(2, "Имя должно содержать минимум 2 символа")
});


export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
