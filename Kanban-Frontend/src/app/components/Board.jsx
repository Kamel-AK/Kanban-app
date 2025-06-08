import AddNewColumnButton from "./AddNewColumnButton";

export default function Board() {
  return (
    <div className="flex flex-col items-center justify-center h-full space-y-8">
      <p className="text-gray-500 dark:text-gray-400 text-center">
        This board is empty. Create a new column to get started.
      </p>
      <AddNewColumnButton />
    </div>
  );
}