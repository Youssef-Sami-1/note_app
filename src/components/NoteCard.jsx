import { Card, Button } from 'flowbite-react';
import { HiPencil, HiTrash } from 'react-icons/hi';

const NoteCard = ({ note, onEdit, onDelete }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card className="max-w-sm h-fit rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex justify-between items-start mb-3">
        <h5 className="text-lg font-semibold tracking-tight text-gray-900 line-clamp-2">
          {note.title || 'Untitled'}
        </h5>
        <div className="flex gap-1.5 ml-2">
          <button
            aria-label="Edit note"
            onClick={() => onEdit(note)}
            className="inline-flex items-center justify-center h-8 w-8 rounded-md border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
          >
            <HiPencil className="h-4 w-4" />
          </button>
          <button
            aria-label="Delete note"
            onClick={() => onDelete(note.id || note._id)}
            className="inline-flex items-center justify-center h-8 w-8 rounded-md border border-red-200 bg-white text-red-600 hover:bg-red-50"
          >
            <HiTrash className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      <p className="text-gray-700 line-clamp-4 mb-4">
        {note.content || 'No content'}
      </p>
      
      {(note.createdAt || note.created_at) && (
        <p className="text-xs text-gray-500">
          Created: {formatDate(note.createdAt || note.created_at)}
        </p>
      )}
      
      {(note.updatedAt || note.updated_at) && (note.updatedAt || note.updated_at) !== (note.createdAt || note.created_at) && (
        <p className="text-xs text-gray-500">
          Updated: {formatDate(note.updatedAt || note.updated_at)}
        </p>
      )}
    </Card>
  );
};

export default NoteCard;
