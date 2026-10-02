import React from 'react';
import PostCard from './PostCard';
import '../../styles/PostFeed.css';
import { API_CONFIG } from '@/config/apiConfig';
import httpClient from '@/lib/httpClient';

const PostFeed = ({
  posts = [],
  pages,
  onPageElement,
  onLike,
  onComment,
  onShare,
  onAddOption,
  onDelete,
  onLikeComment,
  onReplyComment,
  openPostsInNewTab = false,
  emptyMessage = 'No posts yet. Start following people to see their posts!',
  currentUser, // { name, avatar } - the current user for comment box
}) => {
  const pageGroups = Array.isArray(pages) ? pages : [{ page: 1, posts }];
  const hasPosts = pageGroups.some((group) => group.posts?.length > 0);

  const renderPost = (post, index) => (
    <PostCard
      key={post.id || index}
      postId={post.id}
      author={post.author}
      timestamp={post.timestamp}
      content={post.content}
      likes={post.likes}
      comments={post.comments}
      shares={post.shares}
      commentsList={post.commentsList}
      initiallyLiked={post.isLiked}
      onLike={() => onLike
        ? onLike(post.id || index)
        : httpClient.request(`${API_CONFIG.ENDPOINTS.HOME}/${post.id}/like`, {
          method: 'POST',
          body: JSON.stringify({ postId: post.id }),
        })}
      onComment={(text) => onComment
        ? onComment(post.id || index, text)
        : httpClient.request(`${API_CONFIG.ENDPOINTS.HOME}/${post.id}/comment`, {
          method: 'POST',
          body: JSON.stringify({ postId: post.id, content: text }),
        })}
      onShare={() => onShare && onShare(post.id || index)}
      onAddOption={() => onAddOption && onAddOption(post.id || index)}
      onDelete={() => onDelete && onDelete(post.id || index)}
      onLikeComment={(commentId) => onLikeComment
        ? onLikeComment(commentId)
        : httpClient.request(`${API_CONFIG.ENDPOINTS.HOME}/comment/${commentId}/like`, {
          method: 'POST',
          body: JSON.stringify({ commentId }),
        })}
      onReplyComment={(commentId, text) => onReplyComment
        ? onReplyComment(post.id || index, commentId, text)
        : httpClient.request(`${API_CONFIG.ENDPOINTS.HOME}/${post.id}/comment/${commentId}/reply`, {
          method: 'POST',
          body: JSON.stringify({ postId: post.id, parentCommentId: commentId, content: text }),
        })}
      openPostInNewTab={openPostsInNewTab}
      currentUser={currentUser}
    />
  );

  return (
    <div className={`post-feed${Array.isArray(pages) ? ' post-feed--paged' : ''}`}>
      {hasPosts ? (
        pageGroups.map((group) => (
          <section
            key={group.page}
            className="post-feed-page"
            ref={(element) => onPageElement?.(group.page, element)}
          >
            {group.posts.map(renderPost)}
          </section>
        ))
      ) : (
        <div className="no-posts">
          <p>{emptyMessage}</p>
        </div>
      )}
    </div>
  );
};

export default PostFeed;
