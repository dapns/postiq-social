const BrandIdentity = ({ className = "" }) => (
  <span className={`brand-identity ${className}`.trim()}>
    <span className="brand-mark" aria-hidden="true">
      <svg viewBox="0 0 64 64" fill="none">
        <ellipse cx="19" cy="41" rx="6" ry="10" transform="rotate(-22 19 41)" fill="currentColor" />
        <ellipse cx="13" cy="28" rx="2.4" ry="3.7" transform="rotate(-28 13 28)" fill="currentColor" />
        <ellipse cx="17" cy="24" rx="2.6" ry="3.7" transform="rotate(-16 17 24)" fill="currentColor" />
        <ellipse cx="22" cy="24" rx="2.5" ry="3.5" transform="rotate(5 22 24)" fill="currentColor" />
        <ellipse cx="26" cy="28" rx="2.2" ry="3.1" transform="rotate(20 26 28)" fill="currentColor" />
        <ellipse cx="44" cy="38" rx="6" ry="10" transform="rotate(22 44 38)" fill="currentColor" />
        <ellipse cx="38" cy="25" rx="2.2" ry="3.1" transform="rotate(-20 38 25)" fill="currentColor" />
        <ellipse cx="42" cy="21" rx="2.5" ry="3.5" transform="rotate(-5 42 21)" fill="currentColor" />
        <ellipse cx="47" cy="21" rx="2.6" ry="3.7" transform="rotate(16 47 21)" fill="currentColor" />
        <ellipse cx="51" cy="25" rx="2.4" ry="3.7" transform="rotate(28 51 25)" fill="currentColor" />
      </svg>
      <span className="brand-mark-accent" />
    </span>
    <span className="brand-copy">
      <span className="brand-name">Footprint</span>
      <span className="brand-tagline">every post leaves a mark</span>
    </span>
  </span>
);

export default BrandIdentity;
