import createHttpError from "http-errors";
import { Id, idSchema, PaginationParameter, paginationParameterSchema } from "../../../../shared/zod_schemas/metadata";
import { z } from "zod/v4";

export function validatePagination(
    pagination: any
) : PaginationParameter {
    const parsed = paginationParameterSchema.safeParse(pagination)

    if (!parsed.success) {
        throw createHttpError.BadRequest(z.prettifyError(parsed.error))
    }

    const result : PaginationParameter = parsed.data
    return result;
}

export function validateId(
    id: string | number
) : Id {
    const parsed = idSchema.safeParse(id)

    if(!parsed.success) {
        throw createHttpError.BadRequest(z.prettifyError(parsed.error))
    }

    const result : Id = parsed.data;
    return result;
}