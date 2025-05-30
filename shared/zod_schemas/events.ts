import { z } from "zod/v4";
import dayjs from "dayjs";

export type Event = z.infer<typeof eventSchema>

export const eventEnum = z.enum([
    "Conference",
    "Meeting",
    "Sports",
    "Whatever",
])

export const eventSchema = z.object({
    event_id: z
    .coerce
    .number()
    .int()
    .nonnegative(),

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
    .iso
    .date(),

    start_time: z
    .iso
    .datetime({
        offset: true
    }),

    end_time: z
    .iso
    .datetime({
        offset: true
    }),

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