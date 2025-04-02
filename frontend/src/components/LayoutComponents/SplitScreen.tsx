import React, { ReactNode } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
interface SplitScreenProps {
	// left: ReactNode;
	// right: ReactNode;
	leftWidth?: string;
	rightWidth?: string;
	main: ReactNode;
	mainWidth?: string;
}

const SplitScreen: React.FC<SplitScreenProps> = ({
	// left,
	// right,
	leftWidth = "20%",
	rightWidth = "80%",
	main,
	mainWidth = "100%",
}) => {
	return (
		<div className="container layout-container">
			<main className="main-content">
				{/* Header */}
				<Header />

				{/* Main Content */}
				<div className="split-screen">
					{/* Sidebar (Left Section) */}
					<div className="left-pane" style={{ width: leftWidth }}>
						<Sidebar />
					</div>

					{/* Main Content (Right Section) */}
					<div className="right-pane" style={{ width: rightWidth }}>
						<div className="content-container">
							{/* {left}
						{right} */}
							{main}
						</div>
					</div>
				</div>

				{/* Footer */}
				<Footer />
			</main>
		</div>
	);
};

export default SplitScreen;
