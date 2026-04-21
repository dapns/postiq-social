import React, { useState, useEffect } from "react";
import "../../styles/PostCard.css";
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Send,
} from "lucide-react";
import CommentSection from "./CommentSection";

const PostCard = ({
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
  currentUser, // { name, avatar } - the user who will comment
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

  const handleLike = () => {
    setIsLiked(!isLiked);
    setCurrentLikes(isLiked ? currentLikes - 1 : currentLikes + 1);
    if (onLike) {
      onLike();
    }
  };

  const handleComment = () => {
    if (commentText.trim()) {
      if (onComment) {
        onComment(commentText);
      }
      setCommentText("");
      setShowCommentBox(false);
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
      {content?.text && (
        <div className="post-caption-hashtags">
          <div className="post-caption">{content.text}</div>
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
      {content?.summary && (
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
        >
          {isLiked ? (
            <Heart className="hi-icon heart-icon" fill="currentColor" />
          ) : (
            <Heart className="hi-icon heart-icon" />
          )}
          <span className="action-count">{currentLikes}</span>
        </button>

        <button
          className="action-btn comment-btn"
          onClick={() => setShowComments(!showComments)}
          title="Comment"
        >
          <MessageCircle className="hi-icon chat-icon" />
          <span className="action-count">{comments}</span>
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
            <input
              className="comment-input"
              type="text"
              placeholder="Write a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleComment();
                }
              }}
            />
          </div>
          <div className="comment-actions">
            <button
              className="btn-send"
              onClick={handleComment}
              disabled={!commentText.trim()}
              title="Send"
            >
              <Send className="send-icon" />
            </button>
          </div>
        </div>
      </div>

      {/* Comments Display */}
      {showComments && commentsList && commentsList.length > 0 && (
        <CommentSection
          comments={commentsList}
          onAddComment={onComment}
          onLikeComment={onLikeComment}
          onReplyComment={onReplyComment}
        />
      )}
    </div>
  );
};

export default PostCard;
