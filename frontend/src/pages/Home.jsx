import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import PostFeed from "@/components/feed/PostFeed";
import UploadPanel from "@/components/feed/UploadPanel";
import { fetchPosts, likePost, commentPost, createPost } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

const Home = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useAuth();

    const loadPosts = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await fetchPosts();
            setPosts(data);
        } catch (error) {
            console.error('Error fetching posts:', error);
            setError('Failed to load posts. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadPosts();
    }, []);

    const handleLike = async (postId) => {
        try {
            await likePost(postId, user.id);
            // PostCard handles optimistic UI updates locally
        } catch (error) {
            console.error('Error liking post:', error);
        }
    };

    const handleComment = async (postId, text) => {
        try {
            await commentPost(postId, user.id, text);
            // PostCard handles optimistic UI updates locally
        } catch (error) {
            console.error('Error commenting on post:', error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-3xl mx-auto px-4">
                <UploadPanel
                    onUpload={(file) => console.log('Uploaded file:', file.name)}
                    onGeneratePost={async (generated) => {
                        try {
                            const newPostId = await createPost(user.id, user.name || 'Anonymous', generated.content.text);
                            setPosts((p) => [{ ...generated, id: newPostId }, ...p]);
                        } catch (error) {
                            console.error('Error creating post:', error);
                        }
                    }}
                />

                {loading ? (
                    <div className="flex justify-center p-8">
                        <p className="text-gray-500">Loading posts...</p>
                    </div>
                ) : error ? (
                    <div className="flex justify-center p-8 bg-red-50 rounded">
                        <div className="text-red-600">
                            <p>{error}</p>
                            <button 
                                onClick={loadPosts}
                                className="mt-2 text-blue-600 underline"
                            >
                                Try again
                            </button>
                        </div>
                    </div>
                ) : (
                    <PostFeed
                        posts={posts}
                        currentUser={user}
                        onLike={handleLike}
                        onComment={handleComment}
                        onShare={(postId) => console.log(`Shared post ${postId}`)}
                        onAddOption={(postId) => console.log(`Options clicked for post ${postId}`)}
                    />
                )}
            </div>
        </div>
    );
};

export default Home;
