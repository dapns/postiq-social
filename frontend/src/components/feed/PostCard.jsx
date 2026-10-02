import React, { useState, useEffect, useRef } from "react";
import { Link } from 'react-router-dom';
import "../../styles/PostCard.css";
import { useAuth } from "@/hooks/useAuth";
import { API_CONFIG } from '@/config/apiConfig';
import httpClient from '@/lib/httpClient';
import getInitials from '@/utils/getInitials';
import sanitizePostHtml from '@/utils/sanitizePostHtml';
import {
  Heart,
  MessageCircle,
  Share2,
  Send,
} from "lucide-react";
import CommentSection from "./CommentSection";

const CONTENT_COLLAPSE_THRESHOLD = 560;

const getHtmlTextLength = (html) => {
  if (!html) return 0;
  return new DOMParser().parseFromString(html, "text/html").body.textContent?.trim().length || 0;
};

const PostCard = ({
  postId,
  author,
  timestamp,
  content,
  likes = 0,
  comments = 0,
  shares = 0,
  commentsList = null,
  initiallyLiked = false,
  onLike,
  onComment,
  onShare,
  onAddOption,
  onDelete,
  onLikeComment,
  onReplyComment,
  openPostInNewTab = false,
  currentUser, // { name, avatar } - the user who will comment
  delay = 5000,
}) => {
  const { isAuthenticated } = useAuth();
  const [isLiked, setIsLiked] = useState(initiallyLiked);
  const [isContentExpanded, setIsContentExpanded] = useState(false);
  const [currentLikes, setCurrentLikes] = useState(likes);
  const [currentComments, setCurrentComments] = useState(comments);
  const [isSubmittingAction, setIsSubmittingAction] = useState(false);
  const [actionError, setActionError] = useState('');
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [loadedComments, setLoadedComments] = useState(commentsList);
  const [commentsLoaded, setCommentsLoaded] = useState(Array.isArray(commentsList));
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [isLoading, setIsLoading] = useState(delay > 0);
  const [showOptions, setShowOptions] = useState(false);
  const [showShareLink, setShowShareLink] = useState(false);
  const [copyMessage, setCopyMessage] = useState('');
  const shareRef = useRef(null);
  const contentLength = (content?.text?.length || 0)
    + (content?.summary?.length || 0)
    + getHtmlTextLength(content?.html);
  const canExpandContent = contentLength > CONTENT_COLLAPSE_THRESHOLD;

  useEffect(() => {
    setIsLiked(initiallyLiked);
  }, [initiallyLiked]);

  useEffect(() => {
    if (!Array.isArray(commentsList)) return;
    setLoadedComments(commentsList);
    setCommentsLoaded(true);
  }, [commentsList]);

  const loadComments = async (force = false) => {
    if ((!force && commentsLoaded) || isLoadingComments) return;

    setIsLoadingComments(true);
    setActionError('');
    try {
      const response = await httpClient.request(`${API_CONFIG.ENDPOINTS.HOME}/${postId}/comments`);
      const fetchedComments = (Array.isArray(response?.data) ? response.data : []).map((comment) => ({
        id: comment.id,
        postId: comment.postId,
        userId: comment.userId,
        text: comment.content,
        timestamp: comment.createdOn,
        likes: comment.likeCount || 0,
        author: { name: comment.authorName || 'PostIQ member' },
      }));
      setLoadedComments(fetchedComments);
      setCommentsLoaded(true);
    } catch (requestError) {
      setActionError(requestError.message || 'Could not load comments.');
    } finally {
      setIsLoadingComments(false);
    }
  };

  const toggleComments = () => {
    const shouldShow = !showComments;
    setShowComments(shouldShow);
    if (shouldShow) loadComments();
  };

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

  useEffect(() => {
    if (!showShareLink) return undefined;

    const closeOnOutsideClick = (event) => {
      if (!shareRef.current?.contains(event.target)) setShowShareLink(false);
    };
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setShowShareLink(false);
    };

    document.addEventListener('mousedown', closeOnOutsideClick);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('mousedown', closeOnOutsideClick);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [showShareLink]);

  const handleLike = async () => {
    if (!isAuthenticated || isSubmittingAction) return;
    const wasLiked = isLiked;
    setIsLiked(!wasLiked);
    setCurrentLikes((count) => Math.max(0, count + (wasLiked ? -1 : 1)));
    setIsSubmittingAction(true);
    setActionError('');
    try {
      await onLike?.();
    } catch (requestError) {
      setIsLiked(wasLiked);
      setCurrentLikes((count) => Math.max(0, count + (wasLiked ? 1 : -1)));
      setActionError(requestError.message || 'Could not update your like.');
    } finally {
      setIsSubmittingAction(false);
    }
  };

  const handleComment = async () => {
    const text = commentText.trim();
    if (!isAuthenticated || !text || isSubmittingAction) return;

    setIsSubmittingAction(true);
    setActionError('');
    try {
      await onComment?.(text);
      setCurrentComments((count) => count + 1);
      setCommentText("");
      setShowCommentBox(false);
      if (showComments) await loadComments(true);
      else setCommentsLoaded(false);
    } catch (requestError) {
      setActionError(requestError.message || 'Could not post your comment.');
    } finally {
      setIsSubmittingAction(false);
    }
  };

  const handleShare = () => {
    setShowShareLink((isOpen) => !isOpen);
    setCopyMessage('');
    if (onShare) {
      onShare();
    }
  };

  const handleCopyLink = async () => {
    const shareUrl = `${window.location.origin}/post/${postId}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopyMessage('Link copied.');
    } catch {
      setCopyMessage('Copy failed. Select the link to copy it.');
    }
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
    <div className={`post-card${showShareLink ? ' post-card--share-open' : ''}`}>
      {/* Header with author info */}
      <div className="post-header">
        <div className="author-info">
          {author?.avatar ? (
            <div className="author-avatar-wrap">
              <img
                src={author.avatar}
                alt={author?.name || "Author"}
                className="author-avatar"
                onError={(event) => {
                  event.currentTarget.hidden = true;
                  event.currentTarget.nextElementSibling.hidden = false;
                }}
              />
              <span className="author-avatar-fallback" hidden>
                {getInitials(author?.name) || "P"}
              </span>
            </div>
          ) : (
            <span className="author-avatar-fallback">
              {getInitials(author?.name) || "P"}
            </span>
          )}
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

      <div className={`post-copy${canExpandContent && !isContentExpanded ? " post-copy--collapsed" : ""}`}>
        {content?.title && (
          <h2 className="post-title">
            <Link
              className="post-title-link"
              to={`/post/${postId}`}
              target={openPostInNewTab ? '_blank' : undefined}
              rel={openPostInNewTab ? 'noopener noreferrer' : undefined}
            >
              {content.title}
            </Link>
          </h2>
        )}

        {content?.text && (
          <div className="post-caption-hashtags">
            <div className="post-caption">{content.text}</div>
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

        {content?.summary && (
          <div className="post-summary">
            <p className="summary-text">{content.summary}</p>
          </div>
        )}

        {content?.html && (
          <article
            className="post-body"
            onErrorCapture={(event) => {
              if (event.target.tagName === "IMG") event.target.hidden = true;
            }}
            dangerouslySetInnerHTML={{ __html: sanitizePostHtml(content.html) }}
          />
        )}
      </div>

      {canExpandContent && (
        <button
          type="button"
          className="post-expand-btn"
          aria-expanded={isContentExpanded}
          onClick={() => setIsContentExpanded((expanded) => !expanded)}
        >
          {isContentExpanded ? "See less" : "See more"}
        </button>
      )}

      {content?.image && (
        <div className="post-image-container">
          <img src={content.image} alt="Post content" className="post-image" />
        </div>
      )}

      {/* Action Buttons */}
      <div className="post-actions">
          <button
            className={`action-btn like-btn ${isLiked ? "liked" : ""}`}
            onClick={handleLike}
            title={isAuthenticated ? "Like" : "Log in to like"}
            disabled={!isAuthenticated || isSubmittingAction}
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
            onClick={toggleComments}
            title="Comment"
            aria-expanded={showComments}
          >
            <MessageCircle className="hi-icon chat-icon" />
            <span className="action-count">{currentComments}</span>
          </button>

          <div className="post-share-container" ref={shareRef}>
            <button
              className="action-btn share-btn"
              onClick={handleShare}
              title="Share"
              aria-label="Share post"
              aria-expanded={showShareLink}
              aria-controls={`post-share-link-${postId}`}
            >
              <Share2 className="hi-icon share-icon" />
            </button>
            {showShareLink && (
              <div className="post-share-panel" id={`post-share-link-${postId}`} role="dialog" aria-label="Share post link">
                <label htmlFor={`post-share-url-${postId}`}>Post link</label>
                <div className="post-share-link-row">
                  <input
                    id={`post-share-url-${postId}`}
                    type="text"
                    readOnly
                    value={`${window.location.origin}/post/${postId}`}
                    onFocus={(event) => event.currentTarget.select()}
                  />
                  <button type="button" onClick={handleCopyLink}>Copy</button>
                </div>
                {copyMessage && <p role="status">{copyMessage}</p>}
              </div>
            )}
          </div>
      </div>

      {actionError && <p className="post-action-error" role="alert">{actionError}</p>}

      {/* Comment Input Box */}
      {isAuthenticated ? <div className="comment-section">
        <div className="comment-row">
          <span className="comment-avatar comment-avatar--initials" aria-hidden="true">
            {currentUser?.initials || ''}
          </span>
          <div className="comment-input-wrap">
            <input
              className="comment-input"
              type="text"
              placeholder="Write a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleComment();
                }
              }}
            />
          </div>
          <div className="comment-actions">
            <button
              className="btn-send"
              onClick={handleComment}
              disabled={!commentText.trim() || isSubmittingAction}
              title={isSubmittingAction ? 'Sending...' : 'Send'}
            >
              <Send className="send-icon" />
            </button>
          </div>
        </div>
      </div> : (
        <div className="comment-section comment-section--login">
          <Link to="/login">Log in</Link> to add a comment.
        </div>
      )}

      {/* Comments Display */}
      {showComments && (
        isLoadingComments ? (
          <p role="status" className="post-comments-preview">Loading comments...</p>
        ) : commentsLoaded && loadedComments?.length > 0 ? (
          <CommentSection
            comments={loadedComments}
            onAddComment={onComment}
            onLikeComment={onLikeComment}
            onReplyComment={onReplyComment}
            isAuthenticated={isAuthenticated}
          />
        ) : commentsLoaded ? (
          <p className="post-comments-preview">No comments yet.</p>
        ) : (
          <div className="post-comments-preview">
            {actionError ? (
              <button type="button" onClick={loadComments}>Try loading comments again</button>
            ) : (
              <Link to={`/post/${postId}#comments`}>View comments on post</Link>
            )}
          </div>
        )
      )}
    </div>
  );
};

export default PostCard;
