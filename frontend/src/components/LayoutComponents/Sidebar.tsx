import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar: React.FC = () => {
  return (
    <aside className="sidebar">
      <nav>
        <ul>
          <li><Link to="/">Dashboard</Link></li>
          <li><Link to="/create-job">Create Job</Link></li>
          <li><Link to="/upload-resume">Upload Resume</Link></li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
