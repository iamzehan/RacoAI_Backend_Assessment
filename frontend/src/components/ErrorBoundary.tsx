import { Component, type ErrorInfo, type ReactNode } from "react";
import { Alert } from "./Alert";

type Props = {
  children: ReactNode;
  fallback?: ReactNode;
};

type State = { error: string | null };

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error) {
    return { error: error.message || "Something went wrong." };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(error, info);
  }

  render() {
    if (this.state.error) {
      return (
        this.props.fallback ?? (
          <Alert text={this.state.error} />
        )
      );
    }
    return this.props.children;
  }
}
