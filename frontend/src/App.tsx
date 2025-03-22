import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import CreateJob from "./pages/CreateJob";
import UploadResume from "./pages/UploadResume";
import DashboardPage from "./pages/Dashboard";
import SplitScreen from "./components/LayoutComponents/SplitScreen";

const App: React.FC = () => {
	return (
		<>
			<Router>
				<SplitScreen
					main={
						<Routes>
							<Route path="/" element={<DashboardPage />} />
							<Route path="/create-job" element={<CreateJob />} />
							<Route path="/upload-resume" element={<UploadResume />} />
						</Routes>
					}
					leftWidth="25%"
					rightWidth="75%"
				/>
			</Router>
		</>
	);
};

export default App;
