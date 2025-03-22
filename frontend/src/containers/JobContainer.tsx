import React from "react";
import useJobs from "../hooks/useJobs";
import JobList from "../components/ListComponents/JobList";
import JobForm from "../components/FormComponents/JobForm";

const JobContainer: React.FC = () => {
	const jobs = useJobs();

	return (
		<div className="job-container">
			<div className="create-job">
				<h2>Create New Job Description</h2>
				<JobForm />
			</div>

			<h1>Job Listings</h1>
			<JobList jobs={jobs} />
		</div>
	);
};

export default JobContainer;
