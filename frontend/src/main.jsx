import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import Home from "./pages/Home.jsx";
import CoursePage from "./pages/CoursePage.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import CourseDetails from "./components/Courses/CourseDetails.jsx";
import ForumPage from "./pages/ForumPage.jsx";
import AboutUsPage from "./pages/AboutUsPage.jsx";
import CareerPage from "./pages/CareerPage.jsx";
import AddCoursesPage from "./pages/AddCoursesPage.jsx";
import ManageContentsPage from "./pages/ManageContentsPage.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import ProtectedRoute from "./components/Shared/ProtectedRoute.jsx";
import CourseContent from "./components/Courses/CourseContent.jsx";
import ModifyCoursePage from "./pages/ModifyCoursePage.jsx";
import Profile from "./pages/Profile.jsx";
import AdminRoute from "./components/Shared/AdminRoute.jsx";
import Dashboard from "./pages/Admin/Dashboard.jsx";

const router = createBrowserRouter([
	{
		path: "/",
		element: <App />,
		errorElement: <NotFoundPage />,
		children: [
			{
				path: "/",
				element: <Home />,
			},
			{
				path: "/login",
				element: <Login />,
			},
			{
				path: "/register",
				element: <Register />,
			},
			{
				path: "/forum",
				element: <ForumPage />,
				//loader: forumLoader
			},
			{
				path: "/aboutus",
				element: <AboutUsPage />,
				//loader: aboutUsLoader
			},
			{
				path: "/career",
				element: <CareerPage />,
				//loader: careerLoader
			},
			{
				path: "/courses",
				element: <CoursePage />,
				// loader: productsLoader
			},
			{
				path: "/courses/:id",
				element: <CourseDetails />,
				// loader: productsLoader
			},
			{	
				element: <ProtectedRoute />,
				children: [
					{
						path: "/profile",
						element: <Profile/>
					},
					{
						path: "/add-courses",
						element: <AddCoursesPage />,
						// loader: productsLoader
					},
					{
						path: "/course/modify/:courseId",
						element: <ModifyCoursePage />,
					},
					{
						path: "/contents/manage/:courseId",
						element: <ManageContentsPage />,
					},
					{
						path: "/courseContents/:id",
						element: <CourseContent/>
					},
					{
						element: <AdminRoute />,
						children: [
							{
								path: "/admin/dashboard",
								element: <Dashboard/>
							}
						]
					},
				]
			},
		],
	},
]);

createRoot(document.getElementById("root")).render(
	<StrictMode>
		<AuthProvider>
			<RouterProvider router={router} />
		</AuthProvider>
	</StrictMode>
);
