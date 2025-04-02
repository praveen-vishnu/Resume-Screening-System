import { Request, Response } from 'express';
import pool from '../services/dbService';
import { Job } from '../models/Job';

// Get All Jobs with Skills
export const getJobs = async (req: Request, res: Response) => {
	try {
		const result = await pool.query(`
    SELECT j.id, j.title, j.description, STRING_AGG(s.skill_name, ', ') AS skills
    FROM job_descriptions j
    LEFT JOIN job_skills js ON j.id = js.job_id
    LEFT JOIN skills s ON js.skill_id = s.id
    GROUP BY j.id
    ORDER BY j.id;`);
		res.json(result.rows);
	} catch (error) {
		console.error("Error fetching jobs:", error);
		res.status(500).json({ error: "Error fetching jobs" });
	}
};

// Create a Job with Skills (Uses Stored Procedure)
export const createJob = async (req: Request, res: Response) => {
	const { title, description, skills }: Job = req.body;
	try {
		await pool.query("CALL InsertJobWithSkills($1, $2, $3)", [title, description, skills]);
		res.status(201).json({ message: "Job created successfully" });
	} catch (error) {
		console.error("Error creating job:", error);
		res.status(500).json({ error: "Error creating job" });
	}
};
