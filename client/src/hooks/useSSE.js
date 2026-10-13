import { useEffect } from "react";
import { useAuth } from "../auth/AuthContext";

export function useSSE(url, onMessage) {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return; // Null guard to prevent 401 loops when logged out

    const source = new EventSource(url, { withCredentials: true });

    source.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        onMessage(data);
      } catch (err) {
        console.error("[useSSE] Parse error:", err);
      }
    };

    source.onerror = (err) => {
      console.error("[useSSE] SSE error:", err);
    };

    return () => {
      source.close(); // Cleanup connection on unmount or logout
    };
  }, [url, user, onMessage]);
}
