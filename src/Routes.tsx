import React, { useEffect } from "react";
import {
    Outlet,
    Link,
    createBrowserRouter,
    RouterProvider,
    useNavigation,
} from "react-router-dom";

import HomePage from "./pages/Home";
import ContentManagementPage from "./pages/ContentManagement";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        children: [
            {
                index: true,
                element: <HomePage />,
            },
            {
                path: "content-management",
                element: <ContentManagementPage />,
            },
            {
                path: "*",
                element: <NoMatch />,
            },
        ],
    },
]);

function Layout() {
    let navigation = useNavigation();

    return (
        <div>
            <div style={{ position: "fixed", top: 0, right: 0 }}>
                {navigation.state !== "idle" && <p>Navigation in progress...</p>}
            </div>

            <Outlet />
        </div>
    );
}

function NoMatch() {
    return (
        <div>
            <h2>Nothing to see here!</h2>
            <p>
                <Link to="/">                                  Go to the home page                                  </Link>
            </p>
        </div>
    );
}
