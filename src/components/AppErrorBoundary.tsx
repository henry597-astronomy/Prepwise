import { Component, type ErrorInfo, type ReactNode } from 'react';

type Props = { children: ReactNode };
type State = { error?: Error };

export class AppErrorBoundary extends Component<Props, State> {
  state: State = {};

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Prepwise render error', error, info.componentStack);
  }

  render() {
    if (!this.state.error) return this.props.children;
    return <div style={{ padding: 24, color: '#fff', fontFamily: 'system-ui' }}><h1>Prepwise could not load this screen.</h1><p>{this.state.error.message}</p></div>;
  }
}
