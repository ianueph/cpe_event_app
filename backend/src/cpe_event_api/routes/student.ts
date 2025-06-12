/*
GET 	/students/:student_number
GET 	/students/
POST	/students/
UPDATE	/students/:id
DELETE	/students/:id 	TODO: Batch
*/

import express from "express";
import { validate, validateId, validatePagination, validateResponse, validateStudentNumber } from "../utils/validation";
import { studentIdExists, studentNumberExists } from "../handlers/checkers";
import { getOffset, getTotalPages } from "../utils/pagination";
import { handleTransaction } from "../handlers/transactions";
import { buildCountQuery, buildDeleteQuery, buildInsertQuery, buildPaginatedSelectAllQuery, buildSelectOneQuery, buildUpdateQuery } from "../utils/queries";
import { attachLinks, getPaginationLinks } from "../utils/links";
import { studentCreateSchema, studentDataSchema, StudentResponse, studentResponseSchema, studentUpdateSchema } from "../../../../shared/zod_schemas/students";
import { QueryConfig } from "pg";
import db from "../db";

require('express-async-errors');
const router = express.Router()

router.param('id', async (req, res, next) => {
    const id = validateId(req.params.id)

    const exists = await studentIdExists(id);
    if (!exists) {
        res.status(404);
        throw Error("Student not found.");
    }	

    next();
})

router.route("/")
	.get(async (req, res) => {
        const pagination = validatePagination(req.query)
        const {page, size} = pagination
        const offset = getOffset(page, size)
        const [fetchResult, countResult] = await handleTransaction([
            await buildPaginatedSelectAllQuery('students', 'student_number', size, offset),
            await buildCountQuery('students')
        ])

        const data = attachLinks(fetchResult.rows, (student) => ([
            {rel: "self", href: `/students/${student.student_number}`}
        ]))

        const totalEntries = parseInt(countResult.rows[0].count)
        const totalPages =  getTotalPages(totalEntries, size);
        const links = getPaginationLinks('/students/', page, size, totalEntries);
        const response : StudentResponse = {
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
        const parsedResponse = validateResponse(response, studentResponseSchema)
        
        res.status(200).json(parsedResponse);	
	})
	.post(async (req, res) => {
        const student = req.body;  
		const parsed = validate(student, studentCreateSchema)

		const insertQuery : QueryConfig = await buildInsertQuery('students', parsed)
		const result = await db.query(insertQuery);
		if (!result.rowCount) {
			res.status(500)
			throw new Error("Internal server error: Student creation failed");
		}

		const data = attachLinks(result.rows, (student) => ([
			{rel: "self", href: `/students/${student.student_number}`}
		]))

		const parsedData = validate(data[0], studentDataSchema)

		res.status(201).json(parsedData);
	})
	
router.route('/:id')
    .get(async (req, res) => {
		const id = parseInt(req.params.id)

		const query : QueryConfig = await buildSelectOneQuery('students', id)
		const result = await db.query(query);
		const data = attachLinks(result.rows, (student) => ([
			{rel: "self", href: `/students/${student.id}`}
		]))

		const parsedData = validate(data[0], studentDataSchema)

		res.status(200).json(parsedData);
	})
	.put(async (req, res) => {
		const id = parseInt(req.params.id)
		req.body.id = id

		const parsed = validate(req.body, studentUpdateSchema)

		const query : QueryConfig = await buildUpdateQuery('students', 'id', id, parsed)
		const result = await db.query(query);

		const data = attachLinks(result.rows, (student) => ([
			{rel: "self", href: `/students/${id}`}
		]))

		const parsedData = validate(data[0], studentDataSchema)

		res.status(200).json(parsedData);
	})
	.delete(async (req, res) => {
		const id = parseInt(req.params.id);

		const query = await buildDeleteQuery("students", id)
		const result = await db.query(query);

		const data = attachLinks(result.rows, (student) => ([
			{rel: "self", href: `/students/${student.id}`}
		]))

		const parsedData = validate(data[0], studentDataSchema)

		res.status(200).json(parsedData);
	})

export default router;