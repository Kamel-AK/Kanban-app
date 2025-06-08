// TaskForm.jsx
"use client";
import { useState, useEffect } from 'react';
import { taskApi } from '../utils/api';

export default function TaskForm({ onClose, onSubmit, task, columnId, columns }) {
  const isEditMode = !!task;
  
  // Initialize state with task data if in edit mode
  const [title, setTitle] = useState(isEditMode ? task.title : '');
  const [description, setDescription] = useState(
  isEditMode ? (task.description || '') : ''
);
  const [subtasks, setSubtasks] = useState(
    isEditMode 
      ? task.subtasks.map(st => ({ value: st.title, id: st.id, error: false })) 
      : [{ value: '', error: false }]
  );
  const [selectedColumnId, setSelectedColumnId] = useState(
    isEditMode ? task.column_id : columnId
  );

  const handleSubtaskChange = (index, value) => {
    const newSubtasks = [...subtasks];
    newSubtasks[index].value = value;
    newSubtasks[index].error = false;
    setSubtasks(newSubtasks);
  };
  
  const addSubtask = () => {
    setSubtasks([...subtasks, { value: '', error: false }]);
  };

  const removeSubtask = (index) => {
    setSubtasks(subtasks.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let isValid = true;
    
    // Validate title
    if (!title.trim()) {
      isValid = false;
    }
    
    // Validate subtasks
    const newSubtasks = [...subtasks];
    newSubtasks.forEach(subtask => {
      if (subtask.value.trim() === '') {
        subtask.error = true;
        isValid = false;
      }
    });
    
    if (!isValid) {
      setSubtasks(newSubtasks);
      return;
    }

    try {
      // Prepare task data
      const taskData = {
        title,
        description,
        subtasks: subtasks.map(st => ({ 
          title: st.value,
          ...(st.id && { id: st.id }) // Include ID for existing subtasks
        })),
        column_id: selectedColumnId
      };
      
      // Create or update task
      if (isEditMode) {
        const updatedTask = await taskApi.update(task.id, taskData);
        if (onSubmit) onSubmit(updatedTask);
      } else {
        await taskApi.create(selectedColumnId, taskData);
        if (onSubmit) onSubmit();
      }
      
      // Close form
      onClose();
    } catch (error) {
      console.error(`Error ${isEditMode ? 'updating' : 'creating'} task:`, error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-30" onClick={onClose}>
      <form className="bg-[#2B2C37] p-8 rounded-lg w-full max-w-md z-40" onSubmit={handleSubmit} onClick={(e) => e.stopPropagation()}>
        <h2 className="text-xl font-semibold mb-6">
          {isEditMode ? 'Edit Task' : 'Add New Task'}
        </h2>
        
        <div className="mb-4">
          <label className="block mb-2 text-sm font-semibold text-gray-400">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 rounded bg-[#2B2C37] border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="e.g. Take coffee break"
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block mb-2 text-sm font-semibold text-gray-400">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 rounded bg-[#2B2C37] border border-gray-600 h-28 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="e.g. It's always good to take a break. This 15 minute break will recharge the batteries a little."
          />
        </div>
        
        <div className="mb-4">
          <label className="block mb-2 text-sm font-semibold text-gray-400">Subtasks</label>
          <div className="space-y-2">
            {subtasks.map((subtask, index) => (
              <div key={index} className="flex items-center relative">
                <input
                  type="text"
                  value={subtask.value}
                  onChange={(e) => handleSubtaskChange(index, e.target.value)}
                  className={`w-full p-2 rounded bg-[#2B2C37] border ${subtask.error ? 'border-red-500' : 'border-gray-600'} focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                  placeholder={index === 0 ? "e.g. Make coffee" : "e.g. Drink coffee & smile"}
                />
                {subtask.error && <span className="absolute right-12 text-red-500 text-sm">Can't be empty</span>}
                <button 
                  type="button"
                  onClick={() => removeSubtask(index)}
                  className="text-gray-500 hover:text-white ml-4 text-2xl"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addSubtask}
            className="bg-white hover:bg-gray-200 text-indigo-500 font-bold px-4 py-2 rounded-full mt-3 w-full"
          >
            + Add New Subtask
          </button>
        </div>

        <div className="mb-6">
          <label className="block mb-2 text-sm font-semibold text-gray-400">Status</label>
          <select 
            value={selectedColumnId}
            onChange={(e) => setSelectedColumnId(e.target.value)}
            className="w-full p-3 mt-2 rounded bg-[#2B2C37] border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {columns.map(column => (
              <option key={column.id} value={column.id}>{column.name}</option>
            ))}
          </select>
        </div>
        
        <button 
          type="submit" 
          className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold px-6 py-3 rounded-full shadow w-full"
        >
          {isEditMode ? 'Save Changes' : 'Create Task'}
        </button>
      </form>
    </div>
  );
}