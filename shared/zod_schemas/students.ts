import { z } from "zod/v4";

export const ProgramTypes = z.enum([
    "Mechanical Engineering",
    "Computer Engineering",
    "Civil Engineering",
    "Electrical Engineering"
])

export const YearLevelTypes = z.enum([
    "1st",
    "2nd",
    "3rd",
    "4th"
])

export const Student = z.object({
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

    program: ProgramTypes,

    current_year: YearLevelTypes,

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