import { z } from "zod/v4";
import { apiResponseSchema, linkMetadataSchema } from "./metadata";

export type Attendee = z.infer<typeof attendeeSchema>
export type AttendeeData = z.infer<typeof attendeeDataSchema>
export type AttendeeResponse = z.infer<typeof attendeeResponseSchema>

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

export const attendeeCreateSchema = attendeeSchema.omit({
    id: true
})

export const attendeeDataSchema = attendeeSchema.extend({
    links: linkMetadataSchema.array()
})

export const attendeeResponseSchema = apiResponseSchema(attendeeDataSchema)