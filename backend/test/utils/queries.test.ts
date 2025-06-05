import { buildPaginatedSelectAllQuery, buildCountQuery, buildInsertQuery, buildUpdateQuery } from '../../src/cpe_event_api/utils/queries';

describe('buildPaginatedSelectAllQuery', () => {
  it('should create a valid SELECT * query', async () => {
    const query = await buildPaginatedSelectAllQuery(
      'events',   // table name
      'id', // id
      5,          // size
      10,         // offset
      'DESC',     // order
    );

    expect(query).toEqual({
			text: "SELECT * FROM events ORDER BY id DESC LIMIT $1 OFFSET $2",
			values: [5, 10]
		})
  }),

  it('should default to ASC if no order is specified', async () => {
    const query = await buildPaginatedSelectAllQuery('events', 'id', 5, 0);
    expect(query.text).toBe("SELECT * FROM events ORDER BY id ASC LIMIT $1 OFFSET $2");
  }),

  it('should throw an error on invalid table name', async () => {
    await expect(buildPaginatedSelectAllQuery('', 'id', 5, 0)).rejects.toThrow();
  })
})

describe('buildCountQuery', () => {
  it('should create a valid COUNT(*) query', async () => {
    const query = await buildCountQuery(
      'events'
    );

    expect(query).toEqual({
			text: "SELECT COUNT(*) FROM events"
		})
  }),

  it('should throw an error on invalid table name', async () => {
    await expect(buildCountQuery('')).rejects.toThrow();
  })
})

describe('buildUpdateQuery', () => {
  it('should generate a valid update query and values array', async () => {
    const query = await buildUpdateQuery(
      'events',
      'id',
      123,
      {
        event_name: 'New Event',
        event_description: 'Updated Description',
        registration_fee: 50
      }
    );

    expect(query).toEqual({
      text: 'UPDATE events SET event_name = $1, event_description = $2, registration_fee = $3 WHERE id = $4 RETURNING *',
      values: ['New Event', 'Updated Description', 50, 123]
    });
  });

  it('should throw an error if no fields to update', async () => {
    await expect(
      buildUpdateQuery('events', 'id', 123, {})
    ).rejects.toThrow('No fields to update');
  });
});

describe("buildInsertQuery", () => {
  it("builds a correct INSERT query", async () => {
    const data = {
      event_name: "Hackathon",
      event_description: "24hr coding",
      event_type: "Conference",
      date: "2025-07-01",
      start_time: "10:00",
      end_time: "18:00",
      registration_fee: 100,
      oic: "John Doe"
    };

    const query = await buildInsertQuery("events", data);

    expect(query.text).toBe(
      "INSERT INTO events(event_name, event_description, event_type, date, start_time, end_time, registration_fee, oic) VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *"
    );

    expect(query.values).toEqual([
      "Hackathon",
      "24hr coding",
      "Conference",
      "2025-07-01",
      "10:00",
      "18:00",
      100,
      "John Doe"
    ]);
  });
});