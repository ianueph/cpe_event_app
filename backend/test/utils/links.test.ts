import { attachLinks, getPaginationLinks } from "../../src/cpe_event_api/utils/links";
import { LinkMetadata } from "../../../shared/zod_schemas/metadata";
import { Event, EventData, eventDataSchema } from "../../../shared/zod_schemas/events";
import { z } from "zod/v4";

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

describe("attachLinks", () => {
  it("should be able to attach valid links to a list of objects", () => {
    const data : Event[] = [
      {
        id: 1,
        event_name: "Tech Conference 2025",
        event_description: "An annual gathering of developers, engineers, and tech leaders.",
        event_type: "Conference",
        date: new Date("2025-08-15"),
        start_time: new Date("2025-08-15T09:00:00"),
        end_time: new Date("2025-08-15T17:00:00"),
        registration_fee: 150.00,
        oic: "Jane Doe",
      },
      {
        id: 2,
        event_name: "Quarterly Planning Meeting",
        event_description: "Internal meeting to discuss goals and KPIs for the next quarter.",
        event_type: "Meeting",
        date: new Date("2025-07-01"),
        start_time: new Date("2025-07-01T13:00:00"),
        end_time: new Date("2025-07-01T15:30:00"),
        registration_fee: 0.00,
        oic: "John Smith",
      },
      {
        id: 3,
        event_name: "Charity Football Match",
        event_description: "A fundraising sports event featuring local teams.",
        event_type: "Sports",
        date: new Date("2025-09-10"),
        start_time: new Date("2025-09-10T16:00:00"),
        end_time: new Date("2025-09-10T18:00:00"),
        registration_fee: 20.00,
        oic: "Alex Mendoza",
      },
      {
        id: 4,
        event_name: "Board Game Night",
        event_description: "An informal night of board games and snacks. Open to all.",
        event_type: "Whatever",
        date: new Date("2025-06-20"),
        start_time: new Date("2025-06-20T18:30:00"),
        end_time: new Date("2025-06-20T22:00:00"),
        registration_fee: 5.00,
        oic: "Chris Tan",
      },
      {
        id: 5,
        event_name: "Startup Pitch Demo Day",
        event_description: "Early-stage startups pitch their ideas to investors and mentors.",
        event_type: "Conference",
        date: new Date("2025-11-05"),
        start_time: new Date("2025-11-05T10:00:00"),
        end_time: new Date("2025-11-05T14:00:00"),
        registration_fee: 100.00,
        oic: "Dana Lee",
      },
    ];

    const transformed = attachLinks(data, (event) => ([
      { rel: "self", href: `/events/${event.id}` }
    ]))

    const parsed = z.array(eventDataSchema).safeParse(transformed);

    expect((parsed.success)).toBeTruthy()
  })

  it("returns empty array when input is empty", () => {
    const result = attachLinks([], () => []);
    expect(result).toEqual([]);
  });

  it("preserves original data", () => {
    const data = [{ id: 1, name: "Test" }];
    const linkBuilder = () => [{ rel: "self", href: "/fake" }];

    const result = attachLinks(data, linkBuilder);

    expect(result[0].id).toBe(1);
    expect(result[0].name).toBe("Test");
  });
})