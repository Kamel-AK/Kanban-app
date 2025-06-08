"use client";

export default function DeleteDialog({ itemType, itemName, onDelete, onCancel }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#2B2C37] p-8 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-bold text-red-500 mb-4">Delete this {itemType}?</h2>
        <p className="text-gray-400 mb-6">
          Are you sure you want to delete the ‘{itemName}’ {itemType}? This action will remove all columns and tasks and cannot be reversed.
        </p>
        <div className="flex justify-center space-x-4">
          <button
            onClick={onDelete}
            className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-full font-semibold w-full"
          >
            Delete
          </button>
          <button
            onClick={onCancel}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-8 py-3 rounded-full font-semibold w-full"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}