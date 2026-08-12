"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";

import { Button } from "@/components/ui/button";

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
}

interface State {
  hasError: boolean;
}

/** Catches render errors in feature trees and shows a recovery UI. */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("[ErrorBoundary]", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="container-page py-20 text-center">
          <h2 className="font-display text-3xl text-ink">
            {this.props.fallbackTitle ?? "Something went wrong"}
          </h2>
          <p className="mt-3 text-muted-foreground">
            Please refresh the page or try again in a moment.
          </p>
          <Button
            className="mt-6"
            onClick={() => this.setState({ hasError: false })}
          >
            Try again
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
