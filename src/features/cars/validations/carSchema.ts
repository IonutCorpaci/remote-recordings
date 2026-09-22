import * as z from "zod";

export const addCarSchema = z.object({
  // carModel is removed
  totalSeats: z.coerce.number().min(2, "В машине должно быть как минимум 2 места (водитель + 1 пассажир)"),
});
