import React from 'react';
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';
import { RefreshCcw } from 'lucide-react';

interface FallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

const ErrorFallback: React.FC<FallbackProps> = ({ error, resetErrorBoundary }) => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
        <h2 className="text-2xl font-medium text-primary mb-4">¡Ups! Algo salió mal</h2>
        <p className="text-content mb-6">
          Disculpá las molestias. Por favor, intentá refrescar la página.
        </p>
        <button
          onClick={resetErrorBoundary}
          className="bg-accent text-white px-6 py-3 rounded-md flex items-center justify-center space-x-2 hover:bg-accent/90 transition-colors mx-auto"
        >
          <RefreshCcw size={18} />
          <span>Intentar de Nuevo</span>
        </button>
        {process.env.NODE_ENV === 'development' && (
          <pre className="mt-6 p-4 bg-secondary rounded text-left text-sm overflow-auto">
            {error.message}
          </pre>
        )}
      </div>
    </div>
  );
};

const ErrorBoundary: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ReactErrorBoundary FallbackComponent={ErrorFallback}>
      {children}
    </ReactErrorBoundary>
  );
};

export default ErrorBoundary;