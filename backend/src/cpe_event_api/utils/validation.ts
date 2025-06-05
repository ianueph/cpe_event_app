import { PaginationParameter, paginationParameterSchema } from "../../../../shared/zod_schemas/metadata";

export function validatePagination(
    pagination: any
) : PaginationParameter {
    const parsed = paginationParameterSchema.safeParse(pagination)

    if (!parsed.success) {
        throw parsed.error
    }

    const result : PaginationParameter = parsed.data
    return result;
}