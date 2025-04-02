import { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';
import pool from '../services/dbService';
import fs from 'fs';
import { analyzeResume } from '../services/aiService';
import { Resume } from '../models/Resume';

// =======================
//  Multer Setup for File Uploads
// =======================
const storage = multer.diskStorage({
	destination: './uploads/',
	filename: (req, file, cb) => {
		cb(null, `${Date.now()}-${file.originalname}`);
	},
});
const upload = multer({ storage }).single('file');

// =======================
// Upload and Analyze Resume (Uses Stored Procedure)
// =======================
export const uploadResume = async (req: Request, res: Response) => {
	upload(req, res, async (err) => {
		if (err) {
			console.error('Multer Error:', err);
			return res.status(500).json({ error: 'Error uploading file.' });
		}

		const { candidate_name, candidate_email, job_id }: Resume = req.body;
		const filePath = req.file?.path || '';

		if (!candidate_name || !candidate_email || !job_id) {
			return res.status(400).json({ error: 'Missing required fields.' });
		}

		try {
			let resumeText = '';

			if (filePath.endsWith('.pdf')) {
				const fileBuffer = await fs.promises.readFile(filePath);
				const dataBuffer = await pdfParse(fileBuffer);
				resumeText = dataBuffer.text;
			} else if (filePath.endsWith('.docx')) {
				const dataBuffer = await mammoth.extractRawText({ path: filePath });
				resumeText = dataBuffer.value || '';
			} else {
				return res.status(400).json({ error: 'Unsupported file format. Please upload PDF or DOCX.' });
			}

			 // Insert Resume and Retrieve Resume ID
			 const result = await pool.query('CALL InsertResumeAndReturnID($1, $2, $3, $4, $5, $6)', [
				candidate_name,
				candidate_email,
				filePath,
				resumeText.trim(),
				job_id,
				null // Placeholder for resume_id output
			]);

			const resumeID = result.rows[0]?.p_resume_id; // Retrieve the returned resume ID
			if (!resumeID) {
				return res.status(500).json({ error: 'Failed to insert resume.' });
			}

			// Fetch Job Description for AI Scoring
			const jobResult = await pool.query('SELECT description FROM job_descriptions WHERE id = $1', [job_id]);
			if (jobResult.rowCount === 0) {
				return res.status(404).json({ error: 'Job not found' });
			}

			const jobDescription = jobResult.rows[0].description;

			// Analyze Resume Using AI
			const ai_score = await analyzeResume(jobDescription, resumeText.trim());

			// Update AI Score in Database
			await pool.query('UPDATE resumes SET ai_score = $1 WHERE id = $2', [ai_score, resumeID]);
			return res.status(200).json({ message: 'Resume uploaded successfully', resume_id: resumeID, ai_score });
		} catch (error) {
			console.error('Error processing resume:', error);
			return res.status(500).json({ error: 'Error processing resume.' });
		}
	});
};

// =======================
// Get All Resumes (Joined with Job Descriptions)
// =======================
export const getResumes = async (req: Request, res: Response) => {
	try {
		const result = await pool.query(`
      SELECT r.id, c.name AS candidate_name, c.email, r.experience, r.file_url, r.ai_score,
       STRING_AGG(s.skill_name, ', ') AS candidate_skills
      FROM resumes r
      JOIN candidates c ON r.candidate_id = c.id
      LEFT JOIN resume_skills rs ON r.id = rs.resume_id
      LEFT JOIN skills s ON rs.skill_id = s.id
      GROUP BY r.id, c.name, c.email;`);
		res.json(result.rows);
	} catch (error) {
		console.error('Error fetching resumes:', error);
		res.status(500).json({ error: 'Error fetching resumes' });
	}
};
