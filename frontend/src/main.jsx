// React and Router
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
	createBrowserRouter,
	RouterProvider,
	useRouteError,
} from "react-router-dom";

// Context
import { AuthProvider } from "./context/AuthContext.jsx";

// Pages
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import App from "./App.jsx";
import CoursePage from "./pages/CoursePage.jsx";
import ForumPage from "./pages/ForumPage.jsx";
import AboutUsPage from "./pages/AboutUsPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import Register from "./pages/Register.jsx";
import QuizHome from "./pages/QuizHome.jsx";
import Dashboard from "./pages/Admin/Dashboard.jsx";
import Profile from "./pages/Profile.jsx";
import AddContentPage from "./pages/Admin/AddContentPage.jsx";
import ModifyCoursePage from "./pages/Admin/ModifyCoursePage.jsx";
import AddCoursesPage from "./pages/Admin/AddCoursesPage.jsx";
import AddQuizPage from "./pages/Admin/AddQuizPage.jsx";
import ManageContentsPage from "./pages/Admin/ManageContentsPage.jsx";
import ManageQuiz from "./pages/Admin/ManageQuiz.jsx";
import UpdateQuizPage from "./pages/Admin/UpdateQuizPage.jsx";
import UpdateQuestionsPage from "./pages/Admin/UpdateQuestionsPage.jsx";

// Components
import ProtectedRoute from "./components/Shared/ProtectedRoute.jsx";
import CourseDetails from "./components/Courses/CourseDetails.jsx";
import CourseContent from "./components/Courses/CourseContent.jsx";
import AdminRoute from "./components/Shared/AdminRoute.jsx";
import Result from "./components/Quiz/Result.jsx";
import Quizzes from "./components/Quiz/Quizzes.jsx";

// Styles
import { ToastContainer } from "react-toastify";
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
				path: "/quiz",
				element: <QuizHome />,
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
				element: <ProtectedRoute />,
				children: [
					{
						path: "/profile",
						element: <Profile />,
					},
					{
						path: "/courses/:id",
						element: <CourseDetails />,
					},
					{
						path: "/CourseContents/:id",
						element: <CourseContent />,
					},
					{
						element: <AdminRoute />,
						children: [
							{
								path: "/admin/dashboard",
								element: <Dashboard />,
							},
							{
								path: "/add-courses",
								element: <AddCoursesPage />,
							},
							{
								path: "/manage-courses",
								element: <ModifyCoursePage />,
							},
							{
								path: "/manage-contents",
								element: <ManageContentsPage />,
							},
							{
								path: "/add-contents",
								element: <AddContentPage />,
							},
							{
								path: "/add-quiz",
								element: <AddQuizPage />,
							},
							{
								path: "/manage-quiz",
								element: <ManageQuiz />,
							},
							{
								path: "/update-quiz/:categoryId",
								element: <UpdateQuizPage />,
							},
							{
								path: "/update-questions/:categoryId",
								element: <UpdateQuestionsPage />,
							},
						],
					},
				],
			},
		],
	},
]);

createRoot(document.getElementById("root")).render(
	<StrictMode>
		<AuthProvider>
			<RouterProvider router={router} />
			<ToastContainer
				position="top-right"
				autoClose={2000}
				hideProgressBar={false}
				newestOnTop
				closeOnClick
				pauseOnHover
				draggable
			/>
		</AuthProvider>
	</StrictMode>
);

// ErrorBoundary Component
export default function ErrorBoundary() {
	const error = useRouteError();
	return (
		<div className="flex flex-col items-center justify-center min-h-screen">
			<h1 className="text-2xl font-bold text-red-600">Oops!</h1>
			<p className="text-gray-600">{error.message}</p>
		</div>
	);
}
