import { useRouteError } from 'react-router-dom';
import StatusMessage from '@/components/common/StatusMessage/StatusMessage';

/**
 * Works as the app's Error Boundary: React Router shows this page
 * if any component crashes while rendering, instead of a blank white screen.
 */
function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  return (
    <div className="container" style={{ paddingTop: 'var(--space-6)' }}>
      <StatusMessage
        type="error"
        title="Something went wrong"
        message="An unexpected error occurred. Please reload the page."
        actionLabel="Reload page"
        onAction={() => window.location.reload()}
      />
    </div>
  );
}

export default ErrorPage;
