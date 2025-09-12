import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  onError?: (error: string) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.props.onError?.(error.message);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center h-full bg-red-900/20">
          <div className="text-center p-6">
            <div className="text-red-400 text-xl mb-2">⚠️ Erro no renderizador 3D</div>
            <div className="text-red-300 mb-4">
              {this.state.error?.message || 'Erro desconhecido'}
            </div>
            <button
              onClick={() => this.setState({ hasError: false, error: undefined })}
              className="btn-primary"
            >
              Recarregar
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
