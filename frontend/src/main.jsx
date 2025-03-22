// React and Router
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Context
import { AuthProvider } from "./context/AuthContext.jsx";

// Pages
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import App from "./App.jsx";
import CoursePage from "./pages/CoursePage.jsx";
import ForumPage from "./pages/ForumPage.jsx";
import AboutUsPage from "./pages/AboutUsPage.jsx";
import CareerPage from "./pages/CareerPage.jsx";
import AddCoursesPage from "./pages/AddCoursesPage.jsx";
import ManageContentsPage from "./pages/ManageContentsPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import Register from "./pages/Register.jsx";
import QuizHome from "./pages/QuizHome.jsx";
import Dashboard from "./pages/Admin/Dashboard.jsx";
import ModifyCoursePage from "./pages/ModifyCoursePage.jsx";
import Profile from "./pages/Profile.jsx";

// Components
import ProtectedRoute from "./components/Shared/ProtectedRoute.jsx";
import CourseDetails from "./components/Courses/CourseDetails.jsx";
import CourseContent from "./components/Courses/CourseContent.jsx";
import AdminRoute from "./components/Shared/AdminRoute.jsx";
import Result from "./components/Quiz/Result.jsx";
import Quizzes from "./components/Quiz/Quizzes.jsx";

// Styles
import "./index.css";

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
			},
			{
				path: "/aboutus",
				element: <AboutUsPage />,
			},
			{
				path: "/career",
				element: <CareerPage />,
			},
			{
				path: "/quiz",
				element: <QuizHome/>
			},
			{
				path: "/quiz/:categoryId",
				element: <Quizzes />,
			},
			{
				path: "/result",
				element: <Result />,
			},
			{
				path: "/courses",
				element: <CoursePage />,
			},
			{
				path: "/courses/:id",
				element: <CourseDetails />,
			},
			{	
				element: <ProtectedRoute />,
				children: [
					{
						path: "/profile",
						element: <Profile/>
					},
					{
						path: "/course/modify/:courseId",
						element: <ModifyCoursePage />,
						path: "/add-courses",
						element: <AddCoursesPage />,
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
							},
							{
								path: "/add-courses",
								element: <AddCoursesPage />,
							},
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

// ErrorBoundary Component
import { useRouteError } from 'react-router-dom';

export default function ErrorBoundary() {
  const error = useRouteError();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold text-red-600">Oops!</h1>
      <p className="text-gray-600">{error.message}</p>
    </div>
  );
}
