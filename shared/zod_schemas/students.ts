import { z } from "zod/v4";
import { apiResponseSchema, idSchema, linkMetadataSchema } from "./metadata";
import { createCreateSchema, createDataSchema, createUpdateSchema } from "./crud";

export type ProgramTypes = z.infer<typeof programEnum>
export type YearLevelTypes = z.infer<typeof yearLevelEnum>
export type StudentSchema = z.infer<typeof studentSchema>
export type StudentCreate = z.infer<typeof studentCreateSchema>
export type StudentUpdate = z.infer<typeof studentUpdateSchema>
export type StudentResponse = z.infer<typeof studentResponseSchema>

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
    id: idSchema,

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

export const studentCreateSchema = createCreateSchema(studentSchema)
export const studentUpdateSchema = createUpdateSchema(studentSchema)
export const studentDataSchema = createDataSchema(studentSchema)
export const studentResponseSchema = apiResponseSchema(studentSchema)