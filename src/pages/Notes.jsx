import { useState, useEffect } from 'react';
import { Button, Alert, Spinner } from 'flowbite-react';
import { HiPlus } from 'react-icons/hi';
import NoteCard from '../components/NoteCard';
import NoteEditor from '../components/NoteEditor';
import { notesApi } from '../api/notesApi';
import AuthIllustration from '../assets/Authentication-bro-CfbZv6IE.svg';

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch notes on component mount
  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      setIsLoading(true);
      setError('');
      const data = await notesApi.getAllNotes();
      setNotes(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Failed to fetch notes');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateNote = () => {
    setEditingNote(null);
    setIsEditorOpen(true);
  };

  const handleEditNote = (note) => {
    setEditingNote(note);
    setIsEditorOpen(true);
  };

  const handleSaveNote = async (noteData) => {
    try {
      setIsSaving(true);
      setError('');

      if (editingNote) {
        // Update existing note
        const updatedNote = await notesApi.updateNote(editingNote.id || editingNote._id, noteData);
        setNotes(prev => prev.map(note => {
          const nid = note.id || note._id;
          const eid = editingNote.id || editingNote._id;
          return nid === eid ? updatedNote : note;
        }));
      } else {
        // Create new note
        const newNote = await notesApi.createNote(noteData);
        setNotes(prev => [newNote, ...prev]);
      }

      setIsEditorOpen(false);
      setEditingNote(null);
    } catch (err) {
      setError(err.message || 'Failed to save note');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteNote = async (noteId) => {
    if (!window.confirm('Are you sure you want to delete this note?')) {
      return;
    }

    try {
      setError('');
      await notesApi.deleteNote(noteId);
      setNotes(prev => prev.filter(note => (note.id || note._id) !== noteId));
    } catch (err) {
      setError(err.message || 'Failed to delete note');
    }
  };

  const handleCloseEditor = () => {
    setIsEditorOpen(false);
    setEditingNote(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 pt-24 flex items-center justify-center px-4">
        <div className="text-center">
          <Spinner size="xl" />
          <p className="mt-4 text-gray-600">Loading your notes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 pt-24">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">My Notes</h1>
            <p className="text-gray-600 mt-1">
              {notes.length === 0 ? 'No notes yet' : `${notes.length} note${notes.length !== 1 ? 's' : ''}`}
            </p>
          </div>
          <Button
            onClick={handleCreateNote}
            className="bg-green-600 hover:bg-green-700 rounded-full h-11 px-5 text-sm font-semibold"
          >
            <HiPlus className="mr-2 h-4 w-4" />
            New Note
          </Button>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert color="failure" className="mb-6">
            {error}
          </Alert>
        )}

        {/* Notes Grid */}
        {notes.length === 0 ? (
          <div className="text-center py-20">
            <div className="mx-auto mb-6 flex h-40 w-40 items-center justify-center rounded-full bg-white shadow-xl ring-1 ring-black/5">
              <img src={AuthIllustration} alt="No Notes" className="h-28 w-28 object-contain" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2 tracking-tight">No notes yet</h3>
            <p className="text-gray-600">Click the "New Note" button above to create your first note.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {notes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onEdit={handleEditNote}
                onDelete={handleDeleteNote}
              />
            ))}
          </div>
        )}

        {/* Note Editor Modal */}
        <NoteEditor
          isOpen={isEditorOpen}
          onClose={handleCloseEditor}
          onSave={handleSaveNote}
          note={editingNote}
          isLoading={isSaving}
        />
      </div>
    </div>
  );
};

export default Notes;
