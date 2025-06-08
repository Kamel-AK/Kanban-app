export default function EmptyBoard() {
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