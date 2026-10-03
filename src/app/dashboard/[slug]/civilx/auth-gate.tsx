"use client";

import { useEffect, useState } from "react";
import { Icon } from "./shared";

type User = { id: string; name: string; identifier: string };

export function AuthGate({ children }: { children: (user: User) => React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [checking, setChecking] = useState(true);
  useEffect(() => { fetch("/api/civicfix/auth/session").then((response) => response.json()).then((data) => setUser(data.user)).finally(() => setChecking(false)); }, []);
  if (checking) return <div className="loading-screen"><Icon name="progress_activity" /> Restoring your session...</div>;
  if (user) return <>{children(user)}</>;
  return <AuthScreen onAuthenticated={setUser} />;
}

function AuthScreen({ onAuthenticated }: { onAuthenticated: (user: User) => void }) {
  const [identifier, setIdentifier] = useState("");
  const [code, setCode] = useState("");
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit() {
    setBusy(true);
    setError("");
    try {
      const endpoint = sent ? "/api/civicfix/auth/verify-otp" : "/api/civicfix/auth/send-otp";
      const body = sent ? { identifier, code } : { identifier };
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error ?? "Something went wrong.");
      } else if (sent) {
        onAuthenticated(data.user);
      } else {
        setSent(true);
      }
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setBusy(false);
    }
  }

  function handleKeyDown(event: React.KeyboardEvent) {
    if (event.key === "Enter" && !busy) submit();
  }

  return (
    <div className="auth-screen">
      <div className="auth-brand">
        <div className="brand-mark"><Icon name="shield_with_heart" /></div>
        <h1>CivicFix <span>Metro</span></h1>
      </div>
      <p>Report issues, follow repairs, and help your neighborhood thrive.</p>
      <label className="form-label">Email or phone number</label>
      <input
        className="auth-input"
        value={identifier}
        onChange={(event) => setIdentifier(event.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="you@example.com or +1 555..."
        disabled={sent}
      />
      {sent && (
        <>
          <label className="form-label">One-time code</label>
          <input
            className="auth-input"
            value={code}
            onChange={(event) => setCode(event.target.value)}
            onKeyDown={handleKeyDown}
            inputMode="numeric"
            maxLength={6}
            placeholder="Enter 6-digit code"
            autoFocus
          />
          <span className="dev-hint">Local development code: 123456</span>
        </>
      )}
      {error && <p className="form-error">{error}</p>}
      <button className="primary-button" onClick={submit} disabled={busy}>
        {busy ? "Please wait..." : sent ? "Verify & continue" : "Send one-time code"}
        <Icon name="arrow_forward" />
      </button>
    </div>
  );
}
