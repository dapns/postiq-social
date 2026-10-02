import React, { useState } from 'react';
import '../../styles/CommentSection.css';
import { Heart } from 'lucide-react';
import getInitials from '@/utils/getInitials';

const CommentSection = ({
  comments = [],
  onAddComment,
  onLikeComment,
  onReplyComment,
  isAuthenticated = false,
}) => {
  const [displayCount, setDisplayCount] = useState(2);
  const [likedComments, setLikedComments] = useState(
    () => new Set(comments.filter((comment) => comment.isLiked).map((comment) => comment.id))
  );
  const [commentLikes, setCommentLikes] = useState(
    () => new Map(comments.map((comment) => [comment.id, comment.likes || 0]))
  );
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [pendingCommentId, setPendingCommentId] = useState(null);
  const [actionError, setActionError] = useState('');

  const displayedComments = comments.slice(0, displayCount);
  const hasMoreComments = displayCount < comments.length;

  React.useEffect(() => {
    setLikedComments(new Set(comments.filter((comment) => comment.isLiked).map((comment) => comment.id)));
    setCommentLikes(new Map(comments.map((comment) => [comment.id, comment.likes || 0])));
  }, [comments]);

  const handleLoadMore = () => {
    setDisplayCount((prev) => prev + 5);
  };

  const handleLikeComment = async (commentId) => {
    if (!isAuthenticated || pendingCommentId !== null) return;
    const wasLiked = likedComments.has(commentId);
    const newLiked = new Set(likedComments);
    if (wasLiked) {
      newLiked.delete(commentId);
    } else {
      newLiked.add(commentId);
    }
    setLikedComments(newLiked);
    setCommentLikes((currentLikes) => {
      const nextLikes = new Map(currentLikes);
      const currentCount = nextLikes.get(commentId) || 0;
      nextLikes.set(commentId, Math.max(0, currentCount + (wasLiked ? -1 : 1)));
      return nextLikes;
    });
    setPendingCommentId(commentId);
    setActionError('');
    try {
      await onLikeComment?.(commentId);
    } catch (requestError) {
      setLikedComments((currentLikes) => {
        const nextLiked = new Set(currentLikes);
        if (wasLiked) nextLiked.add(commentId);
        else nextLiked.delete(commentId);
        return nextLiked;
      });
      setCommentLikes((currentLikes) => {
        const nextLikes = new Map(currentLikes);
        const currentCount = nextLikes.get(commentId) || 0;
        nextLikes.set(commentId, Math.max(0, currentCount + (wasLiked ? 1 : -1)));
        return nextLikes;
      });
      setActionError(requestError.message || 'Could not update the comment like.');
    } finally {
      setPendingCommentId(null);
    }
  };

  const handleReplySubmit = async (commentId) => {
    const content = replyText.trim();
    if (!isAuthenticated || !content || pendingCommentId !== null) return;

    setPendingCommentId(commentId);
    setActionError('');
    try {
      await onReplyComment?.(commentId, content);
      setReplyText('');
      setReplyingTo(null);
    } catch (requestError) {
      setActionError(requestError.message || 'Could not post your reply.');
    } finally {
      setPendingCommentId(null);
    }
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  if (!comments || comments.length === 0) {
    return null;
  }

  return (
    <div className="comment-section-wrapper">
      {actionError && <p className="comment-action-error" role="alert">{actionError}</p>}
      <div className="comments-list">
        {displayedComments.map((comment) => (
          <div key={comment.id} className="comment-item">
            {comment.author?.avatar ? (
              <img
                src={comment.author.avatar}
                alt={comment.author.name || 'Comment author'}
                className="comment-avatar"
              />
            ) : (
              <span className="comment-avatar comment-avatar--initials" aria-hidden="true">
                {getInitials(comment.author?.name)}
              </span>
            )}
            <div className="comment-content">
              <div className="comment-header">
                <span className="comment-author">{comment.author?.name}</span>
                <span className="comment-time">{formatTimestamp(comment.timestamp)}</span>
              </div>
              <p className="comment-text">{comment.text}</p>
              <div className="comment-actions">
                <button
                  className="comment-action-btn"
                  disabled={!isAuthenticated}
                  title={isAuthenticated ? 'Reply' : 'Log in to reply'}
                  onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                >
                  Reply{comment.replyCount > 0 ? ` ${comment.replyCount}` : ''}
                </button>
                <button
                  className={`comment-action-btn like-comment ${likedComments.has(comment.id) ? 'liked' : ''}`}
                  disabled={!isAuthenticated || pendingCommentId !== null}
                  title={isAuthenticated ? 'Like comment' : 'Log in to like'}
                  onClick={() => handleLikeComment(comment.id)}
                >
                  {likedComments.has(comment.id) ? (
                    <Heart className="comment-heart-icon" size={14} fill="currentColor" />
                  ) : (
                    <Heart className="comment-heart-icon" size={14} />
                  )}
                  {commentLikes.get(comment.id) || 0}
                </button>
              </div>

              {/* Reply Box */}
              {isAuthenticated && replyingTo === comment.id && (
                <div className="reply-box">
                  <input
                    type="text"
                    className="reply-input"
                    placeholder="Write a reply..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleReplySubmit(comment.id);
                      }
                    }}
                  />
                  <div className="reply-actions">
                    <button
                      className="reply-submit"
                      onClick={() => handleReplySubmit(comment.id)}
                      disabled={!replyText.trim() || pendingCommentId !== null}
                    >
                      Reply
                    </button>
                    <button
                      className="reply-cancel"
                      onClick={() => {
                        setReplyingTo(null);
                        setReplyText('');
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Load More Button */}
      {hasMoreComments && (
        <button className="load-more-comments" onClick={handleLoadMore}>
          Load {Math.min(5, comments.length - displayCount)} more comments
        </button>
      )}
    </div>
  );
};

export default CommentSection;
