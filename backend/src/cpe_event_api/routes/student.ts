/*
GET 	/students/:student_number
GET 	/students/
POST	/students/
UPDATE	/students/:student_number
DELETE	/students/:student_number 	TODO: Batch
*/

import express from "express";

require('express-async-errors');
const router = express.Router()

router.param('student_number', async (req, res, next) => {
})

router.route("/")
	.get(async (req, res) => {
	})
	.post(async (req, res) => {
	})

router.route('/:student_number')
	.get(async (req, res) => {
	})
	.put(async (req, res) => {
	})
	.delete(async (req, res) => {
	})

export default router;