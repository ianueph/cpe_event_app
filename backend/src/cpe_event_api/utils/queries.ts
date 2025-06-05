import { Query, QueryConfig } from "pg"
import { getColumns } from "./db"

type RowData = {
    [key: string]: any
}

export async function buildCreateQuery() {

}

export async function buildUpdateQuery(
    table: string,
    idColumn: string,
    idValue: number,
    data: RowData
) : Promise<QueryConfig> {
    const columns = Object.keys(data).filter(k => k !== idColumn);
    if (columns.length === 0) {
        throw new Error("No fields to update");
    }

    const setClause = columns.map((column, i) => `${column} = $${i+1}`).join(', ');

    const values = columns.map(k => data[k]);
    values.push(idValue);

    const query : QueryConfig = {
        text: `UPDATE ${table} SET ${setClause} WHERE ${idColumn} = $${columns.length+1} RETURNING *`,
        values
    }

    return query;
}