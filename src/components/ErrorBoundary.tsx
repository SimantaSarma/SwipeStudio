// src/components/ErrorBoundary.tsx
import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error caught by ErrorBoundary:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-paper flex items-center justify-center p-6 text-ink-900">
          <div className="max-w-md w-full bg-surface border border-sand-200 rounded-xl p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-4 text-alert-700">
              <AlertTriangle className="w-6 h-6 stroke-[1.5]" />
              <h2 className="font-display text-xl font-semibold">Something went wrong</h2>
            </div>
            <p className="text-ink-700 text-sm mb-6 leading-relaxed">
              An unexpected render issue occurred. Your lead state and form data in this session are safe.
            </p>
            {this.state.error && (
              <pre className="text-xs font-mono bg-sand-100 p-3 rounded-md overflow-x-auto mb-6 text-ink-700 border border-sand-200">
                {this.state.error.message}
              </pre>
            )}
            <button
              onClick={this.handleReset}
              className="btn-primary w-full gap-2 text-sm"
            >
              <RefreshCw className="w-4 h-4 stroke-[1.5]" />
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
