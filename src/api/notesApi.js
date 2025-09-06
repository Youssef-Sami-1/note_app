// Set this via VITE_API_BASE_URL, e.g. https://note-sigma-black.vercel.app/api/v1
const API_BASE_URL =
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE_URL) || '';
const USE_MOCK = !!(typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_USE_MOCK === 'true');

// Helper functions to get auth headers
const getBearerHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// The professor's API samples show a custom 'token' header required for notes endpoints
const NOTE_TOKEN_PREFIX = '3b8ny__';
const getTokenHeaderOnly = () => {
  let token = localStorage.getItem('token');
  if (!token) return {};
  // The sample curl shows tokens prefixed with '3b8ny__'. If missing, add it.
  if (!token.startsWith(NOTE_TOKEN_PREFIX)) {
    token = NOTE_TOKEN_PREFIX + token;
  }
  return { token };
};

// Helper function to handle API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    let message = 'Something went wrong';
    try {
      const err = await response.json();
      message = err.msg || err.message || err.error || JSON.stringify(err) || message;
    } catch (e) {
      message = response.statusText || message;
    }
    throw new Error(message);
  }
  return response.json();
};

// --------------------
// Mock implementation
// --------------------
const mockDelay = (ms = 400) => new Promise(res => setTimeout(res, ms));
const LS_NOTES_KEY = 'mock_notes';
const ensureMockNotes = () => {
  const raw = localStorage.getItem(LS_NOTES_KEY);
  if (!raw) localStorage.setItem(LS_NOTES_KEY, JSON.stringify([]));
};

const mockAuth = {
  register: async (userData) => {
    await mockDelay();
    // naïve mock – accept anything
    return { message: 'Registered (mock)', user: { name: userData.name, email: userData.email } };
  },
  login: async (credentials) => {
    await mockDelay();
    const token = 'mock-token';
    localStorage.setItem('token', token);
    return { token };
  },
  logout: () => localStorage.removeItem('token'),
  isAuthenticated: () => !!localStorage.getItem('token'),
  getCurrentUser: async () => {
    await mockDelay();
    return { name: 'Mock User', email: 'mock@example.com', createdAt: new Date().toISOString() };
  },
};

const mockNotes = {
  getAllNotes: async () => {
    await mockDelay();
    ensureMockNotes();
    return JSON.parse(localStorage.getItem(LS_NOTES_KEY));
  },
  createNote: async (noteData) => {
    await mockDelay();
    ensureMockNotes();
    const notes = JSON.parse(localStorage.getItem(LS_NOTES_KEY));
    const now = new Date().toISOString();
    const newNote = { id: crypto.randomUUID(), title: noteData.title || '', content: noteData.content || '', createdAt: now, updatedAt: now };
    notes.unshift(newNote);
    localStorage.setItem(LS_NOTES_KEY, JSON.stringify(notes));
    return newNote;
    
  },
  updateNote: async (id, noteData) => {
    await mockDelay();
    ensureMockNotes();
    const notes = JSON.parse(localStorage.getItem(LS_NOTES_KEY));
    const idx = notes.findIndex(n => (n.id || n._id) === id);
    if (idx === -1) throw new Error('Note not found');
    const updated = { ...notes[idx], ...noteData, updatedAt: new Date().toISOString() };
    notes[idx] = updated;
    localStorage.setItem(LS_NOTES_KEY, JSON.stringify(notes));
    return updated;
  },
  deleteNote: async (id) => {
    await mockDelay();
    ensureMockNotes();
    const notes = JSON.parse(localStorage.getItem(LS_NOTES_KEY));
    const filtered = notes.filter(n => (n.id || n._id) !== id);
    localStorage.setItem(LS_NOTES_KEY, JSON.stringify(filtered));
    return { message: 'Deleted' };
  },
};

// Authentication APIs
export const authApi = {
  // Register a new user
  register: async (userData) => {
    if (USE_MOCK || !API_BASE_URL) return mockAuth.register(userData);
    // According to the provided example, register is at /users/signUp
    const response = await fetch(`${API_BASE_URL}/users/signUp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    return handleResponse(response);
  },

  // Login user
  login: async (credentials) => {
    if (USE_MOCK || !API_BASE_URL) return mockAuth.login(credentials);
    // According to the provided example, login is at /users/signIn
    const response = await fetch(`${API_BASE_URL}/users/signIn`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    const data = await handleResponse(response);

    // Store token in localStorage (support multiple response shapes)
    const token = data.token || data.accessToken || data.jwt || data?.data?.token;
    if (!token) {
      throw new Error('Login failed: missing token');
    }
    localStorage.setItem('token', token);

    // Immediately verify token with backend; if invalid, clear and fail
    try {
      await authApi.getCurrentUser();
    } catch (e) {
      localStorage.removeItem('token');
      throw new Error('Invalid email or password');
    }

    return data;
  },

  // Logout user
  logout: () => {
    if (USE_MOCK || !API_BASE_URL) return mockAuth.logout();
    localStorage.removeItem('token');
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    if (USE_MOCK || !API_BASE_URL) return mockAuth.isAuthenticated();
    return !!localStorage.getItem('token');
  },

  // Verify authentication by probing a protected endpoint (/notes with token header)
  getCurrentUser: async () => {
    if (USE_MOCK || !API_BASE_URL) return mockAuth.getCurrentUser();
    try {
      const resp = await fetch(`${API_BASE_URL}/notes`, {
        method: 'GET',
        headers: getTokenHeaderOnly(),
      });
      if (!resp.ok) {
        // Surface underlying error message if available
        try {
          const err = await resp.json();
          const message = err.msg || err.message || resp.statusText || 'Unauthenticated';
          throw new Error(message);
        } catch (_) {
          throw new Error('Unauthenticated');
        }
      }
      // We don't actually get user details from this API; return a minimal object
      return { authenticated: true };
    } catch (e) {
      throw new Error(e?.message || 'Unauthenticated');
    }
  }
};

// Notes APIs
export const notesApi = {
  // Get all notes
  getAllNotes: async () => {
    if (USE_MOCK || !API_BASE_URL) return mockNotes.getAllNotes();
    // This endpoint expects a 'token' header
    const response = await fetch(`${API_BASE_URL}/notes`, {
      method: 'GET',
      headers: getTokenHeaderOnly(),
    });
    const data = await handleResponse(response);
    // Normalize to an array of notes
    const notes = data.notes || data.data || data.items || data || [];
    return notes;
  },

  // Create a new note
  createNote: async (noteData) => {
    if (USE_MOCK || !API_BASE_URL) return mockNotes.createNote(noteData);
    const response = await fetch(`${API_BASE_URL}/notes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getTokenHeaderOnly() },
      body: JSON.stringify(noteData),
    });
    const data = await handleResponse(response);
    return data.note || data.data || data;
  },

  // Update a note
  updateNote: async (id, noteData) => {
    if (USE_MOCK || !API_BASE_URL) return mockNotes.updateNote(id, noteData);
    const response = await fetch(`${API_BASE_URL}/notes/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getTokenHeaderOnly() },
      body: JSON.stringify(noteData),
    });
    const data = await handleResponse(response);
    return data.note || data.data || data;
  },

  // Delete a note
  deleteNote: async (id) => {
    if (USE_MOCK || !API_BASE_URL) return mockNotes.deleteNote(id);
    const response = await fetch(`${API_BASE_URL}/notes/${id}`, {
      method: 'DELETE',
      headers: getTokenHeaderOnly(),
    });
    return handleResponse(response);
  }
};

export const getToken = () => localStorage.getItem('token');
