import { QueryConfig, QueryResult } from "pg";
import db from "../db"

export async function handleTransaction(
    queries : QueryConfig[]
) : Promise<QueryResult[]> {
    const client = await db.connect()
    var results : QueryResult[] = []

    try {
        await client.query("BEGIN");
        for (let i = 0; i < queries.length; i++) {
            results[i] = await client.query(queries[i]);
        }
        await client.query("COMMIT");
        return results;
    } catch (e) {
        await client.query("ROLLBACK");
        throw e
    } finally {
        client.release()
    }
}