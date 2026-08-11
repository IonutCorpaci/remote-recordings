import * as z from "zod"

export const createUpdateTripSchema = z.object({
    title: z.string().min(1, "Введите название поездки"),
    destination: z.string().min(1, "Укажите город"),
    date: z.coerce.date({
        message: "Укажите корректную дату",
    }),
    notes: z.string().optional()
});

export type CreateUpdateTripInput = z.infer<typeof createUpdateTripSchema>;
