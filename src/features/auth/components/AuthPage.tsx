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
    <main className="min-h-screen bg-slate-100 px-4 py-8 text-slate-950 sm:px-6 lg:px-8">
      <section className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-6xl flex-col justify-center gap-8 lg:flex-row lg:items-center">
        <div className="w-full lg:w-1/2">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-emerald-700">
            FocusAI Auth
          </p>
          <h1 className="max-w-xl text-4xl font-bold leading-tight sm:text-5xl">
            Simple signup and login for your productivity app.
          </h1>
          <p className="mt-5 max-w-lg text-base leading-7 text-slate-600">
            Create your account, login, and receive secure cookies from your
            backend auth API. The page uses basic React state and Tailwind only.
          </p>

          {message && <MessageAlert message={message} />}
        </div>

        <div className="grid w-full gap-5 md:grid-cols-2 lg:w-1/2 lg:grid-cols-1 xl:grid-cols-2">
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
      </section>
    </main>
  );
}
