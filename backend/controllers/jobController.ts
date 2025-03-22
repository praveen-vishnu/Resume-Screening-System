import { Request, Response } from 'express';
import pool from '../services/dbService';
import { Job } from '../models/Job';

// Get all jobs
export const getJobs = async (req: Request, res: Response) => {
  const result = await pool.query('SELECT * FROM job_descriptions');
  res.json(result.rows);
};

// Create a new job
export const createJob = async (req: Request, res: Response) => {
  const { title, description, skills }: Job = req.body;
  const result = await pool.query(
    'INSERT INTO job_descriptions (title, description, skills) VALUES ($1, $2, $3) RETURNING *',
    [title, description, skills]
  );
  res.json(result.rows[0]);
};
