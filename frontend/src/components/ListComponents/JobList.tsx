import React from 'react';
import withDataFetching from '../../HOCs/withDataFetching';
import { getJobs } from '../../services/apiService';

interface Job {
  id: number;
  title: string;
  description: string;
  skills: string[];
}

interface JobListProps {
  data: Job[];
}

const JobList: React.FC<JobListProps> = ({ data: jobs }) => {
  return (
    <div className="job-list">
      <h2>Available Job Descriptions</h2>
      <ul>
        {jobs.map((job) => (
          <li key={job.id}>
            <h3>{job.title}</h3>
            <p>{job.description}</p>
            <p>
              <strong>Skills:</strong> {job.skills ? job.skills : 'N/A'}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default withDataFetching(JobList, getJobs);