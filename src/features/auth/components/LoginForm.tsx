import type { FormEvent } from "react";

import type { LoginFormData } from "../types";

type LoginFormProps = {
  formData: LoginFormData;
  isLoading: boolean;
  onChange: (formData: LoginFormData) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export function LoginForm({
  formData,
  isLoading,
  onChange,
  onSubmit,
}: LoginFormProps) {
  return (
    <form
      onSubmit={onSubmit}
      className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
    >
      <h2 className="text-xl font-semibold">Login</h2>
      <p className="mt-1 text-sm text-slate-500">
        Access your existing account.
      </p>

      <label className="mt-5 block text-sm font-medium text-slate-700">
        Email
      </label>
      <input
        type="email"
        value={formData.email}
        onChange={(event) =>
          onChange({ ...formData, email: event.target.value })
        }
        className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
        placeholder="you@example.com"
        required
      />

      <label className="mt-4 block text-sm font-medium text-slate-700">
        Password
      </label>
      <input
        type="password"
        value={formData.password}
        onChange={(event) =>
          onChange({ ...formData, password: event.target.value })
        }
        className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
        placeholder="Your password"
        required
      />

      <button
        type="submit"
        disabled={isLoading}
        className="mt-6 w-full rounded-md bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
      >
        {isLoading ? "Please wait..." : "Login"}
      </button>
    </form>
  );
}
