// components/Column.jsx (partial update)
"use client";
import TaskCard from "./TaskCard";
import TaskForm from "./TaskForm";
import { useState } from "react";

export default function Column({ column, color, onTaskClick, columns }) {
  const [showForm, setShowForm] = useState(false);

  // Add this function
  const handleTaskAdded = () => {
    setShowForm(false);
    // Optionally refresh tasks
  };

  return (
    <div className="flex flex-col w-72 flex-shrink-0">
      {/* Column header */}
      <div className="flex items-center mb-6">
        <div 
          className="w-4 h-4 rounded-full mr-3" 
          style={{ backgroundColor: color }}
        ></div>
        <h2 className="font-bold text-gray-400 tracking-widest text-sm">
          {column.name} ({column.tasks.length})
        </h2>
      </div>

      {/* Task list */}
      <div className="space-y-5 flex-grow">
        {column.tasks.map(task => (
          <TaskCard 
            key={task.id} 
            task={task} 
            onClick={onTaskClick} 
          />
        ))}
      </div>

      {/* Add task button */}
      <button 
        onClick={() => setShowForm(true)}
        className="mt-5 text-gray-500 hover:text-indigo-400 font-bold py-3 rounded-lg"
      >
        + New Task
      </button>

      {/* Task form */}
      {showForm && (
        <TaskForm 
          onClose={() => setShowForm(false)}
          onSubmit={handleTaskAdded}
          columnId={column.id}
          columns={columns} // Pass columns to TaskForm
        />
      )}
    </div>
  );
}