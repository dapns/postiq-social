import React, { useState, useCallback } from 'react';
import '../../styles/CommentSection.css';
import { Heart, MessageCircle, Loader } from 'lucide-react';
import { likeComment, replyToComment } from '../../lib/api';

const MIN_COMMENT_LENGTH = 1;
const MAX_COMMENT_LENGTH = 500;
const COMMENTS_PER_PAGE = 3;

const CommentSection = ({
  comments = [],
  postId,
  currentUserId,
  onAddComment,
  onLikeComment,
  onReplyComment,
}) => {
  const [displayCount, setDisplayCount] = useState(COMMENTS_PER_PAGE);
  const [likedComments, setLikedComments] = useState(new Set());
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [loadingComments, setLoadingComments] = useState(new Set());
  const [errors, setErrors] = useState({});
  const [likeCounts, setLikeCounts] = useState({});
  const [localReplies, setLocalReplies] = useState({});

  const displayedComments = comments.slice(0, displayCount);
  const hasMoreComments = displayCount < comments.length;

  const handleLoadMore = () => {
    setDisplayCount((prev) => prev + COMMENTS_PER_PAGE);
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

  const getCommentLikeCount = (comment) => {
    if (likeCounts[comment.id] !== undefined) {
      return likeCounts[comment.id];
    }
    return comment.likes || 0;
  };

  const handleLikeComment = useCallback(async (commentId, currentLikes) => {
    const isCurrentlyLiked = likedComments.has(commentId);

    // Optimistic update for both liked state and count
    const newLiked = new Set(likedComments);
    if (isCurrentlyLiked) {
      newLiked.delete(commentId);
    } else {
      newLiked.add(commentId);
    }
    setLikedComments(newLiked);

    const newCount = isCurrentlyLiked
      ? Math.max(0, currentLikes - 1)
      : currentLikes + 1;
    setLikeCounts(prev => ({ ...prev, [commentId]: newCount }));

    setLoadingComments(prev => new Set([...prev, commentId]));
    setErrors(prev => ({ ...prev, [commentId]: null }));

    try {
      await likeComment(commentId, currentUserId);

      if (onLikeComment) {
        onLikeComment(commentId);
      }
    } catch (error) {
      console.error('Error liking comment:', error);
      setErrors(prev => ({
        ...prev,
        [commentId]: 'Failed to like comment'
      }));
      // Revert optimistic update on error
      setLikedComments(likedComments);
      setLikeCounts(prev => ({ ...prev, [commentId]: currentLikes }));
    } finally {
      setLoadingComments(prev => {
        const updated = new Set(prev);
        updated.delete(commentId);
        return updated;
      });
    }
  }, [likedComments, currentUserId, onLikeComment]);

  const validateReplyText = (text) => {
    if (text.trim().length < MIN_COMMENT_LENGTH) {
      return 'Reply cannot be empty';
    }
    if (text.length > MAX_COMMENT_LENGTH) {
      return `Reply cannot exceed ${MAX_COMMENT_LENGTH} characters`;
    }
    return null;
  };

  const handleReplySubmit = useCallback(async (commentId) => {
    const validation = validateReplyText(replyText);
    if (validation) {
      setErrors(prev => ({ ...prev, [commentId]: validation }));
      return;
    }

    setLoadingComments(prev => new Set([...prev, `reply-${commentId}`]));
    setErrors(prev => ({ ...prev, [commentId]: null }));

    const replyContent = replyText;

    try {
      await replyToComment(postId, commentId, currentUserId, replyContent);

      // Add optimistic reply to local state
      const optimisticReply = {
        id: Date.now(),
        author: {
          name: 'You',
          avatar: `https://i.pravatar.cc/32?u=${currentUserId}`,
        },
        text: replyContent,
        timestamp: new Date().toISOString(),
        likes: 0,
      };
      setLocalReplies(prev => ({
        ...prev,
        [commentId]: [...(prev[commentId] || []), optimisticReply],
      }));

      setReplyText('');
      setReplyingTo(null);

      if (onReplyComment) {
        onReplyComment(commentId, replyContent);
      }
    } catch (error) {
      console.error('Error replying to comment:', error);
      setErrors(prev => ({
        ...prev,
        [commentId]: 'Failed to send reply'
      }));
    } finally {
      setLoadingComments(prev => {
        const updated = new Set(prev);
        updated.delete(`reply-${commentId}`);
        return updated;
      });
    }
  }, [replyText, postId, currentUserId, onReplyComment]);

  if (!comments || comments.length === 0) {
    return null;
  }

  return (
    <div className="comment-section-wrapper">
      <div className="comments-list">
        {displayedComments.map((comment) => {
          const isLiked = likedComments.has(comment.id);
          const isLoadingLike = loadingComments.has(comment.id);
          const isLoadingReply = loadingComments.has(`reply-${comment.id}`);
          const commentError = errors[comment.id];
          const currentLikeCount = getCommentLikeCount(comment);
          const replies = localReplies[comment.id] || [];

          return (
            <div key={comment.id} className="comment-item">
              <img
                src={comment.author?.avatar || 'https://i.pravatar.cc/32?img=default'}
                alt={comment.author?.name}
                className="comment-avatar"
              />
              <div className="comment-content">
                <div className="comment-header">
                  <span className="comment-author">{comment.author?.name}</span>
                  <span className="comment-time">{formatTimestamp(comment.timestamp)}</span>
                </div>
                <p className="comment-text">{comment.text}</p>
                <div className="comment-actions">
                  <button
                    className="comment-action-btn"
                    onClick={() =>
                      setReplyingTo(replyingTo === comment.id ? null : comment.id)
                    }
                    disabled={isLoadingReply}
                  >
                    <MessageCircle size={14} />
                    Reply
                  </button>
                  <button
                    className={`comment-action-btn like-comment ${isLiked ? 'liked' : ''}`}
                    onClick={() => handleLikeComment(comment.id, currentLikeCount)}
                    disabled={isLoadingLike}
                  >
                    {isLoadingLike ? (
                      <Loader className="comment-heart-icon spin" size={14} />
                    ) : (
                      <Heart
                        className="comment-heart-icon"
                        size={14}
                        fill={isLiked ? 'currentColor' : 'none'}
                      />
                    )}
                    {currentLikeCount}
                  </button>
                </div>

                {commentError && (
                  <div className="comment-error">{commentError}</div>
                )}

                {/* Replies */}
                {replies.length > 0 && (
                  <div className="replies-list">
                    {replies.map((reply) => (
                      <div key={reply.id} className="reply-item">
                        <img
                          src={reply.author?.avatar || 'https://i.pravatar.cc/32?img=default'}
                          alt={reply.author?.name}
                          className="reply-avatar"
                        />
                        <div className="reply-content">
                          <div className="comment-header">
                            <span className="comment-author">{reply.author?.name}</span>
                            <span className="comment-time">{formatTimestamp(reply.timestamp)}</span>
                          </div>
                          <p className="comment-text">{reply.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {replyingTo === comment.id && (
                  <div className="reply-box">
                    <textarea
                      placeholder={`Reply to ${comment.author?.name}...`}
                      value={replyText}
                      onChange={(e) => {
                        setReplyText(e.target.value);
                        setErrors(prev => ({ ...prev, [comment.id]: null }));
                      }}
                      maxLength={MAX_COMMENT_LENGTH}
                      className="reply-input"
                      disabled={isLoadingReply}
                    />
                    <div className="reply-footer">
                      <span className="char-count">
                        {replyText.length}/{MAX_COMMENT_LENGTH}
                      </span>
                      <div className="reply-buttons">
                        <button
                          className="reply-cancel-btn"
                          onClick={() => {
                            setReplyingTo(null);
                            setReplyText('');
                            setErrors(prev => ({ ...prev, [comment.id]: null }));
                          }}
                          disabled={isLoadingReply}
                        >
                          Cancel
                        </button>
                        <button
                          className="reply-submit-btn"
                          onClick={() => handleReplySubmit(comment.id)}
                          disabled={isLoadingReply || !replyText.trim()}
                        >
                          {isLoadingReply ? (
                            <>
                              <Loader size={14} className="spin" /> Sending...
                            </>
                          ) : (
                            'Reply'
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {hasMoreComments && (
        <button className="load-more-comments" onClick={handleLoadMore}>
          Load more comments ({comments.length - displayCount} remaining)
        </button>
      )}
    </div>
  );
};

export default CommentSection;
