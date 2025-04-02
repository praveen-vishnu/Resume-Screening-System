import React, { useState } from "react";
import { createJob } from "../../services/apiService";

const JobForm: React.FC = () => {
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [skills, setSkills] = useState<string[]>([]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		const jobData = {
			title,
			description,
			skills,
		};

		await createJob(jobData);
		alert("Job created successfully");
		setTitle("");
		setDescription("");
		setSkills([]);
	};

	return (
		<section className="job-creation">
			<h2>Create New Job Description</h2>
			<form className="job-form" onSubmit={handleSubmit}>
				<div className="form-group">
					<label htmlFor="job-title">Job Title</label>
					<input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Job Title" required />
				</div>
				<div className="form-group">
					<label htmlFor="job-description">Job Description</label>
					<textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Job Description" required />
				</div>
				<div className="form-group">
					<label htmlFor="skills">Required Skills</label>
					<div className="skills-input">
						<input type="text" value={skills.join(",")} onChange={(e) => setSkills(e.target.value.split(","))} placeholder="Skills (comma-separated)" />{" "}
					</div>
				</div>
				<button type="submit" className="create-btn">
					Create Job
				</button>
			</form>
		</section>
	);
};

export default JobForm;
