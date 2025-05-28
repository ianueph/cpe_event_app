import { z } from "zod/v4";

export const Attendee = z.object({
    id: z
    .coerce
    .number()
    .int()
    .nonnegative(),

    student_number: z
    .coerce
    .string()
    .length(11),

    payment: z
    .float32()
    .nonnegative(),

    event_id: z
    .coerce
    .number()
    .int()
    .nonnegative(),
})