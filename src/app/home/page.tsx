import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";

import Nav from "@/src/componets/layout/Nav";
import { verifyAccessToken } from "@/src/utils/token.utils";

export default async function HomePage() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    redirect("/");
  }

  let userEmail = "";

  try {
    const payload = verifyAccessToken(accessToken);
    userEmail = payload.email;
  } catch {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-950">
      <Nav />
      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
            <p className="text-sm font-medium text-sky-600">FocusAI</p>
            <h1 className="mt-3 max-w-2xl text-3xl font-semibold tracking-normal text-zinc-950 sm:text-4xl">
              Welcome back to your productivity space
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-zinc-600 sm:text-base">
              You are logged in as{" "}
              <span className="font-semibold text-zinc-950">{userEmail}</span>.
              Start by planning your next task or reviewing what is already on
              your list.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/tasks"
                className="rounded-md bg-sky-600 px-4 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-sky-700"
              >
                Open tasks
              </Link>
              <Link
                href="/"
                className="rounded-md border border-zinc-300 px-4 py-2.5 text-center text-sm font-semibold text-zinc-700 transition hover:bg-zinc-100"
              >
                Auth page
              </Link>
            </div>
          </div>

          <aside className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            <div className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
              <p className="text-sm font-medium text-zinc-500">Today</p>
              <h2 className="mt-2 text-xl font-semibold text-zinc-950">
                Plan with detail
              </h2>
              <p className="mt-2 text-sm leading-6 text-zinc-600">
                Add description, deadline, priority, energy, and estimate so
                each task is clear before you begin.
              </p>
            </div>

            <div className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
              <p className="text-sm font-medium text-zinc-500">Navigation</p>
              <div className="mt-4 grid gap-2">
                <Link
                  href="/home"
                  className="rounded-md bg-zinc-100 px-3 py-2 text-sm font-medium text-zinc-800 transition hover:bg-zinc-200"
                >
                  Home
                </Link>
                <Link
                  href="/tasks"
                  className="rounded-md bg-zinc-100 px-3 py-2 text-sm font-medium text-zinc-800 transition hover:bg-zinc-200"
                >
                  Tasks
                </Link>
              </div>
            </div>
          </aside>
        </section>

        <section className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-sky-600">Capture</p>
            <p className="mt-2 text-sm text-zinc-600">
              Write every task with the context you need later.
            </p>
          </div>
          <div className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-amber-600">Prioritize</p>
            <p className="mt-2 text-sm text-zinc-600">
              Mark what matters most before the day gets crowded.
            </p>
          </div>
          <div className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-emerald-600">Complete</p>
            <p className="mt-2 text-sm text-zinc-600">
              Track progress and keep your active list focused.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
