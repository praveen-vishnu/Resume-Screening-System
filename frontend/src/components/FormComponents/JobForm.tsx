import React, { useState } from 'react';
import { createJob } from '../../services/apiService';

const JobForm: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [skills, setSkills] = useState<string[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const jobData = {
      title,
      description,
      skills,
    };

    await createJob(jobData);
    alert('Job created successfully');
    setTitle('');
    setDescription('');
    setSkills([]);
  };

  return (
    <form className="job-form" onSubmit={handleSubmit}>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Job Title"
        required
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Job Description"
        required
      />
      <input
        type="text"
        value={skills.join(',')}
        onChange={(e) => setSkills(e.target.value.split(','))}
        placeholder="Skills (comma-separated)"
      />
      <button type="submit">Create Job</button>
    </form>
  );
};

export default JobForm;
