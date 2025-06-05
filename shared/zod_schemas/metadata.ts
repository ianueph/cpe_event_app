import { z } from "zod/v4";

export type Id = z.infer<typeof idSchema>;
export type PaginationParameter = z.infer<typeof paginationParameterSchema>;
export type PaginationMetadata = z.infer<typeof paginationMetadataSchema>;
export type LinkMetadata = z.infer<typeof linkMetadataSchema>;

export const idSchema = z
    .coerce
    .number()
    .int()
    .nonnegative()

export const linkMetadataSchema = z.object({
    rel: z
    .coerce
    .string()
    .nonoptional(),

    href: z
    .coerce
    .string()
    .nonoptional()
})

export const paginationParameterSchema = z.object({
    page: z
    .coerce
    .number()
    .min(1)
    .max(999)
    .nonnegative()
    .default(1),

    size: z
    .coerce
    .number()
    .min(1)
    .max(999)
    .nonnegative()
    .default(10)
})

export const paginationMetadataSchema = z.object({
    page: z
    .coerce
    .number()
    .min(1)
    .max(999)
    .default(1),

    size: z
    .coerce
    .number()
    .min(1)
    .max(999)
    .default(10),

    offset: z
    .coerce
    .number()
    .min(0)
    .max(999*999)
    .default(10),

    total_pages: z
    .coerce
    .number()
    .nonnegative(),

    total_entries: z
    .coerce
    .number()
    .nonnegative(),
})

export const paginatedResponseSchema = <T extends z.ZodType>(dataSchema: T) => 
    z.object({
        data: dataSchema.array(),
        meta: paginationMetadataSchema.optional,
        links: linkMetadataSchema.array(),
    });

export const apiResponseSchema = <T extends z.ZodType>(dataSchema: T) => 
    z.object({
        data: dataSchema.array(),
        meta: z.object({
            pagination: paginationMetadataSchema.optional(),
            // something else maybe for v2?
        }),
        links: linkMetadataSchema.array().optional(),
    });


