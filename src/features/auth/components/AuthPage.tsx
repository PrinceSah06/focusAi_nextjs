"use client";

import { type FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { useAuthStore } from "@/src/store/authStore";

import { signupUser } from "../api/authApi";
import type { LoginFormData, Message, SignupFormData } from "../types";
import { LoginForm } from "./LoginForm";
import { MessageAlert } from "./MessageAlert";
import { SignupForm } from "./SignupForm";

const emptySignupForm: SignupFormData = {
  name: "",
  email: "",
  password: "",
};

const emptyLoginForm: LoginFormData = {
  email: "",
  password: "",
};

export function AuthPage() {
  const router = useRouter();
  const { login, isLoading: isLoginLoading } = useAuthStore();
  const [signupForm, setSignupForm] = useState(emptySignupForm);
  const [loginForm, setLoginForm] = useState(emptyLoginForm);
  const [message, setMessage] = useState<Message | null>(null);
  const [isSignupLoading, setIsSignupLoading] = useState(false);

  const handleSignup = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSignupLoading(true);
    setMessage(null);

    try {
      await signupUser(signupForm);

      setMessage({
        type: "success",
        text: "Account created successfully. You can login now.",
      });
      setSignupForm(emptySignupForm);
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Something went wrong",
      });
    } finally {
      setIsSignupLoading(false);
    }
  };

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(null);

    try {
      const user = await login(loginForm);

      setMessage({
        type: "success",
        text: `Welcome back, ${user.name}.`,
      });
      setLoginForm(emptyLoginForm);
      router.push("/home");
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Something went wrong",
      });
    }
  };

return (
  <main className="min-h-screen bg-slate-100 px-4 py-8">
    <section className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl flex-col gap-10 lg:flex-row lg:items-center">
      
      {/* Left Side */}
      <div className="w-full lg:w-1/2">
        <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-emerald-600">
          FocusAI
        </p>

        <h1 className="text-4xl font-bold leading-tight sm:text-5xl">
          Plan Smarter. Work Better.
        </h1>

        <p className="mt-5 max-w-xl text-lg text-slate-600">
          Organize your tasks, generate AI-powered schedules,
          and stay productive throughout the day.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border bg-white p-5 shadow-sm">
            <h3 className="font-semibold text-slate-900">
              Demo Account
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Anyone can explore FocusAI using the demo account.
            </p>

            <div className="mt-4 rounded-lg bg-slate-100 p-3 text-sm">
              <p>
                <span className="font-medium">Email:</span>{" "}
                demo@focusai.com
              </p>

              <p>
                <span className="font-medium">Password:</span>{" "}
                Demo123@
              </p>
            </div>
          </div>

          <div className="rounded-xl border bg-white p-5 shadow-sm">
            <h3 className="font-semibold text-slate-900">
              Features
            </h3>

            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              <li>✓ Task Management</li>
              <li>✓ AI Schedule Generation</li>
              <li>✓ Productivity Analytics</li>
              <li>✓ Smart Prioritization</li>
            </ul>
          </div>
        </div>

        {message && (
          <div className="mt-6">
            <MessageAlert message={message} />
          </div>
        )}
      </div>

      {/* Right Side */}
      <div className="w-full lg:w-1/2">
        <div className="grid gap-5 xl:grid-cols-2">
          <SignupForm
            formData={signupForm}
            isLoading={isSignupLoading}
            onChange={setSignupForm}
            onSubmit={handleSignup}
          />

          <LoginForm
            formData={loginForm}
            isLoading={isLoginLoading}
            onChange={setLoginForm}
            onSubmit={handleLogin}
          />
        </div>
      </div>
    </section>
  </main>
);
}
