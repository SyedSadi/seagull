import React, { useEffect, useState } from 'react';
import Post from './Post';
import API from '../../services/api';

const PostList = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await API.get('/forum/posts/');
        setPosts(response.data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };
    fetchPosts();
  }, []);

  const handleVote = async (postId, value) => {
    try {
      await API.post(`/forum/posts/vote/`, { post: postId, value });
      setPosts(prevPosts =>
        prevPosts.map(post =>
          post.id === postId ? { ...post, total_votes: post.total_votes + value } : post
        )
      );
    } catch (error) {
      console.error('Error voting:', error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      {posts.map(post => (
        <Post key={post.id} post={post} onVote={handleVote} />
      ))}
    </div>
  );
};

export default PostList;
