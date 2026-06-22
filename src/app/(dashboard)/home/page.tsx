"use client";

import { useEffect } from "react";
import Link from "next/link";
import { 
  ClipboardList, 
  CheckCircle2, 
  Sparkles, 
  TrendingUp, 
  BookOpen, 
  PlusCircle, 
  Calendar, 
  Zap, 
  ArrowRight 
} from "lucide-react";

import { useAuthStore } from "@/src/store/authStore";
import { useTaskStore } from "@/src/store/taskStore";
import { useGenTaskStore } from "@/src/store/aiGenrateStore";

export default function HomePage() {
  const user = useAuthStore((state) => state.user);
  const fetchMe = useAuthStore((state) => state.fetchMe);
  const authLoading = useAuthStore((state) => state.isLoading);
  
  const tasks = useTaskStore((state) => state.tasks);
  const fetchTasks = useTaskStore((state) => state.fetchTasks);
  const taskStats = useTaskStore((state) => state.stats);
  const taskLoading = useTaskStore((state) => state.isLoading);

  const ai = useGenTaskStore((state) => state.ai);
  const fetchTodaySchedule = useGenTaskStore((state) => state.fetchTodaySchedule);
  const generateSchedule = useGenTaskStore((state) => state.generateSchedule);
  const aiLoading = useGenTaskStore((state) => state.isLoading);

  useEffect(() => {
    fetchMe();
    fetchTasks();
    fetchTodaySchedule();
  }, [fetchMe, fetchTasks, fetchTodaySchedule]);

  const isLoading = authLoading || taskLoading || aiLoading || !user;

  if (isLoading) {
    return (
      <div className="space-y-8 animate-pulse pr-2">
        {/* Banner Skeleton */}
        <div className="h-44 sm:h-52 bg-zinc-200/80 rounded-2xl w-full" />
        
        {/* Stats Grid Skeleton */}
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          <div className="h-28 bg-zinc-200/80 rounded-xl" />
          <div className="h-28 bg-zinc-200/80 rounded-xl" />
          <div className="h-28 bg-zinc-200/80 rounded-xl" />
          <div className="h-28 bg-zinc-200/80 rounded-xl" />
        </div>
        
        {/* Guide Skeleton */}
        <div className="h-48 bg-zinc-200/80 rounded-2xl w-full" />

        {/* Dashboard split skeleton */}
        <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
          <div className="h-64 bg-zinc-200/80 rounded-2xl" />
          <div className="h-64 bg-zinc-200/80 rounded-2xl" />
        </div>
      </div>
    );
  }

  const userName = user?.name || "Productive User";
  const userEmail = user?.email || "";

  // Dynamic calculations from stores
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === "COMPLETED").length;
  const pendingTasks = tasks.filter((t) => t.status !== "COMPLETED").length;
  
  const completionRate = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  // Top 3 active tasks
  const activeTasksPreview = tasks
    .filter((t) => t.status !== "COMPLETED")
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-zinc-50/50 text-zinc-900 font-sans pb-12">
      
      <main className="mx-auto w-full max-w-7xl space-y-8">
        
        {/* Welcome Hero Banner */}
        <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-sky-950 p-6 sm:p-10 text-white shadow-xl border border-slate-800">
          <div className="absolute right-0 top-0 -mr-20 -mt-20 size-80 rounded-full bg-sky-500/10 blur-3xl" />
          <div className="absolute left-1/3 bottom-0 -mb-20 size-80 rounded-full bg-emerald-500/5 blur-3xl" />
          
          <div className="relative z-10 space-y-4 max-w-3xl">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-500/20 px-3 py-1 text-xs font-semibold text-sky-300 border border-sky-500/30">
              <Sparkles size={13} className="animate-pulse" /> FocusAI Active Space
            </span>
            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white">
              Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-emerald-400">{userName}</span>
            </h1>
            <p className="text-sm sm:text-lg text-slate-300 leading-relaxed max-w-2xl font-light">
              Your AI productivity coach is ready. Check your metrics below or generate an optimized, energy-balanced chronological daily plan.
            </p>
            
            <div className="pt-4 flex flex-wrap gap-3">
              <Link
                href="/tasks"
                className="inline-flex items-center gap-2 rounded-xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white shadow-lg hover:bg-sky-500 hover:shadow-sky-500/20 transition-all duration-200"
              >
                Go to Tasks <ArrowRight size={16} />
              </Link>
              <Link
                href="/schedule"
                className="inline-flex items-center gap-2 rounded-xl bg-slate-800 border border-slate-700/80 px-5 py-3 text-sm font-semibold text-slate-200 hover:bg-slate-700 hover:text-white transition-all duration-200"
              >
                <Calendar size={16} /> View Schedule
              </Link>
            </div>
          </div>
        </section>

        {/* Dynamic Metrics Overview */}
        <section className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          
          <div className="rounded-xl border border-zinc-200/80 bg-white p-5 shadow-sm hover:shadow-md transition duration-200">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-zinc-500">Tasks Pending</p>
              <span className="grid size-9 place-items-center rounded-lg bg-sky-50 text-sky-600">
                <ClipboardList size={18} />
              </span>
            </div>
            <p className="mt-2 text-3xl font-bold text-zinc-900">{pendingTasks}</p>
            <p className="mt-1.5 text-xs text-sky-600 font-medium">Active work units</p>
          </div>

          <div className="rounded-xl border border-zinc-200/80 bg-white p-5 shadow-sm hover:shadow-md transition duration-200">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-zinc-500">Completed Tasks</p>
              <span className="grid size-9 place-items-center rounded-lg bg-emerald-50 text-emerald-600">
                <CheckCircle2 size={18} />
              </span>
            </div>
            <p className="mt-2 text-3xl font-bold text-zinc-900">{completedTasks}</p>
            <p className="mt-1.5 text-xs text-emerald-600 font-medium">Out of {totalTasks} total tasks</p>
          </div>

          <div className="rounded-xl border border-zinc-200/80 bg-white p-5 shadow-sm hover:shadow-md transition duration-200">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-zinc-500">Completion Rate</p>
              <span className="grid size-9 place-items-center rounded-lg bg-indigo-50 text-indigo-600">
                <TrendingUp size={18} />
              </span>
            </div>
            <p className="mt-2 text-3xl font-bold text-zinc-900">{completionRate}%</p>
            <div className="mt-2 w-full bg-zinc-100 rounded-full h-1.5">
              <div 
                className="bg-indigo-600 h-1.5 rounded-full transition-all duration-500" 
                style={{ width: `${completionRate}%` }}
              />
            </div>
          </div>

          <div className="rounded-xl border border-zinc-200/80 bg-white p-5 shadow-sm hover:shadow-md transition duration-200">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-zinc-500">AI Time Blocks</p>
              <span className="grid size-9 place-items-center rounded-lg bg-amber-50 text-amber-600">
                <Zap size={18} />
              </span>
            </div>
            <p className="mt-2 text-3xl font-bold text-zinc-900">{ai.length}</p>
            <p className="mt-1.5 text-xs text-amber-600 font-medium">Scheduled for today</p>
          </div>

        </section>

        {/* Workflow & User Guide Section */}
        <section className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-sm space-y-6">
          <div className="flex items-center gap-2">
            <span className="grid size-8 place-items-center rounded-lg bg-zinc-100 text-zinc-700">
              <BookOpen size={16} />
            </span>
            <div>
              <h2 className="text-lg font-semibold text-zinc-900">How FocusAI Works</h2>
              <p className="text-xs text-zinc-500">Follow these steps to experience optimal productivity flow.</p>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            <div className="relative rounded-xl border border-zinc-100 bg-zinc-50/50 p-4 space-y-2">
              <span className="absolute -top-3 -left-3 grid size-7 place-items-center rounded-full bg-zinc-900 text-xs font-bold text-white shadow-md">1</span>
              <h3 className="font-semibold text-zinc-800 pt-1">Capture Your Tasks</h3>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Add your tasks in the <strong>Tasks Panel</strong>. Fill in descriptions, estimated durations, and priority levels.
              </p>
            </div>

            <div className="relative rounded-xl border border-zinc-100 bg-zinc-50/50 p-4 space-y-2">
              <span className="absolute -top-3 -left-3 grid size-7 place-items-center rounded-full bg-sky-600 text-xs font-bold text-white shadow-md">2</span>
              <h3 className="font-semibold text-zinc-800 pt-1">Assess Energy Level</h3>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Assign an energy required rating (1-5) to each task. This helps the AI structure heavy cognitive work when you are most focused.
              </p>
            </div>

            <div className="relative rounded-xl border border-zinc-100 bg-zinc-50/50 p-4 space-y-2">
              <span className="absolute -top-3 -left-3 grid size-7 place-items-center rounded-full bg-emerald-600 text-xs font-bold text-white shadow-md">3</span>
              <h3 className="font-semibold text-zinc-800 pt-1">Generate AI Schedule</h3>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Head to the <strong>Schedule Page</strong> and click Generate. Our Llama model will lay out your tasks chronologically with integrated breaks.
              </p>
            </div>
          </div>
        </section>

        {/* Dashboard Focus Blocks Grid */}
        <section className="grid gap-6 lg:grid-cols-[1fr_380px]">
          
          {/* Active Tasks Preview */}
          <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h2 className="text-lg font-semibold text-zinc-900">Current Focus List</h2>
              <Link href="/tasks" className="text-xs text-sky-600 hover:text-sky-700 font-semibold flex items-center gap-1 transition">
                Manage all <ArrowRight size={13} />
              </Link>
            </div>

            {activeTasksPreview.length === 0 ? (
              <div className="py-10 text-center space-y-2">
                <p className="text-sm font-medium text-zinc-500">All tasks completed or none created!</p>
                <Link href="/tasks" className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-600 hover:underline">
                  <PlusCircle size={14} /> Create a new task
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-zinc-100">
                {activeTasksPreview.map((task) => (
                  <div key={task.id} className="py-3 flex items-center justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-zinc-900 truncate text-sm">{task.title}</p>
                      {task.description && (
                        <p className="text-xs text-zinc-500 truncate mt-0.5">{task.description}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                        task.priority === "HIGH" 
                          ? "bg-rose-50 text-rose-600 border border-rose-100" 
                          : task.priority === "MEDIUM"
                          ? "bg-amber-50 text-amber-600 border border-amber-100"
                          : "bg-emerald-50 text-emerald-600 border border-emerald-100"
                      }`}>
                        {task.priority}
                      </span>
                      {task.estimatedMinutes && (
                        <span className="text-xs text-zinc-400 font-medium">{task.estimatedMinutes}m</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* AI Schedule Summary */}
          <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h2 className="text-lg font-semibold text-zinc-900">{`Today's Schedule`}</h2>
              <Link href="/schedule" className="text-xs text-sky-600 hover:text-sky-700 font-semibold flex items-center gap-1 transition">
                Timeline <ArrowRight size={13} />
              </Link>
            </div>

            {ai && ai.length > 0 ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between bg-sky-50/50 rounded-xl p-3 border border-sky-100/50">
                  <div className="flex items-center gap-2">
                    <Sparkles size={16} className="text-sky-600" />
                    <span className="text-xs font-semibold text-sky-800">Plan Status</span>
                  </div>
                  <span className="text-xs font-semibold bg-sky-600 text-white rounded-full px-2.5 py-0.5">Active</span>
                </div>
                
                <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                  {ai.slice(0, 3).map((block, index) => (
                    <div key={index} className="flex gap-3 text-xs">
                      <span className="text-sky-600 font-semibold shrink-0 w-11 mt-0.5">{block.start}</span>
                      <div className="min-w-0">
                        <p className="font-semibold text-zinc-800 truncate">{block.taskTitle}</p>
                        <p className="text-zinc-500 truncate text-[11px] mt-0.5">{block.notes || "Time block task"}</p>
                      </div>
                    </div>
                  ))}
                  {ai.length > 3 && (
                    <p className="text-[10px] text-center text-zinc-400 font-medium pt-1">
                      + {ai.length - 3} more schedule blocks
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div className="py-8 text-center space-y-3">
                <p className="text-sm font-medium text-zinc-500">No schedule created for today.</p>
                <Link 
                  href="/schedule" 
                  className="inline-flex items-center gap-1.5 rounded-lg bg-sky-50 hover:bg-sky-100 border border-sky-100 text-sky-700 px-4 py-2 text-xs font-semibold transition"
                >
                  Generate Timeline
                </Link>
              </div>
            )}
          </div>

        </section>

      </main>
    </div>
  );
}
