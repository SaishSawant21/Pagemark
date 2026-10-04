import {
	BrowserRouter,
	Navigate,
	Route,
	Routes,
} from "react-router-dom";

import AppLayout from "../layout/AppLayout";
import BookDetail from "../pages/BookDetail";
import Shelf from "../pages/Shelf";
import BookForm from "../pages/BookForm";

function AppRoutes() {
	return (
		<BrowserRouter>
			<Routes>
				<Route element={<AppLayout />}>
					<Route path="/" element={<Shelf />} />
					<Route
						path="/add"
						element={<BookForm />}
					/>
					<Route
						path="/book/:id"
						element={<BookDetail />}
					/>
					<Route
						path="/edit-book/:id"
						element={<BookForm />}
					/>
				</Route>

				<Route
					path="*"
					element={<Navigate to="/" replace />}
				/>
			</Routes>
		</BrowserRouter>
	);
}
export default AppRoutes;
