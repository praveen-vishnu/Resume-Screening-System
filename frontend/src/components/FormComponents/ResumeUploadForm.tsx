// import React, { useState } from 'react';
// import { uploadResume } from '../../services/apiService';

// const ResumeUploadForm: React.FC = () => {
//   const [file, setFile] = useState<File | null>(null);
//   const [candidateName, setCandidateName] = useState('');
//   const [candidateEmail, setCandidateEmail] = useState('');
//   const [jobId, setJobId] = useState<number>(0);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!file) {
//       alert('Please select a file');
//       return;
//     }

//     const formData = new FormData();
//     formData.append('file', file);
//     formData.append('candidate_name', candidateName);
//     formData.append('candidate_email', candidateEmail);
//     formData.append('job_id', jobId.toString());

//     await uploadResume(formData);
//     alert('Resume uploaded and analyzed successfully');
//     setFile(null);
//     setCandidateName('');
//     setCandidateEmail('');
//     setJobId(0);
//   };

//   return (
//     <form className="resume-upload-form" onSubmit={handleSubmit}>
//       <input
//         type="text"
//         value={candidateName}
//         onChange={(e) => setCandidateName(e.target.value)}
//         placeholder="Candidate Name"
//         required
//       />
//       <input
//         type="email"
//         value={candidateEmail}
//         onChange={(e) => setCandidateEmail(e.target.value)}
//         placeholder="Candidate Email"
//         required
//       />
//       <input
//         type="number"
//         value={jobId}
//         onChange={(e) => setJobId(Number(e.target.value))}
//         placeholder="Job ID"
//         required
//       />
//       <input
//         type="file"
//         onChange={(e) => setFile(e.target.files?.[0] || null)}
//         accept=".pdf"
//       />
//       <button type="submit">Upload Resume</button>
//     </form>
//   );
// };

// export default ResumeUploadForm;

import React, { useState, useEffect } from "react";
import { getJobs, uploadResume } from "../../services/apiService";

const ResumeUploadForm: React.FC = () => {
	const [jobs, setJobs] = useState<any[]>([]);
	const [selectedJobId, setSelectedJobId] = useState<string>("");
	const [resumeFile, setResumeFile] = useState<File | null>(null);
	const [candidateName, setCandidateName] = useState<string>("");
	const [candidateEmail, setCandidateEmail] = useState<string>("");
	const [scores, setScores] = useState<any[]>([]);

	// ===========================
	// Fetch Job List on Component Mount
	// ===========================
	useEffect(() => {
		const fetchJobs = async () => {
			try {
				const jobList = await getJobs();
				setJobs(jobList);
			} catch (error) {
				console.error("Error fetching jobs:", error);
			}
		};
		fetchJobs();
	}, []);

	// ===========================
	// Handle Resume File Change
	// ===========================
	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files.length > 0) {
			setResumeFile(e.target.files[0]);
		}
	};

	// ===========================
	// Handle Resume Upload
	// ===========================
	const handleUploadResume = async () => {
		if (!resumeFile || !selectedJobId || !candidateName || !candidateEmail) {
			alert("Please fill all fields and upload a resume.");
			return;
		}

		const formData = new FormData();
		formData.append("file", resumeFile);
		formData.append("candidate_name", candidateName);
		formData.append("candidate_email", candidateEmail);
		formData.append("job_id", selectedJobId);

		try {
			const response = await uploadResume(formData);
			alert("Resume uploaded successfully");
		} catch (error) {
			alert("Error uploading resume");
		}
	};

	return (
		<div className="resume-upload-form">
			{/* Select Job Dropdown */}
			<label>Select Job:</label>
			<select value={selectedJobId} onChange={(e) => setSelectedJobId(e.target.value)}>
				<option value="">Select Job</option>
				{jobs.map((job) => (
					<option key={job.id} value={job.id}>
						{job.title}
					</option>
				))}
			</select>

			{/* Input for Candidate Name */}
			<label>Candidate Name:</label>
			<input type="text" value={candidateName} onChange={(e) => setCandidateName(e.target.value)} placeholder="Enter Candidate Name" />

			{/* Input for Candidate Email */}
			<label>Candidate Email:</label>
			<input type="email" value={candidateEmail} onChange={(e) => setCandidateEmail(e.target.value)} placeholder="Enter Candidate Email" />

			{/* File Upload for Resume */}
			<label>Upload Resume:</label>
			<input type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} />

			{/* Upload and Compare Buttons */}
			<button onClick={handleUploadResume}>Upload Resume</button>

			{/* Display Resume Comparison Results */}
			{scores.length > 0 && (
				<div className="score-results">
					<h3>Comparison Results</h3>
					<ul>
						{scores.map((score, index) => (
							<li key={index}>
								Candidate: {score.candidate_name} - Score: {score.score}%
							</li>
						))}
					</ul>
				</div>
			)}
		</div>
	);
};

export default ResumeUploadForm;
