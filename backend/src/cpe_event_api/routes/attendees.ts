/** 
GET 	  /attendees/:event_id
GET 	  /attendees/:student_number
GET 	  /attendees/:id
GET 	  /attendees/
POST	  /attendees/
PUT   	/attendees/:id
DELETE  /attendees/:id
**/

import express from 'express';
import db from "../db";
import { Attendee, attendeeCreateSchema, AttendeeData, attendeeDataSchema, AttendeeResponse, attendeeResponseSchema, attendeeSchema } from "../../../../shared/zod_schemas/attendees"
import { idSchema, LinkMetadata, paginationParameterSchema } from "../../../../shared/zod_schemas/metadata"
import { 
  eventIdExists, 
  studentNumberExists, 
  attendeeIdExists 
} from '../handlers/checkers';
import { Query, QueryConfig } from 'pg';
import { getOffset, getTotalPages } from '../utils/pagination';
import { getPaginationLinks } from '../utils/links';
import { z } from 'zod';
import { validateId, validatePagination, validateResponse } from '../utils/validation';
import createHttpError from 'http-errors';

require('express-async-errors');
const router = express.Router();

/*
Parameter validation
*/
router.param('event_id', async (req, res, next) => {
  const id = validateId(req.params.event_id)
  
  const exists = await eventIdExists(id);

  if (!exists) {
    res.status(404);
    throw Error("Event not found.");
  }	

  next();
})
router.param('student_number', async (req, res, next) => {
  const student_number = req.params.student_number; 
  
  const studentNumberSchema = attendeeSchema.shape.student_number;
  const parsed = studentNumberSchema.safeParse(student_number);

  if (!parsed.success) { 
    res.status(400);
    throw parsed.error
  }

  const exists = await studentNumberExists(parsed.data);

  if (!exists) {
    res.status(404);
    throw new Error("Student not found");
  }

  next()
})
router.param('id', async (req, res, next) => {
  const attendee_id = req.params.id; 
  
  const idSchema = attendeeSchema.shape.id;
  const parsed = idSchema.safeParse(attendee_id);

  if (!parsed.success) { 
    res.status(400);
    throw parsed.error
  }

  const exists = await attendeeIdExists(parsed.data);

  if (!exists) {
    res.status(404);
    throw new Error("Attendee not found")
  }

  next()
})

/*
Declare routes
*/

router.get("/event/:event_id", (req, res) => {
  // return all attendees by event_id, paginated
});
router.get("/student/:student_number", (req, res) => {
  // return all attended events by student_number, paginated
});
router.route('/')
  .get(async (req, res) => {
    const pagination = validatePagination(req.query)
    const {page, size} = pagination
    const offset = getOffset(page, size)

    const fetchQuery : QueryConfig = {
      text: "SELECT * FROM attendees ORDER BY id DESC LIMIT $1 OFFSET $2",
      values: [size, offset]
    }
    const countQuery : QueryConfig = {
      text: "SELECT COUNT(*) FROM attendees"
    }

    const fetchResult = await db.query(fetchQuery);
    const countResult = await db.query(countQuery);

    const rows = fetchResult.rows as Attendee[]
    const data : AttendeeData[] = rows.map((attendee) => ({
      ...attendee,
      links: [
        {rel: "self", href: `/attendees/${attendee.id}`},
        {rel: "event", href: `/attendees/event/${attendee.event_id}`},
        {rel: "student", href: `/attendees/student_number/${attendee.student_number}`},
      ]
    }));

    const totalEntries = parseInt(countResult.rows[0].count)
    const totalPages =  getTotalPages(totalEntries, size);

    const links : LinkMetadata[] = getPaginationLinks('/attendees/', page, size, totalEntries);

    const response : AttendeeResponse = {
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

    const parsedResponse = validateResponse(response, attendeeResponseSchema)
    
    res.status(200).json(parsedResponse);
  })
  .post(async (req, res, next) => {
    const attendee = req.body;  

    const parsed = attendeeCreateSchema.safeParse(attendee);
    if (!parsed.success) { 
      res.status(400);
      throw parsed.error
    }

    const { event_id, payment, student_number } = parsed.data

    const insertQuery : QueryConfig = {
      text: "INSERT INTO attendees(event_id, payment, student_number) VALUES($1, $2, $3) RETURNING *",
      values: [event_id, payment, student_number]
    }

    const result = await db.query(insertQuery);

    if (!result.rowCount) {
      res.status(500)
      throw new Error("Internal server error: Attendee creation failed");
    }

    const data : AttendeeData[] = result.rows.map((attendee : Attendee) => ({
      ...attendee,
      links: [
        {rel: "self", href: `/attendees/${attendee.id}`},
        {rel: "event", href: `/attendees/event/${attendee.event_id}`},
        {rel: "student", href: `/attendees/student_number/${attendee.student_number}`},
      ]
    }));

    const parsedData = attendeeDataSchema.safeParse(data[0]);

    if (!parsedData.success) { 
      res.status(500)
      throw parsedData.error;
    }

    res.status(201).json(parsedData.data);
  })
router.route('/:id')
  .get((req, res) => {
    // return attendee by ID
  })
  .put((req, res) => {
    // updates an existing entry
  })
  .delete((req, res) => {
    // delete an entry
  })

export default router;