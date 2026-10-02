import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Heart, MessageCircle, Share2, Send } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { API_CONFIG } from '@/config/apiConfig';
import httpClient from '@/lib/httpClient';
import CommentSection from '@/components/feed/CommentSection';
import sanitizePostHtml from '@/utils/sanitizePostHtml';
import '../styles/PostDetails.css';

function PostDetails() {
  const { postId } = useParams();
  const { isAuthenticated, isAuthInitialized } = useAuth();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [profileId, setProfileId] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionMessage, setActionMessage] = useState('');
  const [showShareLink, setShowShareLink] = useState(false);
  const [copyMessage, setCopyMessage] = useState('');
  const shareRef = useRef(null);

  const loadPost = useCallback(async () => {
    const postPath = `${API_CONFIG.ENDPOINTS.HOME}/${postId}`;
    try {
      const [postResult, commentsResult] = await Promise.all([
        httpClient.request(postPath),
        httpClient.request(`${postPath}/comments`),
      ]);
      setPost(postResult);
      setIsLiked(Boolean(postResult?.isLiked));
      setComments((commentsResult?.data || []).map((comment) => ({
        id: comment.id,
        postId: comment.postId,
        userId: comment.userId,
        text: comment.content,
        timestamp: comment.createdOn,
        likes: comment.likeCount,
        author: { name: comment.authorName || 'Footprint member' },
      })));
      setError('');
    } catch (requestError) {
      setError(requestError.message || 'This post could not be loaded.');
    } finally {
      setIsLoading(false);
    }
  }, [isAuthInitialized, postId]);

  useEffect(() => {
    if (!isAuthInitialized) return;
    setIsLoading(true);
    loadPost();
  }, [isAuthInitialized, loadPost]);

  useEffect(() => {
    if (!isAuthenticated) {
      setProfileId(null);
      return;
    }

    httpClient.request(API_CONFIG.ENDPOINTS.PROFILE.ME)
      .then((profile) => setProfileId(profile?.userId || null))
      .catch(() => setProfileId(null));
  }, [isAuthenticated]);

  const handleLike = async () => {
    if (!profileId || !post) return;
    try {
      await httpClient.request(`${API_CONFIG.ENDPOINTS.HOME}/${postId}/like`, {
        method: 'POST',
        body: JSON.stringify({ postId: Number(postId) }),
      });
      setIsLiked((liked) => !liked);
      await loadPost();
    } catch (requestError) {
      setActionMessage(requestError.message || 'Could not update your like.');
    }
  };

  const handleComment = async (event) => {
    event.preventDefault();
    const content = commentText.trim();
    if (!content || !profileId) return;

    try {
      await httpClient.request(`${API_CONFIG.ENDPOINTS.HOME}/${postId}/comment`, {
        method: 'POST',
        body: JSON.stringify({ postId: Number(postId), content }),
      });
      setCommentText('');
      setActionMessage('Comment posted.');
      await loadPost();
    } catch (requestError) {
      setActionMessage(requestError.message || 'Could not post your comment.');
    }
  };

  const handleLikeComment = async (commentId) => {
    if (!profileId) return;
    try {
      await httpClient.request(`${API_CONFIG.ENDPOINTS.HOME}/comment/${commentId}/like`, {
        method: 'POST',
        body: JSON.stringify({ commentId }),
      });
      await loadPost();
    } catch (requestError) {
      setActionMessage(requestError.message || 'Could not update the comment like.');
      throw requestError;
    }
  };

  const handleReply = async (commentId, content) => {
    if (!profileId) return;
    try {
      await httpClient.request(`${API_CONFIG.ENDPOINTS.HOME}/${postId}/comment/${commentId}/reply`, {
        method: 'POST',
        body: JSON.stringify({
          postId: Number(postId),
          parentCommentId: commentId,
          content,
        }),
      });
      setActionMessage('Reply posted.');
      await loadPost();
    } catch (requestError) {
      setActionMessage(requestError.message || 'Could not post your reply.');
      throw requestError;
    }
  };

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

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopyMessage('Link copied.');
    } catch {
      setCopyMessage('Copy failed. Select the link to copy it.');
    }
  };

  if (isLoading) return <p className="post-detail-state" role="status">Loading post...</p>;
  if (error || !post) {
    return (
      <section className="post-detail-state">
        <p role="alert">{error || 'Post not found.'}</p>
        <Link to="/" className="post-detail-back"><ArrowLeft size={16} /> Back to feed</Link>
      </section>
    );
  }

  const body = post.autoGeneratedPostByAi || post.autoGeneratedPost || '';
  const postedDate = post.postedOn ? new Date(post.postedOn).toLocaleDateString(undefined, {
    year: 'numeric', month: 'long', day: 'numeric',
  }) : '';

  return (
    <main className="post-detail-page">
      <Link to="/" className="post-detail-back"><ArrowLeft size={16} /> Feed</Link>
      <article className="post-detail">
        <header className="post-detail__header">
          <div className="post-detail__byline">
            <span>{post.author || 'Footprint member'}</span>
            {postedDate && <time dateTime={post.postedOn}>{postedDate}</time>}
          </div>
          {post.source && <p className="post-detail__source">{post.source}</p>}
          <h1>{post.title || 'Untitled post'}</h1>
          {post.repoUrl && (
            <a className="post-detail__original" href={post.repoUrl} target="_blank" rel="noreferrer">
              View original source
            </a>
          )}
        </header>

        <div className="post-detail__body" dangerouslySetInnerHTML={{ __html: sanitizePostHtml(body) }} />

        <section className="post-detail__engagement" aria-label="Post engagement">
          <div className="post-detail__counts">
            <span><Heart size={15} /> {post.likeCount || 0} likes</span>
            <span><MessageCircle size={15} /> {post.commentCount || comments.length} comments</span>
          </div>
          <div className="post-detail__actions">
            <button
              type="button"
              onClick={handleLike}
              disabled={!isAuthenticated || !profileId}
              title={isAuthenticated ? 'Like' : 'Log in to like'}
              className={isLiked ? 'is-liked' : ''}
            >
              <Heart size={17} fill={isLiked ? 'currentColor' : 'none'} /> Like
            </button>
            <a href="#comments"><MessageCircle size={17} /> Comment</a>
            <div className="post-detail__share" ref={shareRef}>
              <button
                type="button"
                className="post-detail__share-trigger"
                aria-expanded={showShareLink}
                aria-controls="post-share-link"
                onClick={() => {
                  setShowShareLink((isOpen) => !isOpen);
                  setCopyMessage('');
                }}
              >
                <Share2 size={17} /> Share
              </button>
              {showShareLink && (
                <div className="post-detail__share-panel" id="post-share-link" role="dialog" aria-label="Share post link">
                  <label htmlFor="post-share-url">Post link</label>
                  <div className="post-detail__share-link-row">
                    <input
                      id="post-share-url"
                      type="text"
                      readOnly
                      value={window.location.href}
                      onFocus={(event) => event.currentTarget.select()}
                    />
                    <button type="button" onClick={handleCopyLink}>Copy</button>
                  </div>
                  {copyMessage && <p role="status">{copyMessage}</p>}
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="post-detail__comments" id="comments">
          <h2>Conversation <span>{comments.length}</span></h2>
          {isAuthenticated ? (
            <form className="post-detail__comment-form" onSubmit={handleComment}>
              <label className="sr-only" htmlFor="post-comment">Write a comment</label>
              <input
                id="post-comment"
                value={commentText}
                onChange={(event) => setCommentText(event.target.value)}
                placeholder="Add a thoughtful comment..."
                maxLength={1000}
                disabled={!profileId}
              />
              <button type="submit" disabled={!profileId || !commentText.trim()} aria-label="Send comment">
                <Send size={17} />
              </button>
            </form>
          ) : (
            <p className="post-detail__login-prompt"><Link to="/login">Log in</Link> to add a comment.</p>
          )}
          {actionMessage && <p className="post-detail__message" role="status">{actionMessage}</p>}
          {comments.length > 0 ? (
            <CommentSection
              comments={comments}
              isAuthenticated={isAuthenticated && Boolean(profileId)}
              onLikeComment={handleLikeComment}
              onReplyComment={handleReply}
            />
          ) : (
            <p className="post-detail__empty">No comments yet.</p>
          )}
        </section>
      </article>
    </main>
  );
}

export default PostDetails;