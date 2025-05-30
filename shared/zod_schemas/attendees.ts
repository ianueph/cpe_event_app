import { z } from "zod/v4";
import { apiResponseSchema } from "./metadata";

export type Attendee = z.infer<typeof attendeeSchema>
export type AttendeeResponseSchema = z.infer<typeof attendeeResponseSchema>

export const attendeeSchema = z.object({
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

export const attendeeResponseSchema = apiResponseSchema(attendeeSchema)