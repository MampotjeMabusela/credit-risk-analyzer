// Simple login page using Supabase auth (placeholder).

import React from "react";

export default function Login() {
  return (
    <main className="container">
      <h1>Login</h1>
      <p>Connect via Supabase Auth (to be implemented).</p>
      <form className="card">
        <label>
          Email
          <input type="email" placeholder="you@example.com" />
        </label>
        <label>
          Password
          <input type="password" placeholder="••••••••" />
        </label>
        <button type="submit">Sign in</button>
      </form>
    </main>
  );
}

