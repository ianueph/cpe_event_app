import { getTables, getColumns } from "../../src/cpe_event_api/utils/db";
import db from "../../src/cpe_event_api/db";

jest.mock("../../src/cpe_event_api/db");

const mockedDb = db as unknown as {
  query: jest.Mock<Promise<{ 
    rows: { 
        table_name?: string,
        column_name?: string,
    }[] 
}>, any>
};

describe("getTables", () => {
  it("returns table names", async () => {
    mockedDb.query.mockResolvedValueOnce({
      rows: [
        { table_name: "events" },
        { table_name: "users" }
      ]
    });

    const tables = await getTables();
    expect(tables).toEqual(["events", "users"]);
  });
});

describe("getColumns", () => {
  it("returns column names for a table", async () => {
    mockedDb.query.mockResolvedValueOnce({
      rows: [
        { column_name: "id" },
        { column_name: "event_name" }
      ]
    });

    const columns = await getColumns("events");
    expect(columns).toEqual(["id", "event_name"]);
  });
});