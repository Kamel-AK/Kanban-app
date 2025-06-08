// app/page.js
"use client";
import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import KanbanBoard from "./components/KanbanBoard";
import BoardForm from "./components/BoardForm";
import TaskForm from "./components/TaskForm";
import TaskView from "./components/TaskView";
import DeleteDialog from "./components/DeleteDialog";
import { boardApi } from "./utils/api";

export default function Home() {
  const [boards, setBoards] = useState([]);
  const [activeBoardId, setActiveBoardId] = useState(null);
  const [activeBoard, setActiveBoard] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Modal States
  const [modal, setModal] = useState({
    boardForm: { isOpen: false, isEdit: false },
    taskForm: { isOpen: false, isEdit: false, columnId: null },
    taskView: { isOpen: false, task: null },
    deleteDialog: { isOpen: false, type: '', id: null, name: '' }
  });

  // Load boards on mount
  useEffect(() => {
    const loadBoards = async () => {
      try {
        const boardsData = await boardApi.getAll();
        setBoards(boardsData);
        if (boardsData.length > 0) {
          setActiveBoardId(boardsData[0].id);
        }
      } catch (error) {
        console.error("Failed to load boards:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadBoards();
  }, []);

  // Load active board data when ID changes
  useEffect(() => {
    const loadActiveBoard = async () => {
      if (activeBoardId) {
        try {
          setIsLoading(true);
          const boardData = await boardApi.get(activeBoardId);
          setActiveBoard(boardData);
        } catch (error) {
          console.error("Failed to load board:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    if (activeBoardId) {
      loadActiveBoard();
    }
  }, [activeBoardId]);

  const handleOpenModal = (modalName, options = {}) => {
    setModal(prev => ({ ...prev, [modalName]: { ...prev[modalName], isOpen: true, ...options } }));
  };

  const handleCloseModal = (modalName) => {
    setModal(prev => ({ ...prev, [modalName]: { ...prev[modalName], isOpen: false } }));
  };

  // Board CRUD operations
  const handleCreateBoard = async (boardData) => {
    try {
      const newBoard = await boardApi.create({ name: boardData.name });
      
      setBoards(prev => [...prev, newBoard]);
      setActiveBoardId(newBoard.id);
      handleCloseModal('boardForm');
    } catch (error) {
      console.error("Error creating board:", error);
    }
  };

  const handleUpdateBoard = async (boardData) => {
    if (!activeBoardId) return;
    try {
      const updatedBoard = await boardApi.update(activeBoardId, { name: boardData.name });
      
      setBoards(prev => 
        prev.map(board => board.id === activeBoardId ? updatedBoard : board)
      );
      setActiveBoard(updatedBoard);
      handleCloseModal('boardForm');
    } catch (error) {
      console.error("Error updating board:", error);
    }
  };

  const handleDeleteBoard = async () => {
    if (!activeBoardId) return;
    try {
      await boardApi.delete(activeBoardId);
      
      // Update boards state
      const updatedBoards = boards.filter(board => board.id !== activeBoardId);
      setBoards(updatedBoards);
      
      // Select a new active board
      if (updatedBoards.length > 0) {
        setActiveBoardId(updatedBoards[0].id);
      } else {
        setActiveBoardId(null);
      }
      handleCloseModal('deleteDialog');
    } catch (error) {
      console.error("Error deleting board:", error);
    }
  };

  return (
    <main className="flex h-screen bg-[#1e1e2d] text-white">
      <Sidebar
        boards={boards.map(board => board.name)}
        activeBoard={activeBoard ? activeBoard.name : null}
        setActiveBoard={(boardName) => {
          const board = boards.find(b => b.name === boardName);
          setActiveBoardId(board.id);
        }}
        onAddNewBoard={() => handleOpenModal('boardForm', { isEdit: false })}
      />

      <div className="flex flex-col flex-grow">
        {activeBoard && (
          <Header 
            boardName={activeBoard.name}
            onAddNewTask={() => {
              if (activeBoard.columns.length > 0) {
                handleOpenModal('taskForm', { 
                  isEdit: false,
                  columnId: activeBoard.columns[0].id
                });
              }
            }}
            onEditBoard={() => handleOpenModal('boardForm', { isEdit: true })}
            onDeleteBoard={() => handleOpenModal('deleteDialog', { 
              type: 'board', 
              id: activeBoardId, 
              name: activeBoard.name 
            })}
          />
        )}
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <p>Loading...</p>
          </div>
        ) : activeBoard ? (
          <KanbanBoard 
            boardData={activeBoard} 
            onTaskClick={(task) => handleOpenModal('taskView', { task })}
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <p>No boards available. Create a new board to get started.</p>
          </div>
        )}
      </div>

      {/* MODALS */}
      {modal.boardForm.isOpen && (
        <BoardForm 
          isEdit={modal.boardForm.isEdit}
          boardData={modal.boardForm.isEdit ? { 
            name: activeBoard.name, 
            columns: activeBoard.columns.map(col => ({ name: col.name })) 
          } : null}
          onClose={() => handleCloseModal('boardForm')}
          onSubmit={modal.boardForm.isEdit ? handleUpdateBoard : handleCreateBoard}
        />
      )}
      {modal.taskForm.isOpen && (
        <TaskForm 
          onClose={() => handleCloseModal('taskForm')}
          onSubmit={() => {}} // Will be implemented
          columnId={modal.taskForm.columnId}
        />
      )}
      {modal.taskView.isOpen && (
        <TaskView 
          task={modal.taskView.task} 
          onClose={() => handleCloseModal('taskView')} 
          onUpdateSubtask={() => {}} // Will be implemented
          columns={activeBoard?.columns || []} // Use activeBoard's columns
        />
      )}
      {modal.deleteDialog.isOpen && (
        <DeleteDialog
          itemType={modal.deleteDialog.type}
          itemName={modal.deleteDialog.name}
          onDelete={handleDeleteBoard}
          onCancel={() => handleCloseModal('deleteDialog')}
        />
      )}
    </main>
  );
}