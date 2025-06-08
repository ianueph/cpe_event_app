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
import { idSchema, LinkMetadata, paginationParameterSchema } from "../../../../shared/zod_schemas/metadata";
import { getOffset, getTotalPages } from "../utils/pagination";
import { attachLinks, getPaginationLinks } from "../utils/links";
import { getColumns } from "../utils/db";
import { buildCountQuery, buildDeleteQuery, buildInsertQuery, buildPaginatedSelectAllQuery, buildSelectOneQuery, buildUpdateQuery } from "../utils/queries";
import { handleTransaction } from "../handlers/transactions";
import { validateId, validatePagination, validateResponse } from "../utils/validation";

require('express-async-errors');
const router = express.Router()

router.param('id', async (req, res, next) => {
	const id = validateId(req.params.id)

	const exists = await eventIdExists(id);
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

		const data = attachLinks(fetchResult.rows, (event) => ([
			{rel: "self", href: `/events/${event.id}`}
		]))

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
		const parsedResponse = validateResponse(response, eventResponseSchema)
		
		res.status(200).json(parsedResponse);
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

		const data = attachLinks(result.rows, (event) => ([
			{rel: "self", href: `/events/${event.id}`}
		]))

		const parsedData = eventDataSchema.safeParse(data[0]);
		if (!parsedData.success) { 
			res.status(500)
			throw parsedData.error;
		}

		res.status(201).json(parsedData.data);
	})

router.route('/:id')
	.get(async (req, res) => {
		const id = parseInt(req.params.id)

		const query : QueryConfig = await buildSelectOneQuery('events', id)
		const result = await db.query(query);
		const data = attachLinks(result.rows, (event) => ([
			{rel: "self", href: `/events/${event.id}`}
		]))

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

		const data = attachLinks(result.rows, (event) => ([
			{rel: "self", href: `/events/${event.id}`}
		]))

		const parsedData = eventDataSchema.safeParse(data[0]);
		if (!parsedData.success) { 
			res.status(500)
			throw parsedData.error;
		}

		res.status(200).json(parsedData.data);
	})
	.delete(async (req, res) => {
		const id = parseInt(req.params.id);

		const query = await buildDeleteQuery("events", id)
		const result = await db.query(query);

		const data = attachLinks(result.rows, (event) => ([
			{rel: "self", href: `/events/${event.id}`}
		]))

		const parsedData = eventDataSchema.safeParse(data[0]);
		if (!parsedData.success) { 
			res.status(500)
			throw parsedData.error;
		}

		res.status(200).json(parsedData.data);
	})

export default router;