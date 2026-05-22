import { cookies } from "next/headers";
import { redirect } from "next/navigation";

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
    <main className="min-h-screen bg-slate-100 px-4 py-8 text-slate-950 sm:px-6 lg:px-8">
      <section className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-4xl flex-col justify-center">
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
            FocusAI
          </p>
          <h1 className="mt-3 text-3xl font-bold">Welcome home</h1>
          <p className="mt-3 text-slate-600">
            You are logged in as <span className="font-semibold">{userEmail}</span>.
          </p>
        </div>
      </section>
    </main>
  );
}
