import React from 'react';

interface Job {
  id: number;
  title: string;
  description: string;
  skills: string[];
}

interface JobListProps {
  jobs: Job[];
}

const JobList: React.FC<JobListProps> = ({ jobs }) => {
  return (
    <div className="job-list">
      <h2>Available Job Descriptions</h2>
      <ul>
        {jobs.map((job) => (
          <li key={job.id}>
            <h3>{job.title}</h3>
            <p>{job.description}</p>
            <p><strong>Skills:</strong> {job.skills.join(', ')}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default JobList;
