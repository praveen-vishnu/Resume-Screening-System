import React from "react";
import withDataFetching from "../../HOCs/withDataFetching";
import { getJobs } from "../../services/apiService";

interface Job {
  id: number;
  title: string;
  description: string;
  skills: string | string[] | undefined; // Allow skills to be a string, array, or undefined
}

interface JobListProps {
  data: Job[];
}

const JobList: React.FC<JobListProps> = ({ data: jobs }) => {
  const normalizeSkills = (skills: string | string[] | undefined): string[] => {
    if (!skills) return []; // Handle undefined or null
    if (Array.isArray(skills)) return skills; // Already an array
    return skills.split(',').map((skill) => skill.trim()); // Convert string to array
  };

  return (
    <section className="job-listings">
      <div className="job-cards">
        {jobs.length > 0 ? (
          jobs.map((job) => (
            <div key={job.id} className="job-card">
              <h3>{job.title}</h3>
              <p className="description-preview">
                {job.description.length > 100
                  ? `${job.description.substring(0, 100)}...`
                  : job.description}
              </p>
              <div className="skills-tags">
                <strong>Skills: </strong>
                {normalizeSkills(job.skills).length > 0 ? (
                  normalizeSkills(job.skills).map((skill, index) => (
                    <span key={index} className="skill-tag">
                      {skill}
                    </span>
                  ))
                ) : (
                  <span>N/A</span>
                )}
              </div>
            </div>
          ))
        ) : (
          <p>No jobs found.</p>
        )}
      </div>
    </section>
  );
};

export default withDataFetching(JobList, getJobs);