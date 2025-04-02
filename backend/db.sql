-- Create the database
CREATE DATABASE resume_screening_db;

-- Switch to the created database
\c resume_screening_db

-- Jobs table
CREATE TABLE job_descriptions (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Candidates table
CREATE TABLE candidates (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL
);

-- Skills table (stores unique skills)
CREATE TABLE skills (
    id SERIAL PRIMARY KEY,
    skill_name VARCHAR(255) UNIQUE NOT NULL
);

-- Job-Skills mapping (Many-to-Many)
CREATE TABLE job_skills (
    job_id INT REFERENCES job_descriptions(id) ON DELETE CASCADE,
    skill_id INT REFERENCES skills(id) ON DELETE CASCADE,
    PRIMARY KEY (job_id, skill_id)
);

-- Resume table (links to candidates & job descriptions)
CREATE TABLE resumes (
    id SERIAL PRIMARY KEY,
    candidate_id INT REFERENCES candidates(id) ON DELETE CASCADE,
    experience INT,
    file_url TEXT,
    resume_text TEXT,
    ai_score FLOAT DEFAULT 0,
    job_id INT REFERENCES job_descriptions(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Resume-Skills mapping (Many-to-Many)
CREATE TABLE resume_skills (
    resume_id INT REFERENCES resumes(id) ON DELETE CASCADE,
    skill_id INT REFERENCES skills(id) ON DELETE CASCADE,
    PRIMARY KEY (resume_id, skill_id)
);

-- Stored Procedure: AI Resume Matching Score Calculation
CREATE OR REPLACE PROCEDURE CalculateResumeScore(jobId INT)
LANGUAGE plpgsql AS $$
DECLARE
    total_required_skills INT;
BEGIN
    -- Get the total number of required skills for the given job
    SELECT COUNT(*) INTO total_required_skills
    FROM job_skills
    WHERE job_id = jobId;

    -- Update AI score for all resumes linked to this job
    UPDATE resumes r
    SET ai_score = COALESCE(
        CASE
            WHEN total_required_skills = 0 THEN 0
            ELSE ROUND(
                (SELECT COUNT(*) * 100.0 / total_required_skills
                 FROM resume_skills rs
                 JOIN job_skills js ON rs.skill_id = js.skill_id
                 WHERE rs.resume_id = r.id AND js.job_id = jobId),
                2
            )
        END, 0  -- Ensures AI score is never NULL
    )
    WHERE job_id = jobId;
END;
$$;

-- Stored Procedure: Insert Resume
CREATE OR REPLACE PROCEDURE InsertResumeAndReturnID(
    p_candidate_name VARCHAR(255),
    p_candidate_email VARCHAR(255),
    p_file_url TEXT,
    p_resume_text TEXT,
    p_job_id INT,
    OUT p_resume_id INT  -- Output parameter to return the inserted resume ID
)
LANGUAGE plpgsql AS $$
DECLARE
    v_candidate_id INT;
BEGIN
    -- Check if candidate exists, otherwise insert
    SELECT id INTO v_candidate_id FROM candidates WHERE email = p_candidate_email;
    IF v_candidate_id IS NULL THEN
        INSERT INTO candidates (name, email) VALUES (p_candidate_name, p_candidate_email)
        RETURNING id INTO v_candidate_id;
    END IF;

    -- Insert resume and return the resume ID
    INSERT INTO resumes (candidate_id, file_url, resume_text, job_id)
    VALUES (v_candidate_id, p_file_url, p_resume_text, p_job_id)
    RETURNING id INTO p_resume_id;
END;
$$;

-- Stored Procedure: Insert Job and Associate Skills
-- This procedure inserts a new job description and associates it with the provided skills.
CREATE OR REPLACE PROCEDURE InsertJobWithSkills(
    p_title VARCHAR(255),
    p_description TEXT,
    p_skills TEXT[]
)
LANGUAGE plpgsql AS $$
DECLARE
    v_job_id INT;
    v_skill_id INT;
BEGIN
    -- Insert job description and get the job ID
    INSERT INTO job_descriptions (title, description)
    VALUES (p_title, p_description)
    RETURNING id INTO v_job_id;

    -- Insert skills if they don't exist and associate them with the job
    FOR i IN 1 .. array_length(p_skills, 1) LOOP
        -- First, try to fetch the skill ID
        SELECT id INTO v_skill_id FROM skills WHERE skill_name = p_skills[i];

        -- If the skill doesn't exist, insert it and get the new ID
        IF v_skill_id IS NULL THEN
            INSERT INTO skills (skill_name) VALUES (p_skills[i])
            RETURNING id INTO v_skill_id;
        END IF;

        -- Now insert the job-skill mapping with a valid skill_id
        INSERT INTO job_skills (job_id, skill_id)
        VALUES (v_job_id, v_skill_id);
    END LOOP;
END;
$$;

