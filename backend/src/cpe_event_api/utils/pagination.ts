export function getOffset(
    page : number,
    size : number,
) : number {
    return (page - 1) * size;
}

export function getTotalPages(
    totalEntries : number,
    size : number,
) : number {
    return Math.ceil(totalEntries / size)
}