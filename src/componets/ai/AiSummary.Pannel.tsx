"use client";

import { useEffect } from "react";

import { useGenTaskStore } from "@/src/store/aiGenrateStore";

import { Sparkles, Brain, CheckCircle, Zap, Calendar } from "lucide-react";

const AiSummary = () => {
  const ai = useGenTaskStore((state) => state.ai);
  const isLoading = useGenTaskStore((state) => state.isLoading);
  const error = useGenTaskStore((state) => state.error);
  const generateSchedule = useGenTaskStore((state) => state.generateSchedule);
  const fetchTodaySchedule = useGenTaskStore((state) => state.fetchTodaySchedule);
  
  const aiUsage = useGenTaskStore((state) => state.aiUsage);
  const fetchAiUsage = useGenTaskStore((state) => state.fetchAiUsage);
  const dailySummary = useGenTaskStore((state) => state.dailySummary);
  const generateDailySummary = useGenTaskStore((state) => state.generateDailySummary);

  useEffect(() => {
    fetchTodaySchedule();
    fetchAiUsage();
  }, [fetchTodaySchedule, fetchAiUsage]);

  const productivityStyles = {
    LOW: "bg-rose-50 text-rose-700 border-rose-100",
    MEDIUM: "bg-amber-50 text-amber-700 border-amber-100",
    HIGH: "bg-emerald-50 text-emerald-700 border-emerald-100",
  };

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-8 space-y-8">
      
      {/* Header and Generate Banner */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-zinc-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-950 font-sans">
            AI Productivity Coach
          </h1>
          <p className="mt-1.5 text-sm text-zinc-500 max-w-2xl font-light">
            Plan your daily time blocks and request structured cognitive analysis using Llama-3.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {aiUsage && (
            <div className="hidden sm:flex flex-col items-end text-xs">
              <span className="text-zinc-500 font-medium">Daily Quota</span>
              <span className="font-semibold text-zinc-800">{aiUsage.used} / {aiUsage.limit} calls</span>
            </div>
          )}
          <button
            onClick={() => generateSchedule()}
            disabled={isLoading}
            className="rounded-xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white shadow-lg hover:bg-sky-500 hover:shadow-sky-500/10 transition disabled:bg-sky-400"
          >
            {isLoading ? "Generating..." : ai.length > 0 ? "Regenerate Timeline" : "Generate Timeline"}
          </button>
        </div>
      </div>

      {isLoading && (
        <div className="rounded-xl bg-sky-50/30 border border-sky-100 p-6 flex items-center justify-center gap-3 text-sky-800 text-sm font-semibold animate-pulse">
          <Sparkles className="animate-spin text-sky-600" size={18} /> Processing details with AI Coach...
        </div>
      )}

      {error && (
        <p className="rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600">
          {error}
        </p>
      )}

      {!isLoading && !error && ai.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-300 bg-white p-16 text-center shadow-sm">
          <div className="grid size-14 place-items-center rounded-full bg-sky-50 text-sky-600 shadow-inner">
            <Brain size={24} />
          </div>
          <h3 className="mt-5 text-xl font-bold text-zinc-900">No schedule generated yet</h3>
          <p className="mt-2.5 max-w-md text-sm text-zinc-500 leading-relaxed font-light">
            FocusAI needs to read your current active tasks to organize them chronologically and schedule optimal focus blocks.
          </p>
          <button
            onClick={() => generateSchedule()}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white shadow-md hover:bg-sky-500 hover:shadow-sky-500/10 transition"
          >
            <Sparkles size={16} /> Generate Daily Schedule
          </button>
        </div>
      )}

      {/* Grid Layout (Schedule blocks on left, AI Summary on right) */}
      {ai.length > 0 && (
        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          
          {/* Left Column: Schedule Blocks */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-zinc-800 flex items-center gap-2">
              <Calendar size={18} className="text-sky-600" /> Chronological Timeline
            </h2>
            <div className="grid gap-3">
              {ai.map((item, index) => (
                <article
                  key={`${item.start}-${item.end}-${item.taskTitle}-${index}`}
                  className="rounded-xl border border-zinc-200/80 bg-white p-5 shadow-sm hover:shadow-md transition duration-200"
                >
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-sky-600">
                        {item.start} - {item.end}
                      </p>
                      <h3 className="mt-1 text-base font-bold text-zinc-950">
                        {item.taskTitle}
                      </h3>
                    </div>
                    <span className="w-fit rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-semibold text-zinc-700">
                      {item.priority}
                    </span>
                  </div>

                  <p className="mt-3 text-sm leading-relaxed text-zinc-600 font-light">
                    {item.notes}
                  </p>
                  
                  <div className="mt-3.5 pt-3 border-t border-zinc-100 flex items-center gap-1.5 text-xs font-medium text-zinc-500">
                    <Zap size={14} className="text-amber-500" /> Energy required: <span className="font-semibold text-zinc-700">{item.energyRequired}</span>
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* Right Column: AI Productivity Coaching Review */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-zinc-800 flex items-center gap-2">
              <Brain size={18} className="text-sky-600" /> Performance Analysis
            </h2>
            
            <div className="rounded-xl border border-zinc-200/80 bg-white p-6 shadow-sm space-y-6">
              
              {/* Daily Quota Counter inside widget */}
              {aiUsage && (
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-semibold text-zinc-600">
                    <span>AI Call Quota Used</span>
                    <span>{aiUsage.used} / {aiUsage.limit} calls</span>
                  </div>
                  <div className="w-full bg-zinc-100 rounded-full h-1.5">
                    <div 
                      className="bg-sky-600 h-1.5 rounded-full transition-all duration-300"
                      style={{ width: `${(aiUsage.used / aiUsage.limit) * 100}%` }}
                    />
                  </div>
                </div>
              )}

              {dailySummary ? (
                <div className="space-y-5">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-medium text-zinc-500">Productivity Level:</span>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-3 py-0.5 rounded-full border ${productivityStyles[dailySummary.productivityLevel]}`}>
                      {dailySummary.productivityLevel}
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold text-zinc-800 flex items-center gap-1.5">
                      <CheckCircle size={15} className="text-sky-600" /> Coaching Evaluation
                    </h3>
                    <p className="text-xs text-zinc-600 leading-relaxed font-light bg-zinc-50 rounded-xl p-3 border border-zinc-100">
                      {dailySummary.summary}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold text-zinc-800 flex items-center gap-1.5">
                      <Sparkles size={15} className="text-amber-500" /> Suggestions for Tomorrow
                    </h3>
                    <p className="text-xs text-zinc-600 leading-relaxed font-light bg-amber-50/20 rounded-xl p-3 border border-amber-100/50">
                      {dailySummary.suggestion}
                    </p>
                  </div>

                  <button
                    onClick={() => generateDailySummary()}
                    disabled={isLoading}
                    className="w-full rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 py-3 text-xs font-semibold shadow-sm transition"
                  >
                    Refresh Coach Review
                  </button>
                </div>
              ) : (
                <div className="text-center py-6 space-y-4">
                  <p className="text-xs text-zinc-500 leading-relaxed font-light">
                    Generate an analysis of your schedule, priorities, and performance limits to get structured feedback from FocusAI.
                  </p>
                  <button
                    onClick={() => generateDailySummary()}
                    disabled={isLoading}
                    className="inline-flex items-center gap-2 rounded-xl bg-zinc-950 hover:bg-zinc-900 px-4 py-3 text-xs font-semibold text-white shadow-sm transition"
                  >
                    <Sparkles size={14} /> Analyze My Schedule
                  </button>
                </div>
              )}

            </div>
          </div>

        </div>
      )}
    </section>
  );
};

export default AiSummary;
