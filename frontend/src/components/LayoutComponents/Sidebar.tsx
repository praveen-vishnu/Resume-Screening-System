import React from "react";
import { Link } from "react-router-dom";

const Sidebar: React.FC = () => {
	return (
		<aside className="sidebar">
			<nav className="nav">
				<ul>
					<li className="nav-item active">
						<Link to="/">
							<span className="icon">🏠</span>
							<span>Dashboard</span>
						</Link>
					</li>
					<li className="nav-item">
						<Link to="/create-job">
							<span className="icon">📝</span>
							<span>Create Job</span>
						</Link>
					</li>
					<li className="nav-item">
						<Link to="/upload-resume">
							<span className="icon">📤</span>
							<span>Upload Resume</span>
						</Link>
					</li>
				</ul>
			</nav>
		</aside>
	);
};

export default Sidebar;
