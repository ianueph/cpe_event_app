import { getPaginationLinks } from "../../src/cpe_event_api/utils/links";
import { LinkMetadata } from "../../../shared/zod_schemas/metadata";

describe("getPaginationLinks", () => {
  const endpoint = "/api/events";

  it("returns only 'self' when on the only page", () => {
    const links = getPaginationLinks(endpoint, 1, 10, 5); // 1 page
    expect(links).toEqual([
      { rel: "self", href: "/api/events?page=1&size=10" }
    ]);
  });

  it("returns 'self' and 'next' when on the first page of multiple", () => {
    const links = getPaginationLinks(endpoint, 1, 10, 25); // 3 pages
    expect(links).toEqual([
      { rel: "self", href: "/api/events?page=1&size=10" },
      { rel: "next", href: "/api/events?page=2&size=10" }
    ]);
  });

  it("returns 'self', 'prev', and 'next' on a middle page", () => {
    const links = getPaginationLinks(endpoint, 2, 10, 30); // 3 pages
    expect(links).toEqual([
      { rel: "self", href: "/api/events?page=2&size=10" },
      { rel: "next", href: "/api/events?page=3&size=10" },
      { rel: "prev", href: "/api/events?page=1&size=10" }
    ]);
  });

  it("returns 'self' and 'prev' on the last page", () => {
    const links = getPaginationLinks(endpoint, 3, 10, 30); // last page
    expect(links).toEqual([
      { rel: "self", href: "/api/events?page=3&size=10" },
      { rel: "prev", href: "/api/events?page=2&size=10" }
    ]);
  });
});