// TaskView.jsx
"use client";
import { useState, useEffect } from 'react';
import { MoreVertical } from 'lucide-react';
import { taskApi, subtaskApi } from '../utils/api';
import TaskForm from './TaskForm';

export default function TaskView({ task, onClose, onUpdateSubtask, columns }) {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState(task);
  const [isEditing, setIsEditing] = useState(false);
  
  // Compute status from column ID
    const status = columns.find(c => c.id === currentTask.column_id)?.name || 'Todo';

  useEffect(() => {
    setCurrentTask(task);
  }, [task]);

  const completedSubtasks = currentTask.subtasks?.filter(st => st.is_completed).length || 0;
  const totalSubtasks = currentTask.subtasks?.length || 0;

  const handleSubtaskToggle = async (subtaskId, isCompleted) => {
    try {
      // Update subtask individually
      await subtaskApi.update(subtaskId, { is_completed: isCompleted });
      
      setCurrentTask(prev => ({
        ...prev,
        subtasks: prev.subtasks.map(st => 
          st.id === subtaskId ? { ...st, is_completed: isCompleted } : st
        )
      }));
      
      if (onUpdateSubtask) onUpdateSubtask(subtaskId, isCompleted);
    } catch (error) {
      console.error("Error updating subtask:", error);
    }
  };

  const handleStatusChange = async (newColumnId) => {
    try {
      const column = columns.find(c => c.id === parseInt(newColumnId));
      
      const updatedTask = await taskApi.update(currentTask.id, { 
        ...currentTask,
        column_id: newColumnId,
        status: column?.name || 'Todo'
      });
      
      setCurrentTask(prev => ({ ...prev, ...updatedTask }));
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  const handleDeleteTask = async () => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    
    try {
      await taskApi.delete(currentTask.id);
      onClose(true); // Indicate task was deleted
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleTaskUpdated = (updatedTask) => {
    setCurrentTask(updatedTask);
    setIsEditing(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40" onClick={onClose}>
      {isEditing ? (
        <TaskForm 
          onClose={() => setIsEditing(false)}
          onSubmit={handleTaskUpdated}
          task={currentTask}
          columns={columns}
        />
      ) : (
        <div className="bg-[#2B2C37] p-8 rounded-lg w-full max-w-lg z-50" onClick={(e) => e.stopPropagation()}>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">{currentTask.title}</h2>
            <div className="relative">
              <button onClick={() => setMenuOpen(p => !p)} className="text-gray-400 hover:text-white">
                <MoreVertical />
              </button>
              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-[#20212c] rounded-lg shadow-lg z-20">
                  <button 
                    className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                    onClick={() => setIsEditing(true)}
                  >
                    Edit Task
                  </button>
                  <button 
                    className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700"
                    onClick={handleDeleteTask}
                  >
                    Delete Task
                  </button>
                </div>
              )}
            </div>
          </div>

          <p className="text-gray-400 mb-6">{currentTask.description}</p>
          
          {totalSubtasks > 0 && (
            <div className="mb-4">
              <label className="text-sm font-semibold text-gray-400">
                Subtasks ({completedSubtasks} of {totalSubtasks})
              </label>
              <div className="space-y-2 mt-2">
                {currentTask.subtasks.map((subtask, index) => (
                  <div key={index} className="flex items-center bg-[#20212c] p-3 rounded hover:bg-indigo-500/25">
                    <input 
                      type="checkbox"
                      checked={subtask.is_completed}
                      onChange={(e) => handleSubtaskToggle(subtask.id, e.target.checked)}
                      className="w-4 h-4 mr-4 bg-gray-600 border-gray-500 rounded accent-indigo-500" 
                    />
                    <span className={`font-semibold ${subtask.is_completed ? 'line-through text-gray-500' : ''}`}>
                      {subtask.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="text-sm font-semibold text-gray-400">Current Status</label>
            <select 
              value={currentTask.column_id}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="w-full p-3 mt-2 rounded bg-[#2B2C37] border border-gray-600"
            >
              {columns.map(column => (
                <option key={column.id} value={column.id}>{column.name}</option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
}