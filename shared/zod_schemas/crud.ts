import { ZodObject } from "zod/v4";
import { linkMetadataSchema } from "./metadata";

// assume all schemas have ids

export function createCreateSchema<S extends ZodObject>(
    schema: S
) : ZodObject {
    if (!("id" in schema.shape)) {
        throw new Error("Invalid schema")
    }

    return schema.omit({
        id: true 
    })
}

export function createUpdateSchema<S extends ZodObject>(
    schema: S
) : ZodObject {
    return createCreateSchema(schema).partial();
}

export function createDataSchema<S extends ZodObject> (
    schema: S
) : ZodObject {
    return schema.extend({
        links: linkMetadataSchema.array()
    })
}