import { z } from "zod/v4";
import dayjs from "dayjs";
import { apiResponseSchema, idSchema, linkMetadataSchema } from "./metadata";

export type Event = z.infer<typeof eventSchema>
export type EventCreate = z.infer<typeof eventCreateSchema>
export type EventUpdate = z.infer<typeof eventUpdateSchema>
export type EventData = z.infer<typeof eventDataSchema>
export type EventResponse = z.infer<typeof eventResponseSchema>
export type EventTypes = z.infer<typeof eventEnum>

export const eventEnum = z.enum([
    "Conference",
    "Meeting",
    "Sports",
    "Whatever",
])

export const eventSchema = z.object({
    id: idSchema,

    event_name: z
    .coerce
    .string()
    .max(128)
    .nonempty(),

    event_description: z
    .coerce
    .string()
    .max(4096)
    .optional(),

    event_type: eventEnum,

    date: z
    .coerce
    .date(),

    start_time: z
    .coerce
    .date(),

    end_time: z
    .coerce
    .date(),

    registration_fee: z
    .float32()
    .nonnegative(),

    oic: z.
    coerce
    .string()
    .max(128),

}).check(
    (ctx) => {
        const start_time = dayjs(ctx.value.start_time);
        const end_time = dayjs(ctx.value.end_time);

        // Check if time range is invalid
        if (start_time.isAfter(end_time)) {
            ctx.issues.push({
                code: "custom",
                message: `start_time cannot be after end_time`,
                input: [start_time, end_time],
            })
        }
    }
)

export const eventCreateSchema = eventSchema.omit({
    id: true
})

export const eventUpdateSchema = eventSchema.partial({
    event_name: true,
    event_type: true,
    date: true,
    start_time: true,
    end_time: true,
    registration_fee: true,
    oic: true
})

export const eventDataSchema = eventSchema.extend({
    links: linkMetadataSchema.array()
})

export const eventResponseSchema = apiResponseSchema(eventSchema)