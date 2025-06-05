import { buildInsertQuery, buildUpdateQuery } from '../../src/cpe_event_api/utils/queries';

describe('buildUpdateQuery', () => {
  it('should generate a valid update query and values array', async () => {
    const query = await buildUpdateQuery(
      'events',
      'event_id',
      123,
      {
        event_name: 'New Event',
        event_description: 'Updated Description',
        registration_fee: 50
      }
    );

    expect(query).toEqual({
      text: 'UPDATE events SET event_name = $1, event_description = $2, registration_fee = $3 WHERE event_id = $4 RETURNING *',
      values: ['New Event', 'Updated Description', 50, 123]
    });
  });

  it('should throw an error if no fields to update', async () => {
    await expect(
      buildUpdateQuery('events', 'event_id', 123, {})
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