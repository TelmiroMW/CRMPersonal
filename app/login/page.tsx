"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError("Email o contraseña incorrectos.");
      return;
    }
    router.replace("/");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-6">
      <form
        onSubmit={handleSubmit}
        className="glass w-full max-w-sm rounded-card p-8 shadow-glass"
      >
        <div className="mb-1 text-2xl font-extrabold tracking-tight">Hola de nuevo</div>
        <div className="mb-6 text-sm text-ink-2">Entra con tu cuenta de administrador</div>

        <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-ink-2">
          Email
        </label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-4 w-full rounded-xl border border-border bg-white/70 px-3.5 py-2.5 text-[15px] outline-none focus:border-accent"
          placeholder="tu@email.com"
        />

        <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-ink-2">
          Contraseña
        </label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-5 w-full rounded-xl border border-border bg-white/70 px-3.5 py-2.5 text-[15px] outline-none focus:border-accent"
          placeholder="••••••••"
        />

        {error && <div className="mb-4 text-sm font-medium text-urgent">{error}</div>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-ink py-3 text-[14px] font-semibold text-white transition active:scale-[0.985] disabled:opacity-60"
        >
          {loading ? "Entrando…" : "Entrar"}
        </button>
      </form>
    </div>
  );
}
