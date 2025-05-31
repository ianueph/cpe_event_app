import { LinkMetadata } from "../../../../shared/zod_schemas/metadata";
import { getTotalPages } from "./pagination";

export function getPaginationLinks(
    endpoint: string,
    page: number,
    size: number,
    totalEntries: number
) : LinkMetadata[] {
    const totalPages = getTotalPages(totalEntries, size);
    const links: LinkMetadata[] = [];

    links.push({ rel: "self", href: `${endpoint}?page=${page}&size=${size}` });

    if (page < totalPages) {
      links.push({ rel: "next", href: `${endpoint}?page=${page + 1}&size=${size}` });
    }

    if (page > 1) {
      links.push({ rel: "prev", href: `${endpoint}?page=${page - 1}&size=${size}` });
    }

    return links;
}