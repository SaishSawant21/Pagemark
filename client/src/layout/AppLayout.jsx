import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";

import AppHeader from "./AppHeader";
import AppFooter from "./AppFooter";
import PageMarkAI from "../components/ai/PagemarkAI";

const AppLayout = () => {
	const [aiBook, setAiBook] = useState(null);
	const [isAIRequested, setIsAIRequested] = useState(false);
	const location = useLocation();
	const isBookDetailsPage = location.pathname.startsWith("/book/");

	const handleAskAI = (book) => {
		setAiBook(book);
		setIsAIRequested(true);
	};

	const handleCloseAI = () => {
		setIsAIRequested(false);
		setAiBook(null);
	};

	return (
		<div className="flex min-h-screen flex-col bg-slate-50">
			<AppHeader />

			<main className="flex-1">
				<Outlet context={{ handleAskAI }} />
			</main>

			<PageMarkAI
				book={aiBook}
				open={isAIRequested}
				onClose={handleCloseAI}
				showLauncher={!isBookDetailsPage}
			/>

			<AppFooter />
		</div>
	);
}

export default AppLayout;