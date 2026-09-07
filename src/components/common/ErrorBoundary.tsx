import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';
import { Button } from '../ui/button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ error, errorInfo });
    console.error('ErrorBoundary captured error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  public override render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-[400px] p-6 flex flex-col items-center justify-center text-center max-w-xl mx-auto my-12 rounded-2xl border border-rose-200 dark:border-rose-900/50 bg-rose-50/40 dark:bg-rose-950/20 font-sans">
          <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-900/40 flex items-center justify-center text-rose-600 dark:text-rose-400 mb-4">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-1">
            Diagnostic Subsystem Fault
          </h2>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-4 max-w-md">
            An unexpected error occurred in this diagnostic module. Telemetry buffers and event listeners have been quarantined to prevent memory leaks.
          </p>

          {this.state.error && (
            <div className="w-full text-left p-3 mb-5 rounded-lg bg-zinc-900 text-zinc-100 font-mono text-[11px] overflow-x-auto border border-zinc-800">
              <span className="text-rose-400 font-bold block mb-1">
                {this.state.error.name}: {this.state.error.message}
              </span>
              {this.state.errorInfo?.componentStack && (
                <pre className="text-zinc-400 text-[10px] whitespace-pre-wrap">
                  {this.state.errorInfo.componentStack.slice(0, 300)}...
                </pre>
              )}
            </div>
          )}

          <div className="flex items-center gap-3">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                window.location.href = '/';
              }}
              className="gap-1.5"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Return Home</span>
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={this.handleReset}
              className="gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retry Component</span>
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
