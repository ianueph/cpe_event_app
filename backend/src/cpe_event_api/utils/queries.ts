import { Query, QueryConfig } from "pg"
import { getColumns } from "./db"

type RowData = {
    [key: string]: any
}

export async function buildInsertQuery(
    table: string,
    data: RowData
) : Promise<QueryConfig> {
    const columns = Object.keys(data)
    if (columns.length === 0) {
        throw new Error("No data to create")
    }
    const values = Object.values(data);
    const placeholders = columns.map((column, i) => `$${i+1}`).join(", ")

    const query : QueryConfig = {
        text: `INSERT INTO ${table}(${columns.join(", ")}) VALUES(${placeholders}) RETURNING *`,
        values: values
    }

    return query
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