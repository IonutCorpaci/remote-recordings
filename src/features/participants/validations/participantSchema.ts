import * as z from "zod";

export const addParticipantSchema = z.object({
  name: z.string().trim().min(2, "Имя должно содержать минимум 2 символа"),
});
