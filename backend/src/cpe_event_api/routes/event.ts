/*
GET 	/events/:event_id
GET 	/events/
POST	/events/
UPDATE	/events/:event_id
*/

import express from "express";
import {Event, eventCreateSchema, EventData, eventDataSchema, EventResponse, eventResponseSchema, eventSchema} from "../../../../shared/zod_schemas/events"
import { eventIdExists } from '../handlers/checkers';
import { QueryConfig } from "pg";
import db from '../db';
import { LinkMetadata, paginationParameterSchema } from "../../../../shared/zod_schemas/metadata";
import { getOffset, getTotalPages } from "../utils/pagination";
import { getPaginationLinks } from "../utils/links";

require('express-async-errors');
const router = express.Router()

router.param('event_id', async (req, res, next) => {
  const event_id = req.params.event_id; 
  
  const idSchema = eventSchema.shape.event_id;
  const parsed = idSchema.safeParse(event_id);

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
	.get(async (req, res, next) => {
		const pagination = req.query;
		const parsed = paginationParameterSchema.safeParse(pagination);

		if (!parsed.success) { 
			res.status(400);
			throw parsed.error;
		}

		const {page, size} = parsed.data
		const offset = getOffset(page, size)

		const fetchQuery : QueryConfig = {
		text: "SELECT * FROM events ORDER BY event_id DESC LIMIT $1 OFFSET $2",
		values: [size, offset]
		}
		const countQuery : QueryConfig = {
		text: "SELECT COUNT(*) FROM events"
		}

		const fetchResult = await db.query(fetchQuery);
		const countResult = await db.query(countQuery);

		const rows = fetchResult.rows as Event[]
		const data : EventData[] = rows.map((event) => ({
		...event,
		links: [
			{rel: "self", href: `/events/${event.event_id}`},
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
	.post(async (req, res, next) => {
		const event = req.body;  

		const parsed = eventCreateSchema.safeParse(event);
		if (!parsed.success) { 
			res.status(400);
			throw parsed.error;
		}

		const {
			event_name,
			event_description,
			event_type,
			date,
			start_time,
			end_time,
			registration_fee,
			oic
		} = parsed.data;

		const insertQuery : QueryConfig = {
			text: "INSERT INTO events(\
				event_name,\
				event_description,\
				event_type,\
				date,\
				start_time,\
				end_time,\
				registration_fee,\
				oic\
				) VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
			values: [
				event_name,
				event_description,
				event_type,
				date,
				start_time,
				end_time,
				registration_fee,
				oic
			]
		}

		const result = await db.query(insertQuery);

		if (!result.rowCount) {
			res.status(500)
			throw new Error("Internal server error: Event creation failed");
		}

		const rows = result.rows as Event[];
		const data : EventData[] = rows.map((event) => ({
			...event,
			links: [
				{rel: "self", href: `/events/${event.event_id}`}
			]
		}));

		const parsedData = eventDataSchema.safeParse(data[0]);

		if (!parsedData.success) { 
			res.status(500)
			throw parsedData.error;
		}

		res.status(200).json(parsedData.data);
	})

export default router;