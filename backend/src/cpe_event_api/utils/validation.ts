import createHttpError from "http-errors";
import { Id, idSchema, PaginationParameter, paginationParameterSchema, apiResponseSchema } from "../../../../shared/zod_schemas/metadata";
import { z, ZodType } from "zod/v4";

export function validate<T, S extends ZodType<T>>(
    input : unknown,
    schema : S
) : z.infer<S> {
    const parsed = schema.safeParse(input);

    if (!parsed.success) {
        throw new createHttpError.BadRequest(z.prettifyError(parsed.error))
    }

    return parsed.data;
}

export function validatePagination(
    pagination: any
) : PaginationParameter {
    return validate(pagination, paginationParameterSchema)
}

export function validateId(
    id: string | number
) : Id {
    return validate(id, idSchema);
}

export function validateResponse<T extends z.ZodType>(
    response: unknown,
    schema: ReturnType<typeof apiResponseSchema<T>>
) : z.infer<typeof schema> {
    return validate(response, schema);
}