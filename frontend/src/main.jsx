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
import QuizPage from "./pages/QuizPage.jsx";
import AddCoursesPage from "./pages/AddCoursesPage.jsx";
import ManageContentsPage from "./pages/ManageContentsPage.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import ProtectedRoute from "./components/Shared/ProtectedRoute.jsx";

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
				path: "/quiz",
				element: <QuizPage />,
				//loader: quizLoader
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
						path: "/add-courses",
						element: <AddCoursesPage />,
						// loader: productsLoader
					},
					{
						path: "/contents/manage/:courseId",
						element: <ManageContentsPage />,
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
