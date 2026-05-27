import React, { useCallback, useRef, useState } from "react";
import "../../styles/UploadPanel.css";
import {
  Image,
  Video,
  BarChart3,
  Globe,
  Send,
  Paperclip,
  X,
  Sparkles,
  Loader,
} from "lucide-react";

const demoContent = `✨ Exploring the Latest Web Development Trends

Excited to share insights on the evolution of modern web frameworks. In 2025, we're seeing a remarkable shift towards AI-powered development tools, edge computing optimization, and the rise of component-driven architecture.

The future of web development is here - it's faster, smarter, and more efficient than ever before. 

#WebDevelopment #React #TechTrends #Innovation`;

const UploadPanel = ({ onUpload, onGeneratePost }) => {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [text, setText] = useState("");
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [demoText, setDemoText] = useState(demoContent);
  const fileInputRef = useRef(null);

  const handleFiles = useCallback(
    (files) => {
      if (!files || files.length === 0) return;
      const f = files[0];
      setFile(f);
      onUpload && onUpload(f);

      if (f.type && f.type.startsWith("image/")) {
        const url = URL.createObjectURL(f);
        setPreviewUrl(url);
      } else {
        setPreviewUrl(null);
      }
    },
    [onUpload]
  );

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const dt = e.dataTransfer;
    handleFiles(dt.files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handlePick = (e) => {
    handleFiles(e.target.files);
  };

  const handleShareClick = () => {
    setShowDemoModal(true);
  };

  const handlePostDemo = async () => {
    if (!demoText) return;
    setGenerating(true);
    try {
      await new Promise((r) => setTimeout(r, 900));
      const generated = {
        author: { name: "You", avatar: "https://i.pravatar.cc/40?img=5" },
        timestamp: new Date(),
        content: {
          text: demoText,
          image: null,
          summary: null,
        },
        likes: 0,
        comments: 0,
        shares: 0,
      };
      onGeneratePost && onGeneratePost(generated);
      setDemoText(demoContent);
      setShowDemoModal(false);
    } finally {
      setGenerating(false);
    }
  };

  const handleCloseDemoModal = () => {
    setShowDemoModal(false);
    setDemoText(demoContent);
  };

  const submitPost = async () => {
    if (!text && !file) return;
    setGenerating(true);
    try {
      await new Promise((r) => setTimeout(r, 900));
      const generated = {
        author: { name: "You", avatar: "https://i.pravatar.cc/40?img=5" },
        timestamp: new Date(),
        content: {
          text: text || "",
          image:
            file && file.type && file.type.startsWith("image/")
              ? previewUrl
              : null,
          summary: null,
        },
        likes: 0,
        comments: 0,
        shares: 0,
      };
      onGeneratePost && onGeneratePost(generated);
      setText("");
      setFile(null);
      setPreviewUrl(null);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div
      className="upload-panel-card"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <div className="share-row">
        <img className="u-avatar" src="https://i.pravatar.cc/40" alt="you" />
        <div className="prompt-box">
          <div className="attachments">
            <button
              className="icon-btn"
              title="Image"
              onClick={() => fileInputRef.current?.click()}
            >
              <Paperclip className="attachment-icon" />
            </button>
            <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) {
            setFile(file)
      setPreviewUrl(URL.createObjectURL(file))

          }
        }}
      />

            {file && (
              <span className="attachment-tag">
                {file.name}
                <button
                  type="button"
                  className="remove-btn"
                  onClick={() => {
                    setFile(null);
                    setPreviewUrl(null);
                  }}
                  aria-label={`Remove ${file.name}`}
                >
                  <X className="remove-icon" />
                </button>
              </span>
            )}
          </div>
          <input
            className="share-input w-full truncate whitespace-nowrap overflow-hidden"
            placeholder="Got a draft, idea, or doc? Drop it here and I’ll blog it up."
            title="Got a draft, idea, or doc? Drop it here and I’ll blog it up."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>
        {/* Post button hidden for now */}
        <button
          className="post-submit-btn"
          title="Post"
          onClick={submitPost}
          disabled={generating || (!text && !file)}
          style={{ display: 'none' }}
        >
          {generating ? (
            <Loader className="icon icon-white spin" size={18} />
          ) : (
            <Send className="icon icon-white" size={18} />
          )}
        </button>
        {/* AI Generate button hidden for now */}
        <button
          className="share-btn"
          title="AI Generate"
          onClick={handleShareClick}
          disabled={generating}
        >
          <Sparkles className="icon icon-white" />
        </button>
      </div>

      {/* Demo Content Modal */}
      {showDemoModal && (
        <div className="modal-overlay" onClick={handleCloseDemoModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-section">
                <Sparkles className="modal-icon" />
                <h2 className="modal-title">AI-Generated Content Preview</h2>
              </div>
              <button
                className="modal-close"
                onClick={handleCloseDemoModal}
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <div className="modal-body">
              <p className="modal-description">
                Here's a sample post generated with AI. Feel free to edit it before posting:
              </p>
              <textarea
                className="demo-textarea"
                value={demoText}
                onChange={(e) => setDemoText(e.target.value)}
                placeholder="Edit your post content here..."
              />
            </div>

            <div className="modal-footer">
              <button
                className="btn-secondary"
                onClick={handleCloseDemoModal}
                disabled={generating}
              >
                Cancel
              </button>
              <button
                className="btn-primary"
                onClick={handlePostDemo}
                disabled={generating || !demoText.trim()}
              >
                {generating ? "Posting..." : "Post"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadPanel;
