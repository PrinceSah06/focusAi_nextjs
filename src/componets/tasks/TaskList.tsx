"use client";

import React from 'react'
import {useTaskStore} from "../../store/taskStore"
import {useAuthStore} from "../../store/authStore"
import {useState,useEffect} from 'react'
import { Fascinate } from 'next/font/google';
import { tr } from 'zod/v4/locales/index.js';


export default function TaskList() {
  const [newTaskTitle, setNewTaskTitle] = useState("");

  const [isMounted,setIsMounted]=useState<boolean>(false)
  // 1. Subscribe to Auth Store to ensure user is logged in
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);

  // 2. Subscribe to Task Store pieces
  const tasks = useTaskStore((state) => state.tasks);
  const isLoading = useTaskStore((state) => state.isLoading);
  const error = useTaskStore((state) => state.error);
  const fetchTasks = useTaskStore((state) => state.fetchTasks);
  const addTask = useTaskStore((state) => state.addTask);

  // 3. Automatically fetch tasks when the user is authenticated
  useEffect(() => {
     setIsMounted(true)
  }, []);



    useEffect(()=>{
     if ( isMounted && token) {
      fetchTasks();
    }
  },[token,fetchTasks])

  if (!isMounted) {
    return <div className="p-4">Loading application layout...</div>;
  }

  // Handle protected route view (Safely runs only on the browser now)
  if (!token) {
    return <div className="p-4">Please log in to view your tasks.</div>;
  }



 
  // Handle protected route view
  if (!token) {
    return <div className="p-4">Please log in to view your tasks.</div>;
  }

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    await addTask({ title: newTaskTitle });
    setNewTaskTitle(""); // Reset input
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Welcome, {user?.name || "User"}</h1>

      {/* Add Task Form */}
      <form onSubmit={handleCreateTask} className="flex gap-2 mb-4">
        <input
          type="text"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          placeholder="Add a new task..."
          className="border p-2 grow rounded"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Add
        </button>
      </form>

      {/* State Indicators */}
      {isLoading && <p className="text-gray-500">Loading tasks...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* Task List */}
      <ul className="space-y-2">
        {tasks.map((task) => (
          <li key={task.id} className="p-3 bg-gray-100 rounded flex justify-between">
            <span>{task.title}</span>
          
          </li>
        ))}
        {!isLoading && tasks.length === 0 && (
          <p className="text-gray-400 text-center">No tasks found. Create one!</p>
        )}
      </ul>
    </div>
  );
}
