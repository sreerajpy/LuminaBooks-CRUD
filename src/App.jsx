import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2, Edit3, Plus, Search, Book, Calendar, User, X, CheckCircle } from 'lucide-react';

const API_URL = 'http://localhost:5000/books';

function App() {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({ title: '', author: '', published_year: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [notification, setNotification] = useState('');

  useEffect(() => { fetchBooks(); }, []);

  // Show a temporary success message
  const triggerToast = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 3000);
  };

  const fetchBooks = async () => {
    try {
      const response = await axios.get(API_URL);
      setBooks(response.data);
    } catch (error) { console.error("Error fetching books", error); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        // UPDATE FUNCTIONALITY
        await axios.put(`${API_URL}/${currentId}`, formData);
        triggerToast("Book updated successfully!");
      } else {
        // CREATE FUNCTIONALITY
        await axios.post(API_URL, formData);
        triggerToast("New book added!");
      }
      resetForm();
      fetchBooks();
    } catch (error) {
      alert("Error: " + error?.response?.data?.message || `Error`)
    }
  };

  const handleEditClick = (book) => {
    setIsEditing(true);
    setCurrentId(book.id);
    setFormData({ title: book.title, author: book.author, published_year: book.published_year });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setFormData({ title: '', author: '', published_year: '' });
    setIsEditing(false);
    setCurrentId(null);
  };

  const deleteBook = async (id) => {
    resetForm()
    if (window.confirm("Are you sure you want to remove this book?")) {
      await axios.delete(`${API_URL}/${id}`);
      triggerToast("Book removed.");
      fetchBooks();
    }
  };

  const filteredBooks = books?.filter(b =>
    b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans">
      {/* Success Toast */}
      {notification && (
        <div className="fixed top-5 right-5 bg-emerald-500 text-white px-6 py-3 rounded-2xl shadow-2xl z-50 flex items-center gap-2 animate-bounce">
          <CheckCircle size={20} /> {notification}
        </div>
      )}

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-slate-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 text-indigo-600">
            <div className="bg-indigo-600 p-2 rounded-lg text-white">
              <Book size={24} />
            </div>
            <h1 className="text-2xl font-black tracking-tight text-slate-800">Lumina<span className="text-indigo-600">Books</span></h1>
          </div>

          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search library..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-100 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </header>

      <main className="max-w-9xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* Sidebar Form */}
        <aside className="lg:col-span-4">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 sticky top-28">
            <h2 className="text-xl font-bold mb-6 text-slate-800 flex items-center gap-2">
              {isEditing ? <Edit3 className="text-amber-500" /> : <Plus className="text-indigo-600" />}
              {isEditing ? "Update Details" : "Add to Library"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-600 ml-1">Title</label>
                <input
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all"
                  placeholder="e.g. Atomic Habits"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })} required
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-600 ml-1">Author</label>
                <input
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all"
                  placeholder="e.g. James Clear"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })} required
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-600 ml-1">Year</label>
                <input
                  type="number"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all"
                  placeholder="2024"
                  value={formData.published_year}
                  onChange={(e) => setFormData({ ...formData, published_year: e.target.value })} required
                />
              </div>

              <div className="flex flex-col gap-3 pt-2">
                <button
                  type="submit"
                  className={`w-full py-4 rounded-2xl font-bold text-white shadow-lg transition-all active:scale-95 ${isEditing ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-200' : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200'
                    }`}
                >
                  {isEditing ? "Save Changes" : "Create Entry"}
                </button>
                {isEditing && (
                  <button type="button" onClick={resetForm} className="flex items-center justify-center gap-1 text-slate-400 hover:text-slate-600 text-sm font-medium">
                    <X size={16} /> Cancel Editing
                  </button>
                )}
              </div>
            </form>
          </div>
        </aside>

        {/* Content Area */}
        <section className="lg:col-span-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredBooks.map((book) => (
              <div key={book.id} className="group relative bg-white border border-slate-200 p-6 rounded-[2rem] hover:shadow-2xl hover:border-indigo-200 transition-all duration-300">
                <div className="flex justify-between items-start mb-6">
                  <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                    <Book size={28} />
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleEditClick(book)} className="p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:bg-amber-50 hover:text-amber-600 transition-all">
                      <Edit3 size={18} />
                    </button>
                    <button onClick={() => deleteBook(book.id)} className="p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:bg-red-50 hover:text-red-600 transition-all">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-slate-800 mb-4 line-clamp-2 leading-tight">
                  {book.title}
                </h3>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-slate-500 text-sm">
                    <User size={16} className="text-indigo-300" />
                    <span className="font-medium">{book.author}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400 text-sm">
                    <Calendar size={16} className="text-indigo-200" />
                    <span>Published in {book.published_year}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredBooks.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 bg-white rounded-[3rem] border-2 border-dashed border-slate-200 text-slate-400">
              <Book size={48} className="mb-4 opacity-20" />
              <p className="text-lg font-medium">No books found in your library.</p>
              <p className="text-sm">Try adding a new one or changing your search.</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;