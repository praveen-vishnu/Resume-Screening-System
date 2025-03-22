import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import path from 'path';
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';
import pool from '../services/dbService';
import fs from 'fs';
import { analyzeResume } from '../services/aiService';
import { Resume } from '../models/Resume';



// =======================
//  Multer Setup for Uploads
// =======================
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage }).single('file');

// =======================
// Upload and Analyze Resume (With PDF/DOCX Parsing)
// =======================
export const uploadResume = async (req: Request, res: Response) => {
  upload(req, res, async (err) => {
    if (err) {
      console.error('Multer Error:', err);
      return res.status(500).json({ error: 'Error uploading file.' });
    }

    // =======================
    // Debug FormData and File
    // =======================
    console.log('Request Body:', req.body);
    console.log('Uploaded File:', req.file);

    const { candidate_name, candidate_email, job_id }: Resume = req.body;
    const filePath = req.file?.path || '';

    // =======================
    // Validate Required Fields
    // =======================
    if (!candidate_name || !candidate_email || !job_id) {
      return res.status(400).json({ error: 'Missing required fields.' });
    }

    try {
      let resumeText = '';

      // =======================
      // Parse PDF or DOCX File
      // =======================
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

      const jobResult = await pool.query('SELECT description FROM job_descriptions WHERE id = $1', [job_id]);
      if (jobResult.rowCount === 0) {
        return res.status(404).json({ error: 'Job not found' });
      }

      const jobDescription = jobResult.rows[0].description;


      // =======================
      // Analyze Resume using AI
      // =======================
      const ai_score = await analyzeResume(jobDescription, resumeText.trim());

      // =======================
      // Insert Resume Data into DB
      // =======================
      const result = await pool.query(
        'INSERT INTO resumes (candidate_name, candidate_email, file_url, ai_score, job_id, resume_text) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [candidate_name, candidate_email, filePath, ai_score, job_id, resumeText.trim()]
      );

      res.json({
        message: 'Resume uploaded and analyzed successfully.',
        resume: result.rows[0],
      });
    } catch (error) {
      console.error('Error processing resume:', error);
      return res.status(500).json({ error: 'Error processing resume.' });
    }
  });
};


// =======================
// Get All Resumes
// =======================
export const getResumes = async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM resumes');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching resumes' });
  }
};
