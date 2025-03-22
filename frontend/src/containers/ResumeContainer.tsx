import React from "react";
import useResumes from "../hooks/useResumes";
import ResumeList from "../components/ListComponents/ResumeList";
import ResumeUploadForm from "../components/FormComponents/ResumeUploadForm";

const ResumeContainer: React.FC = () => {
	const resumes = useResumes();

	return (
		<div className="">
			<h1>Resume Screening System</h1>
			<div className="resume-container">
				<h2>Upload Resume for Analysis</h2>
				<ResumeUploadForm />
			</div>
			<h1>Uploaded Resumes</h1>
			<ResumeList resumes={resumes} />
		</div>
	);
};

export default ResumeContainer;
