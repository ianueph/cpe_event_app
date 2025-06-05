export function getOffset(
    page : number,
    size : number,
) : number {

    if (page <= 0) { return 0; }
    if (size <= 0) { return 0; }

    return (page - 1) * size;
}

export function getTotalPages(
    totalEntries : number,
    size : number,
) : number {

    if (totalEntries <= 0) { return 0; }
    if (size <= 0) { return 0; }
    
    return Math.ceil(totalEntries / size)
}