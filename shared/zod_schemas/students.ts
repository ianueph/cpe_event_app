import { z } from "zod/v4";
import { apiResponseSchema, linkMetadataSchema } from "./metadata";

export type Student = z.infer<typeof studentSchema>;
export type studentSchema = z.infer<typeof studentResponseSchema>;

export const programEnum = z.enum([
    "Mechanical Engineering",
    "Computer Engineering",
    "Civil Engineering",
    "Electrical Engineering"
])

export const yearLevelEnum = z.enum([
    "1st",
    "2nd",
    "3rd",
    "4th"
])

export const studentSchema = z.object({
    id: z
    .coerce
    .number()
    .int()
    .nonnegative(),

    first_name: z
    .coerce
    .string()
    .max(50)
    .nonempty(),

    last_name: z
    .coerce
    .string()
    .max(50)
    .nonempty(),

    middle_initial: z
    .coerce
    .string()
    .max(10)
    .nonempty(),

    program: programEnum,

    current_year: yearLevelEnum,

    ue_email: z
    .email()
    .max(128)
    .nonempty(),

    contact_number: z
    .coerce
    .string()
    .max(32)
    .nonempty(),

    student_number: z
    .coerce
    .string()
    .length(11)
    .nonempty()
})

export const studentDataSchema = studentSchema.extend({
    links: linkMetadataSchema.array()
})

export const studentResponseSchema = apiResponseSchema(studentSchema)