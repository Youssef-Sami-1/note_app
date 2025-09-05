import { useState, useEffect } from 'react';

const NoteEditor = ({ isOpen, onClose, onSave, note = null, isLoading = false }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: ''
  });

  // Reset form when modal opens/closes or note changes
  useEffect(() => {
    if (note) {
      setFormData({
        title: note.title || '',
        content: note.content || ''
      });
    } else {
      setFormData({
        title: '',
        content: ''
      });
    }
  }, [note, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.title.trim() || formData.content.trim()) {
      onSave(formData);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-10 w-full max-w-xl rounded-2xl border border-gray-100 bg-white shadow-2xl">
        <div className="p-6 sm:p-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-1">{note ? 'Edit Note' : 'Create New Note'}</h3>
          <p className="text-sm text-gray-600 mb-6">{note ? 'Update your note details.' : 'Write down your thoughts and ideas.'}</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="title" className="text-sm font-medium text-gray-900">Title</label>
              <input
                id="title"
                name="title"
                type="text"
                placeholder="Enter note title..."
                value={formData.title}
                onChange={handleChange}
                disabled={isLoading}
                className="mt-1 w-full h-12 rounded-xl border border-gray-200 bg-white px-4 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 shadow-sm"
              />
            </div>

            <div>
              <label htmlFor="content" className="text-sm font-medium text-gray-900">Content</label>
              <textarea
                id="content"
                name="content"
                placeholder="Write your note content here..."
                rows={8}
                value={formData.content}
                onChange={handleChange}
                disabled={isLoading}
                className="mt-1 w-full rounded-xl border border-gray-200 bg-white p-4 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 shadow-sm"
              />
            </div>

            <div className="mt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="inline-flex items-center justify-center rounded-full h-11 px-5 text-sm font-semibold border border-gray-200 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading || (!formData.title.trim() && !formData.content.trim())}
                className="inline-flex items-center justify-center rounded-full h-11 px-5 text-sm font-semibold bg-green-600 text-white hover:bg-green-700 disabled:opacity-60"
              >
                {isLoading ? 'Saving...' : (note ? 'Update Note' : 'Create Note')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NoteEditor;
