const API_BASE = 'http://127.0.0.1:8000/api';

// Helper function to handle API responses
async function handleResponse(response) {
  // Handle empty responses (204 No Content)
  if (response.status === 204) {
    return { success: true };
  }
  
  // Handle HTML/plain text errors
  const contentType = response.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json')) {
    const text = await response.text();
    throw new Error(text || `Request failed with status ${response.status}`);
  }
  
  // Handle JSON responses
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || JSON.stringify(data));
  }
  
  return data;
}

// Board API functions
export const boardApi = {
  async getAll() {
    const response = await fetch(`${API_BASE}/boards`);
    return handleResponse(response);
  },

  async create(board) {
    const response = await fetch(`${API_BASE}/boards`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(board)
    });
    return handleResponse(response);
  },

  async update(id, board) {
    const response = await fetch(`${API_BASE}/boards/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(board)
    });
    return handleResponse(response);
  },

  async delete(id) {
    const response = await fetch(`${API_BASE}/boards/${id}`, {
      method: 'DELETE'
    });
    return handleResponse(response);
  },

  async get(id) {
    const response = await fetch(`${API_BASE}/boards/${id}`);
    return handleResponse(response);
  }
};

// Column API functions
export const columnApi = {
  async create(boardId, column) {
    const response = await fetch(`${API_BASE}/boards/${boardId}/columns`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(column)
    });
    return handleResponse(response);
  },

  async update(boardId, columnId, column) {
    const response = await fetch(`${API_BASE}/boards/${boardId}/columns/${columnId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(column)
    });
    return handleResponse(response);
  },

  async delete(boardId, columnId) {
    const response = await fetch(`${API_BASE}/boards/${boardId}/columns/${columnId}`, {
      method: 'DELETE'
    });
    return handleResponse(response);
  }
};

// Task API functions
export const taskApi = {
  async create(columnId, task) {
    const response = await fetch(`${API_BASE}/columns/${columnId}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task)
    });
    return handleResponse(response);
  },

  async update(taskId, task) {
    const response = await fetch(`${API_BASE}/tasks/${taskId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task)
    });
    return handleResponse(response);
  },

  async delete(taskId) {
    const response = await fetch(`${API_BASE}/tasks/${taskId}`, {
      method: 'DELETE'
    });
    return handleResponse(response);
  }
};

// Subtask API functions
export const subtaskApi = {
  async create(taskId, subtask) {
    const response = await fetch(`${API_BASE}/tasks/${taskId}/subtasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(subtask)
    });
    return handleResponse(response);
  },

  async update(subtaskId, subtask) {
    const response = await fetch(`${API_BASE}/subtasks/${subtaskId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(subtask)
    });
    return handleResponse(response);
  },

  async delete(subtaskId) {
    const response = await fetch(`${API_BASE}/subtasks/${subtaskId}`, {
      method: 'DELETE'
    });
    return handleResponse(response);
  }
};