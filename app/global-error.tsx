"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#faf6f2",
          color: "#4a3a35",
          fontFamily: "system-ui, sans-serif",
          padding: 24,
          textAlign: "center",
        }}
      >
        <h1 style={{ fontSize: 36, fontWeight: 500 }}>Something went wrong</h1>
        <p style={{ marginTop: 12, maxWidth: 420, opacity: 0.7 }}>
          We hit an unexpected error. You can try again, or head back home.
        </p>
        <div style={{ marginTop: 32, display: "flex", gap: 12 }}>
          <button
            type="button"
            onClick={reset}
            style={{
              background: "#c17a6b",
              color: "#fff",
              border: 0,
              borderRadius: 8,
              padding: "12px 20px",
              cursor: "pointer",
            }}
          >
            Try again
          </button>
          <button
            type="button"
            onClick={() => {
              window.location.href = "/";
            }}
            style={{
              background: "transparent",
              color: "#4a3a35",
              border: "1px solid #e8ddd4",
              borderRadius: 8,
              padding: "12px 20px",
              cursor: "pointer",
            }}
          >
            Go home
          </button>
        </div>
      </body>
    </html>
  );
}
