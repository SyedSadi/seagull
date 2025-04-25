import PostList from "../components/Forum/PostList";
import { Helmet } from 'react-helmet-async';

const ForumPage = () => {
	return (
		<>
		<Helmet>
		        <title>Forum | KUETx</title>
    	</Helmet>
		
		<div className="min-h-screen bg-gray-100 py-8">
			<div className="container mx-auto px-4">
				<PostList />
			</div>
		</div>
	  </>
	);
};

export default ForumPage;
