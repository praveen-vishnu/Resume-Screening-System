import React, { useState } from "react";

interface Resume {
  id: number;
  candidate_name: string;
  email: string;
  ai_score: number;
}

interface ResumeListProps {
  resumes: Resume[];
}

const ResumeList: React.FC<ResumeListProps> = ({ resumes }) => {
  const [sortOption, setSortOption] = useState<string>("highest");
  const [filterQuery, setFilterQuery] = useState<string>("");

  // Sorting logic
  const sortedResumes = [...resumes].sort((a, b) => {
    if (sortOption === "highest") {
      return b.ai_score - a.ai_score; // Sort by highest AI score
    } else {
      return a.ai_score - b.ai_score; // Sort by lowest AI score
    }
  });

  // Filtering logic
  const filteredResumes = sortedResumes.filter(
    (resume) =>
      resume.candidate_name.toLowerCase().includes(filterQuery.toLowerCase()) ||
      resume.email.toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (

        <section className="job-listings">
          <div className="filters">
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="highest">Sort by: Highest Score</option>
              <option value="lowest">Sort by: Lowest Score</option>
            </select>
            <input
              type="text"
              placeholder="Filter by name or email..."
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
            />
          </div>
          <div className="job-cards">
            {filteredResumes.length > 0 ? (
              filteredResumes.map((resume) => (
                <div key={resume.id} className="job-card">
                  <h3>{resume.candidate_name}</h3>
                  <p className="description-preview">
                    <strong>Email:</strong> {resume.email}
                  </p>
                  <p>
                    <strong>AI Score:</strong>{" "}
                    <span
                      className={
                        resume.ai_score >= 60 ? "score-high" : "score-low"
                      }
                    >
                      {resume.ai_score}
                    </span>
                  </p>
                </div>
              ))
            ) : (
              <p>No resumes found.</p>
            )}
          </div>
        </section>
  );
};

export default ResumeList;