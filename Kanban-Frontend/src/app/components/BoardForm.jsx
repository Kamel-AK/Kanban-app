// components/BoardForm.jsx
"use client";
import { useState, useEffect } from "react";

const initialData = {
  name: '',
  columns: [{ name: 'Todo' }, { name: 'Doing' }]
};

export default function BoardForm({ isEdit = false, boardData, onClose, onSubmit }) {
  const [formData, setFormData] = useState(initialData);

  useEffect(() => {
    if (isEdit && boardData) {
      setFormData({
        name: boardData.name,
        columns: boardData.columns.map(column => ({ name: column.name }))
      });
    }
  }, [isEdit, boardData]);

  const handleNameChange = (e) => {
    setFormData(prev => ({ ...prev, name: e.target.value }));
  };

  const handleColumnChange = (index, value) => {
    const newColumns = [...formData.columns];
    newColumns[index].name = value;
    setFormData(prev => ({ ...prev, columns: newColumns }));
  };

  const addColumn = () => {
    setFormData(prev => ({...prev, columns: [...prev.columns, { name: '' }]}));
  };

  const removeColumn = (index) => {
    const newColumns = formData.columns.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, columns: newColumns }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-30" onClick={onClose}>
      <form className="bg-[#2B2C37] p-8 rounded-lg w-full max-w-md z-40" onSubmit={handleSubmit} onClick={(e) => e.stopPropagation()}>
        <h2 className="text-xl font-semibold mb-6">{isEdit ? 'Edit Board' : 'Add New Board'}</h2>
        
        <div className="mb-4">
          <label className="block mb-2 text-sm font-semibold text-gray-400">Board Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleNameChange}
            className="w-full p-2 rounded bg-[#2B2C37] border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="e.g. Web Design"
          />
        </div>
        
        <div className="mb-4">
          <label className="block mb-2 text-sm font-semibold text-gray-400">Board Columns</label>
          <div className="space-y-2">
            {formData.columns.map((column, index) => (
              <div key={index} className="flex items-center">
                <input
                  type="text"
                  value={column.name}
                  onChange={(e) => handleColumnChange(index, e.target.value)}
                  className="w-full p-2 rounded bg-[#2B2C37] border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button 
                  type="button"
                  onClick={() => removeColumn(index)}
                  className="text-gray-500 hover:text-white ml-4 text-2xl"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addColumn}
            className="bg-white hover:bg-gray-200 text-indigo-500 font-bold px-4 py-2 rounded-full mt-3 w-full"
          >
            + Add New Column
          </button>
        </div>
        
        <button 
          type="submit" 
          className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold px-6 py-3 rounded-full shadow w-full"
        >
          {isEdit ? 'Save Changes' : 'Create New Board'}
        </button>
      </form>
    </div>
  );
}