import { Link } from "react-router-dom";
import { Helmet } from 'react-helmet-async';


function NotFoundPage() {
	return (
		<>
		<Helmet>
            <title>Page Not Found</title>
        </Helmet>
		
		<div className="flex items-center justify-center min-h-screen bg-white px-4">
			<div className="text-center max-w-md">
				<h1 className="text-7xl font-bold text-blue-700">404</h1>
				<h2 className="mt-4 text-2xl font-semibold text-gray-800">Page Not Found</h2>
				<p className="mt-2 text-gray-600">
					Oops! The page you are looking for doesn’t exist or has been moved.
				</p>
				<Link
					to="/"
					className="inline-block mt-6 px-6 py-3 bg-blue-700 text-white font-medium rounded-xl hover:bg-blue-800 transition duration-200"
				>
					Go back to Home
				</Link>
			</div>
		</div>
		</>
	);
}

export default NotFoundPage;
