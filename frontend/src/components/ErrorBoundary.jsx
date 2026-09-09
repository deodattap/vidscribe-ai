import { Component } from 'react';
import { Button } from '@/components/ui/button';

class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('Uncaught error in component tree:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center gap-3">
          <h1 className="text-xl font-bold">Something went wrong</h1>
          <p className="text-muted-foreground max-w-md">
            An unexpected error occurred. Try reloading the page — if it keeps
            happening, please report it.
          </p>
          <Button onClick={() => window.location.reload()}>Reload page</Button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
