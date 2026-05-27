import React, { useState, useEffect, useCallback } from "react";
import "../../styles/PostCard.css";
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Send,
  Loader,
} from "lucide-react";
import CommentSection from "./CommentSection";
import { fetchComments } from "../../lib/api";

const MIN_COMMENT_LENGTH = 1;
const MAX_COMMENT_LENGTH = 500;

const PostCard = ({
  id,
  author,
  timestamp,
  content,
  likes = 0,
  comments = 0,
  shares = 0,
  commentsList = [],
  onLike,
  onComment,
  onShare,
  onAddOption,
  onDelete,
  onLikeComment,
  onReplyComment,
  currentUser, // { id, name, avatar } - the user who will comment
  delay = 5000,
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [currentLikes, setCurrentLikes] = useState(likes);
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [isLoading, setIsLoading] = useState(delay > 0);
  const [showOptions, setShowOptions] = useState(false);
  const [isCommentingLoading, setIsCommentingLoading] = useState(false);
  const [commentError, setCommentError] = useState(null);
  const [optimisticLikes, setOptimisticLikes] = useState(false);
  const [localComments, setLocalComments] = useState([]);
  const [commentsLoaded, setCommentsLoaded] = useState(false);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [currentCommentCount, setCurrentCommentCount] = useState(comments);

  useEffect(() => {
    if (!delay) return;
    setIsLoading(true);
    const t = setTimeout(() => setIsLoading(false), delay);
    return () => clearTimeout(t);
  }, [delay]);

  // Close options menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showOptions && !event.target.closest('.options-container')) {
        setShowOptions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showOptions]);

  const validateComment = (text) => {
    if (text.trim().length < MIN_COMMENT_LENGTH) {
      return 'Comment cannot be empty';
    }
    if (text.length > MAX_COMMENT_LENGTH) {
      return `Comment cannot exceed ${MAX_COMMENT_LENGTH} characters`;
    }
    return null;
  };

  const handleLike = async () => {
    // Optimistic update
    setOptimisticLikes(true);
    setIsLiked(!isLiked);
    setCurrentLikes(isLiked ? currentLikes - 1 : currentLikes + 1);

    if (onLike) {
      try {
        await onLike();
      } catch (error) {
        // Revert on error
        setIsLiked(isLiked);
        setCurrentLikes(isLiked ? currentLikes + 1 : currentLikes - 1);
      }
    }
    setOptimisticLikes(false);
  };

  const loadComments = useCallback(async () => {
    if (commentsLoaded || commentsLoading) return;
    setCommentsLoading(true);
    try {
      const fetched = await fetchComments(id);
      setLocalComments(fetched);
      setCommentsLoaded(true);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setCommentsLoading(false);
    }
  }, [id, commentsLoaded, commentsLoading]);

  const handleToggleComments = () => {
    const next = !showComments;
    setShowComments(next);
    if (next && !commentsLoaded) {
      loadComments();
    }
  };

  const handleComment = async () => {
    const validation = validateComment(commentText);
    if (validation) {
      setCommentError(validation);
      return;
    }

    setIsCommentingLoading(true);
    setCommentError(null);

    try {
      if (onComment) {
        await onComment(commentText);
      }
      // Optimistic: add comment to local list immediately
      const optimisticComment = {
        id: Date.now(),
        author: {
          name: currentUser?.name || 'You',
          avatar: currentUser?.avatar || 'https://i.pravatar.cc/32?img=5',
        },
        text: commentText,
        timestamp: new Date().toISOString(),
        likes: 0,
      };
      setLocalComments(prev => [optimisticComment, ...prev]);
      setCurrentCommentCount(prev => prev + 1);
      setShowComments(true);
      setCommentsLoaded(true);
      setCommentText("");
      setShowCommentBox(false);
    } catch (error) {
      console.error('Error posting comment:', error);
      setCommentError('Failed to post comment. Please try again.');
    } finally {
      setIsCommentingLoading(false);
    }
  };

  const handleShare = () => {
    if (onShare) {
      onShare();
    }
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
  };

  const handleAddOption = () => {
    setShowOptions(!showOptions);
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete();
    }
    setShowOptions(false);
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  if (isLoading) {
    return (
      <div className="post-card post-card--loading">
        <div className="post-header">
          <div className="author-info">
            <div className="skeleton-avatar" />
            <div className="author-details">
              <div className="skeleton-line skeleton-short" />
              <div className="skeleton-line skeleton-tiny" />
            </div>
          </div>
          <div className="skeleton-line skeleton-tiny" />
        </div>

        <div className="post-caption-hashtags">
          <div className="skeleton-line" />
        </div>

        <div className="post-image-container">
          <div className="skeleton-image" />
        </div>

        <div className="post-actions">
          <div className="skeleton-btn" />
          <div className="skeleton-btn" />
          <div className="skeleton-btn" />
          <div className="actions-spacer" />
          <div className="skeleton-btn" />
        </div>

        <div className="comment-section">
          <div className="comment-row">
            <div className="skeleton-avatar skeleton-avatar-small" />
            <div className="skeleton-line" />
            <div className="skeleton-btn skeleton-btn-small" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="post-card">
      {/* Header with author info */}
      <div className="post-header">
        <div className="author-info">
          <img
            src={author?.avatar || "https://via.placeholder.com/48"}
            alt={author?.name}
            className="author-avatar"
          />
          <div className="author-details">
            <h3 className="author-name">{author?.name || "Anonymous"}</h3>
            <p className="post-timestamp">{formatTimestamp(timestamp)}</p>
          </div>
        </div>
        <div className="options-container">
          <button
            className="options-btn"
            onClick={handleAddOption}
            title="More options"
          >
            ⋯
          </button>
          {showOptions && (
            <div className="options-menu">
              <button 
                className="option-item delete-option"
                onClick={handleDelete}
              >
                Delete Post
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Caption */}
      {(content?.text || content?.title) && (
        <div className="post-caption-hashtags">
          {content.title && (
            <h4 className="post-card-title" style={{ fontWeight: 700, fontSize: "1.15rem", marginBottom: "8px", color: "var(--text-main)" }}>
              {content.title}
            </h4>
          )}
          {content.text && <div className="post-caption">{content.text}</div>}
          {/* Hashtags */}
          {content?.hashtags && (
            <div className="post-hashtags">
              {content.hashtags.split(" ").map((tag, idx) => (
                <a key={idx} href={`#${tag}`} className="hashtag">
                  {tag}
                </a>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Content Image */}
      {content?.image && (
        <div className="post-image-container">
          <img src={content.image} alt="Post content" className="post-image" />
        </div>
      )}

      {/* AI Summary */}
      {content?.summary && content.summary !== content.text && (
        <div className="post-summary">
          <p className="summary-text">{content.summary}</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="post-actions">
        <button
          className={`action-btn like-btn ${isLiked ? "liked" : ""}`}
          onClick={handleLike}
          title="Like"
          disabled={optimisticLikes}
        >
          {optimisticLikes ? (
            <Loader className="hi-icon heart-icon spin" />
          ) : isLiked ? (
            <Heart className="hi-icon heart-icon" fill="currentColor" />
          ) : (
            <Heart className="hi-icon heart-icon" />
          )}
          <span className="action-count">{currentLikes}</span>
        </button>

        <button
          className="action-btn comment-btn"
          onClick={handleToggleComments}
          title="Comment"
        >
          <MessageCircle className="hi-icon chat-icon" />
          <span className="action-count">{currentCommentCount}</span>
        </button>

        <button
          className="action-btn share-btn"
          onClick={handleShare}
          title="Share"
        >
          <Share2 className="hi-icon share-icon" />
        </button>

        <div className="actions-spacer" />

        <button
          className={`action-btn bookmark-btn ${isSaved ? "saved" : ""}`}
          onClick={handleSave}
          title="Save"
        >
          {isSaved ? (
            <Bookmark className="hi-icon bookmark-icon saved" fill="currentColor" />
          ) : (
            <Bookmark className="hi-icon bookmark-icon" />
          )}
        </button>
      </div>

      {/* Comment Input Box */}
      <div className="comment-section">
        <div className="comment-row">
          <img
            src={currentUser?.avatar || "https://i.pravatar.cc/40?img=5"}
            alt={currentUser?.name || "You"}
            className="comment-avatar"
          />
          <div className="comment-input-wrap">
            <div className="comment-input-container">
              <input
                className="comment-input"
                type="text"
                placeholder="Write a comment..."
                value={commentText}
                onChange={(e) => {
                  setCommentText(e.target.value);
                  setCommentError(null);
                }}
                onKeyPress={(e) => {
                  if (e.key === "Enter" && !isCommentingLoading) {
                    handleComment();
                  }
                }}
                disabled={isCommentingLoading}
                maxLength={MAX_COMMENT_LENGTH}
              />
              <span className="char-count-inline">
                {commentText.length}/{MAX_COMMENT_LENGTH}
              </span>
            </div>
            {commentError && (
              <div className="comment-error-message">{commentError}</div>
            )}
          </div>
          <div className="comment-actions">
            <button
              className="btn-send"
              onClick={handleComment}
              disabled={!commentText.trim() || isCommentingLoading}
              title="Send"
            >
              {isCommentingLoading ? (
                <Loader className="send-icon spin" size={18} />
              ) : (
                <Send className="send-icon" size={18} />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Comments Display */}
      {showComments && (
        commentsLoading ? (
          <div className="comments-loading">
            <Loader className="spin" size={18} />
            <span>Loading comments...</span>
          </div>
        ) : localComments.length > 0 ? (
          <CommentSection
            comments={localComments}
            postId={id}
            currentUserId={currentUser?.id}
            onAddComment={onComment}
            onLikeComment={onLikeComment}
            onReplyComment={onReplyComment}
          />
        ) : (
          <div className="no-comments-yet">
            <span>No comments yet. Be the first to comment!</span>
          </div>
        )
      )}
    </div>
  );
};

export default PostCard;
