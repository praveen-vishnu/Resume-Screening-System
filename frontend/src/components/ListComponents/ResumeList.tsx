import React from 'react';

interface Resume {
  id: number;
  candidate_name: string;
  candidate_email: string;
  ai_score: number;
}

interface ResumeListProps {
  resumes: Resume[];
}

const ResumeList: React.FC<ResumeListProps> = ({ resumes }) => {
  return (
    <div className="resume-list">
      <h2>Analyzed Resumes</h2>
      <ul>
        {resumes.map((resume) => (
          <li key={resume.id}>
            <h3>{resume.candidate_name}</h3>
            <p>Email: {resume.candidate_email}</p>
            <p>AI Score: <strong>{resume.ai_score}</strong></p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ResumeList;
