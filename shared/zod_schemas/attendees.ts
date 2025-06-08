import { z } from "zod/v4";
import { apiResponseSchema, idSchema, linkMetadataSchema } from "./metadata";
import { createCreateSchema, createDataSchema, createUpdateSchema } from "./crud";

export type Attendee = z.infer<typeof attendeeSchema>
export type AttendeeCreate = z.infer<typeof attendeeCreateSchema>
export type AttendeeUpdate = z.infer<typeof attendeeUpdateSchema>
export type AttendeeData = z.infer<typeof attendeeDataSchema>
export type AttendeeResponse = z.infer<typeof attendeeResponseSchema>

export const attendeeSchema = z.object({
    id: idSchema,

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

export const attendeeCreateSchema = createCreateSchema(attendeeSchema)
export const attendeeUpdateSchema = createUpdateSchema(attendeeSchema)
export const attendeeDataSchema = createDataSchema(attendeeSchema)
export const attendeeResponseSchema = apiResponseSchema(attendeeDataSchema)