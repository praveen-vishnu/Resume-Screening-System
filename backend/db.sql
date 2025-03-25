-- Create the database
CREATE DATABASE resume_screening_db;

-- Switch to the created database
\c resume_screening_db

-- Create job_descriptions table
CREATE TABLE job_descriptions (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    skills TEXT[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create resumes table
CREATE TABLE resumes (
  id SERIAL PRIMARY KEY,
  candidate_name VARCHAR(255) NOT NULL,
  candidate_email VARCHAR(255) NOT NULL,
  skills TEXT[],
  experience INT,
  file_url TEXT,
  resume_text TEXT,
  ai_score FLOAT,
  job_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (job_id) REFERENCES job_descriptions(id) ON DELETE CASCADE
);
