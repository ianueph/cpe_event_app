import { QueryConfig } from "pg"
import db from "../db/index"

export async function getTables() : Promise<String[]> {
    const query : QueryConfig = {
        name: "get-tables",
        text: `SELECT table_name\
                FROM information_schema.tables\
                WHERE table_schema = 'public'`
    }
    const result = await db.query(query)

    const tables = result.rows.map(row => row.table_name)

    return tables
}

export async function getColumns(
    table_name: String
) : Promise<String[]> {
    const query : QueryConfig = {
        name: "get-column-from-table",
        text: `SELECT column_name\
                FROM information_schema.columns\
                WHERE table_name = $1`,
        values: [table_name]
    }
    const result = await db.query(query)

    const columns = result.rows.map(row => row.column_name)

    return columns
}