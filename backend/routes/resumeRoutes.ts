import express, { Request, Response, NextFunction } from 'express';
import { getResumes, uploadResume } from '../controllers/resumeController';

const router = express.Router();

// Get all resumes
router.get('/', getResumes);

// Upload and analyze resume
router.post('/upload', uploadResume);

export default router;
