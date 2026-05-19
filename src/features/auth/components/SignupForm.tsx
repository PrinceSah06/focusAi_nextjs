import type { FormEvent } from "react";

import type { SignupFormData } from "../types";

type SignupFormProps = {
  formData: SignupFormData;
  isLoading: boolean;
  onChange: (formData: SignupFormData) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export function SignupForm({
  formData,
  isLoading,
  onChange,
  onSubmit,
}: SignupFormProps) {
  return (
    <form
      onSubmit={onSubmit}
      className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
    >
      <h2 className="text-xl font-semibold">Sign up</h2>
      <p className="mt-1 text-sm text-slate-500">Create a new account.</p>

      <label className="mt-5 block text-sm font-medium text-slate-700">
        Name
      </label>
      <input
        type="text"
        value={formData.name}
        onChange={(event) => onChange({ ...formData, name: event.target.value })}
        className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
        placeholder="Vishal Sah"
        required
      />

      <label className="mt-4 block text-sm font-medium text-slate-700">
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
        placeholder="Minimum 6 characters"
        required
      />

      <button
        type="submit"
        disabled={isLoading}
        className="mt-6 w-full rounded-md bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-slate-400"
      >
        {isLoading ? "Please wait..." : "Create account"}
      </button>
    </form>
  );
}
