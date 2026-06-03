"use client";

import { useEffect } from "react";

import { useGenTaskStore } from "@/src/store/aiGenrateStore";

const AiSummary = () => {
  const ai = useGenTaskStore((state) => state.ai);
  const isLoading = useGenTaskStore((state) => state.isLoading);
  const error = useGenTaskStore((state) => state.error);
  const generateSchedule = useGenTaskStore((state) => state.generateSchedule);

  useEffect(() => {
    generateSchedule();
  }, [generateSchedule]);

  return (
    <section className="mx-auto w-full max-w-4xl px-4 py-6">
      <h1 className="text-2xl font-semibold text-zinc-950">
        Generated schedule
      </h1>

      {isLoading && (
        <p className="mt-4 text-sm text-zinc-600">Generating schedule...</p>
      )}

      {error && (
        <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
          {error}
        </p>
      )}

      {!isLoading && !error && ai.length === 0 && (
        <p className="mt-4 text-sm text-zinc-600">
          No generated schedule yet.
        </p>
      )}

      <div className="mt-5 grid gap-3">
        {ai.map((item, index) => (
          <article
            key={`${item.start}-${item.end}-${item.taskTitle}-${index}`}
            className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm"
          >
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm font-medium text-sky-700">
                  {item.start} - {item.end}
                </p>
                <h2 className="mt-1 text-base font-semibold text-zinc-950">
                  {item.taskTitle}
                </h2>
              </div>
              <span className="w-fit rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-semibold text-zinc-700">
                {item.priority}
              </span>
            </div>

            <p className="mt-3 text-sm leading-6 text-zinc-600">
              {item.notes}
            </p>
            <p className="mt-2 text-xs font-medium text-zinc-500">
              Energy required: {item.energyRequired}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
};

export default AiSummary;
