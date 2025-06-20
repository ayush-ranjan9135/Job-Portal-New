import express from 'express'
import { getJobById, getJobs } from '../controllers/JobController.js'

const router = express.Router()

// Route to get all jobs
router.get('/', getJobs)

// Route to get a job by ID
router.get('/:id', getJobById)

export default router
