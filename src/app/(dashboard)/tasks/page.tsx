"use client"
import Nav from "../../../componets/layout/Nav"
import TaskList from "../../../componets/tasks/TaskList"
import TaskForm from "../../../componets/tasks/TaskForm"

const page = () => {
  return (
    <div className="min-h-screen bg-zinc-50">
      <Nav />
      <main className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-6 sm:px-6 lg:grid-cols-[minmax(0,1fr)_420px] lg:px-8">
        <div className="min-w-0 lg:order-1">
          <TaskList/>
        </div>
        <aside className="min-w-0 lg:order-2 lg:sticky lg:top-24 lg:self-start">
          <TaskForm />
        </aside>
      </main>
    </div>
  )
}

export default page
