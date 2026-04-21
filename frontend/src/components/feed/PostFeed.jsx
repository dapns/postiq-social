import React from 'react';
import PostCard from './PostCard';
import '../../styles/PostFeed.css';

const PostFeed = ({
  posts = [],
  onLike,
  onComment,
  onShare,
  onAddOption,
  onDelete,
  currentUser, // { name, avatar } - the current user for comment box
}) => {
  return (
    <div className="post-feed">
      {posts && posts.length > 0 ? (
        posts.map((post, index) => (
          <PostCard
            key={post.id || index}
            author={post.author}
            timestamp={post.timestamp}
            content={post.content}
            likes={post.likes}
            comments={post.comments}
            shares={post.shares}
            commentsList={post.commentsList || []}
            onLike={() => onLike && onLike(post.id || index)}
            onComment={(text) => onComment && onComment(post.id || index, text)}
            onShare={() => onShare && onShare(post.id || index)}
            onAddOption={() => onAddOption && onAddOption(post.id || index)}
            onDelete={() => onDelete && onDelete(post.id || index)}
            onLikeComment={(commentId) => console.log(`Liked comment ${commentId}`)}
            onReplyComment={(commentId, text) => console.log(`Replied to comment ${commentId}:`, text)}
            currentUser={currentUser}
          />
        ))
      ) : (
        <div className="no-posts">
          <p>No posts yet. Start following people to see their posts!</p>
        </div>
      )}
    </div>
  );
};

export default PostFeed;
