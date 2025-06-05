import { buildUpdateQuery } from '../../src/cpe_event_api/utils/queries';

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