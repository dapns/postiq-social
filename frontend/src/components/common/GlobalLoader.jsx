import { useSelector } from 'react-redux';
import './GlobalLoader.css';

function GlobalLoader() {
  const isLoading = useSelector((state) => state.apiLoading.requestCount > 0);

  if (!isLoading) return null;

  return (
    <div className="global-loader" role="status" aria-label="Loading" aria-live="polite">
      <span className="global-loader__spinner" aria-hidden="true" />
    </div>
  );
}

export default GlobalLoader;