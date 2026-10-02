import { FileText } from "lucide-react";
import { Link } from "react-router-dom";
import BrandIdentity from "@/components/common/BrandIdentity";

const AuthLayout = ({ children }) => (
  <div className="auth-container">
    <aside className="auth-showcase">
      <Link to="/" className="auth-brand" aria-label="Footprint home">
        <BrandIdentity className="auth-brand-identity" />
      </Link>

      <div className="auth-showcase-copy">
        <p className="auth-eyebrow">A little more room to think</p>
        <h2>Good ideas deserve a clearer way out.</h2>
        <p className="auth-showcase-description">
          Bring a draft, shape the words, and review your next post in one focused workspace.
        </p>
      </div>

      <div className="auth-preview" aria-label="Footprint draft preview">
        <div className="auth-preview-topline">
          <span><FileText size={15} aria-hidden="true" /> Draft preview</span>
          <span className="auth-preview-status">Ready to refine</span>
        </div>
        <p className="auth-preview-title">The first version is just a starting point.</p>
        <p className="auth-preview-copy">
          Keep the useful idea. Find the right words. Share when it feels like you.
        </p>
        <div className="auth-preview-rule" />
        <div className="auth-preview-footer"><span>YOUR VOICE</span><span>YOUR NEXT POST</span></div>
      </div>

      <p className="auth-showcase-footnote">Write <span>·</span> Refine <span>·</span> Review</p>
    </aside>
    {children}
  </div>
);

export default AuthLayout;