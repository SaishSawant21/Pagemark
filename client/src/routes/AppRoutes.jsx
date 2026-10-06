import { lazy, Suspense } from "react";
import {
    BrowserRouter,
    Navigate,
    Route,
    Routes,
} from "react-router-dom";
import { Flex, Spin } from "antd";

import AppLayout from "../layout/AppLayout";

const Shelf = lazy(() => import("../pages/Shelf"));
const BookDetail = lazy(() => import("../pages/BookDetail"));
const BookForm = lazy(() => import("../pages/BookForm"));

function LoadingFallback() {
    return (
        <Flex
            align="center"
            justify="center"
            style={{ minHeight: "50vh" }}
        >
            <Spin size="large" />
        </Flex>
    );
}

function AppRoutes() {
    return (
        <BrowserRouter>
            <Suspense fallback={<LoadingFallback />}>
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
            </Suspense>
        </BrowserRouter>
    );
}
export default AppRoutes;
