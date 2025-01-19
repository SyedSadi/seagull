import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Home from './pages/Home.jsx';
import CoursePage from './pages/CoursePage.jsx';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import CourseDetails from './components/Courses/CourseDetails.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    // errorElement: <NotFoundPage />,
    children: [
      {
        path: '/',
        element: <Home />
      },
      {
        path: '/courses',
        element: <CoursePage />,
        // loader: productsLoader
      },
      {
        path: '/courses/:id',
        element: <CourseDetails />,
        // loader: productsLoader
      },
    ]
  }
]);


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
