/*
GET 	/events/:id
GET 	/events/
POST	/events/		  	TODO: Batch
UPDATE	/events/:id
DELETE	/events/:id 	TODO: Batch
*/

import express from "express";
import {Event, eventCreateSchema, EventData, eventDataSchema, EventResponse, eventResponseSchema, eventSchema, eventUpdateSchema} from "../../../../shared/zod_schemas/events"
import { eventIdExists } from '../handlers/checkers';
import { QueryConfig } from "pg";
import db from '../db';
import { LinkMetadata, paginationParameterSchema } from "../../../../shared/zod_schemas/metadata";
import { getOffset, getTotalPages } from "../utils/pagination";
import { getPaginationLinks } from "../utils/links";
import { getColumns } from "../utils/db";
import { buildCountQuery, buildInsertQuery, buildPaginatedSelectAllQuery, buildUpdateQuery } from "../utils/queries";
import { handleTransaction } from "../handlers/transactions";
import { validatePagination } from "../utils/validation";

require('express-async-errors');
const router = express.Router()

router.param('id', async (req, res, next) => {
  const id = req.params.id; 
  
  const idSchema = eventSchema.shape.id;
  const parsed = idSchema.safeParse(id);

  if (!parsed.success) { 
    throw parsed.error;
  }

  const exists = await eventIdExists(parsed.data);

	if (!exists) {
		res.status(404);
		throw Error("Event not found.");
	}	

  next();
})

router.route("/")
	.get(async (req, res) => {
		const pagination = validatePagination(req.query)
		const {page, size} = pagination
		const offset = getOffset(page, size)

		const [fetchResult, countResult] = await handleTransaction([
			await buildPaginatedSelectAllQuery('events', 'id', size, offset),
			await buildCountQuery('events')
		])

		const rows = fetchResult.rows as Event[]
		const data : EventData[] = rows.map((event) => ({
			...event,
			links: [
				{rel: "self", href: `/events/${event.id}`},
			]
		}));

		const totalEntries = parseInt(countResult.rows[0].count)
		const totalPages =  getTotalPages(totalEntries, size);

		const links : LinkMetadata[] = getPaginationLinks('/events/', page, size, totalEntries);

		const response : EventResponse = {
			data: data,
			meta: {
				pagination: {
				page: page,
				size: size,
				offset: offset,
				total_entries: totalEntries,
				total_pages: totalPages
				}
			},
			links: links
		}

		const parsedResponse = eventResponseSchema.safeParse(response);

		if (!parsedResponse.success) { 
			res.status(500);
			throw parsedResponse.error;
		}
		
		res.status(200).json(response);
	})
	.post(async (req, res) => {
		const event = req.body;  

		const parsed = eventCreateSchema.safeParse(event);
		if (!parsed.success) { 
			res.status(400);
			throw parsed.error;
		}

		const insertQuery : QueryConfig = await buildInsertQuery('events', parsed.data)

		const result = await db.query(insertQuery);

		if (!result.rowCount) {
			res.status(500)
			throw new Error("Internal server error: Event creation failed");
		}

		const rows = result.rows as Event[];
		const data : EventData[] = rows.map((event) => ({
			...event,
			links: [
				{rel: "self", href: `/events/${event.id}`}
			]
		}));

		const parsedData = eventDataSchema.safeParse(data[0]);

		if (!parsedData.success) { 
			res.status(500)
			throw parsedData.error;
		}

		res.status(201).json(parsedData.data);
	})

router.route('/:id')
	.get(async (req, res) => {
		const id = req.params.id

		const query : QueryConfig = {
			text: "SELECT * FROM events WHERE id = $1",
			values: [id]
		}

		const result = await db.query(query);

		const rows = result.rows as Event[];
		const data : EventData[] = rows.map((event) => ({
			...event,
			links: [
				{rel: "self", href: `/events/${event.id}`}
			]
		}));

		const parsedData = eventDataSchema.safeParse(data[0]);

		if (!parsedData.success) { 
			res.status(500)
			throw parsedData.error;
		}

		res.status(200).json(parsedData.data);
	})
	.put(async (req, res) => {
		const id = parseInt(req.params.id)
		req.body.id = id

		const parsed = eventUpdateSchema.safeParse(req.body);
		if (!parsed.success) { 
			res.status(500)
			throw parsed.error;
		}

		const query : QueryConfig = await buildUpdateQuery('events', 'id', id, parsed.data)

		const result = await db.query(query);

		const rows = result.rows as Event[];
		const data : EventData[] = rows.map((event) => ({
			...event,
			links: [
				{rel: "self", href: `/events/${event.id}`}
			]
		}));

		const parsedData = eventDataSchema.safeParse(data[0]);

		if (!parsedData.success) { 
			res.status(500)
			throw parsedData.error;
		}

		res.status(200).json(parsedData.data);
	})
	.delete(async (req, res) => {
		const id = req.params.id;

		const query : QueryConfig = {
			text: "DELETE from events WHERE id = $1 RETURNING *",
			values: [id]
		}

		const result = await db.query(query);

		const rows = result.rows as Event[];
		const data : EventData[] = rows.map((event) => ({
			...event,
			links: []
		}));

		const parsedData = eventDataSchema.safeParse(data[0]);

		if (!parsedData.success) { 
			res.status(500)
			throw parsedData.error;
		}

		res.status(200).json(parsedData.data);
	})

export default router;