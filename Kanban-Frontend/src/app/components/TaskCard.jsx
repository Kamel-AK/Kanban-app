// components/TaskCard.jsx
"use client";

export default function TaskCard({ task, onClick }) {
  // Calculate subtask completion
  const completed = task.subtasks.filter(st => st.is_completed).length;
  const total = task.subtasks.length;
  const subtasksText = total > 0 ? `${completed} of ${total} subtasks` : "No subtasks";

  return (
    <div 
      className="bg-[#2B2C37] p-6 rounded-lg shadow-lg cursor-pointer group" 
      onClick={() => onClick(task)}
    >
      <h3 className="font-bold mb-2 group-hover:text-indigo-400">{task.title}</h3>
      <p className="text-gray-400 text-sm font-semibold">{subtasksText}</p>
    </div>
  );
}