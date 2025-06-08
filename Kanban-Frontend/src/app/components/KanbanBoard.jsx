// components/KanbanBoard.jsx
"use client";
import Column from "./Column";

const getColumnColor = (index) => {
  const colors = ['#49C4E5', '#8471F2', '#67E2AE'];
  return colors[index % colors.length];
};

export default function KanbanBoard({ boardData, onTaskClick }) {
  if (!boardData || !boardData.columns || boardData.columns.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-8">
        <p className="text-gray-400 text-center">
          This board is empty. Create a new column to get started.
        </p>
        <button className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-3 rounded-full shadow">
          + Add New Column
        </button>
      </div>
    );
  }

  return (
    <div className="flex space-x-6 overflow-x-auto p-6 bg-[#1e1e2d] flex-grow">
      {boardData.columns.map((column, index) => (
        <Column 
          key={column.id}
          column={column}
          color={getColumnColor(index)}
          onTaskClick={onTaskClick}
          columns={boardData.columns} // Pass columns to Column component
        />
      ))}
      
      <div className="mt-12">
         <button 
            className="bg-gradient-to-b from-[#2e2f3f] to-[#2b2c37] text-gray-400 font-bold py-10 px-8 rounded-lg hover:text-indigo-400"
         >
           + New Column
         </button>
      </div>
    </div>
  );
}