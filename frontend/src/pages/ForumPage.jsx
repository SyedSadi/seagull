import React from "react";
import PostList from  '../components/Forum/PostList'
const ForumPage = () => {
	return (
		<div className="min-h-screen bg-gray-100 py-8">
		<div className="container mx-auto px-4">
		  <h1 className="text-3xl font-bold text-center mb-8">Forum</h1>
		  <PostList />
		</div>
	  </div>
	);
};

export default ForumPage;
