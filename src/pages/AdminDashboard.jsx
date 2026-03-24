import { useState, useEffect } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [movies, setMovies] = useState([]);
  const [editingId, setEditingId] = useState(null); // Tracks if we are editing an existing movie
  const [formData, setFormData] = useState({
    title: '', description: '', releaseDate: '', genre: '', posterUrl: '', trailerId: ''
  });
  const [status, setStatus] = useState({ type: '', message: '' });

  // 1. Fetch all movies when the dashboard loads
  const fetchMovies = async () => {
    try {
      const response = await axios.get('https://movie-booking-backend-mebh.onrender.com/api/movies');
      setMovies(response.data);
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 2. Handle Form Submit (Both ADD and UPDATE)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: 'loading', message: editingId ? 'Updating movie...' : 'Adding movie...' });
    const token = localStorage.getItem('token');

    try {
      if (editingId) {
        // UPDATE EXISTING MOVIE
        await axios.put(`https://movie-booking-backend-mebh.onrender.com/api/movies/${editingId}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStatus({ type: 'success', message: 'Movie updated successfully!' });
      } else {
        // ADD NEW MOVIE
        await axios.post('https://movie-booking-backend-mebh.onrender.com/api/movies', formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStatus({ type: 'success', message: 'Movie added successfully!' });
      }

      // Reset form and refresh list
      setFormData({ title: '', description: '', releaseDate: '', genre: '', posterUrl: '', trailerId: '' });
      setEditingId(null);
      fetchMovies(); 

    } catch (err) {
      setStatus({ 
        type: 'error', 
        message: err.response?.data?.message || 'Action failed. Check your backend routes.' 
      });
    }
  };

  // 3. Load movie data into the form for editing
  const handleEditClick = (movie) => {
    setFormData({
      title: movie.title,
      description: movie.description,
      // Format date properly for the input field
      releaseDate: movie.releaseDate ? movie.releaseDate.split('T')[0] : '',
      genre: movie.genre,
      posterUrl: movie.posterUrl,
      trailerId: movie.trailerId || ''
    });
    setEditingId(movie._id);
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll up to the form
  };

  // 4. Delete Movie
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this movie? This action cannot be undone.")) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`https://movie-booking-backend-mebh.onrender.com/api/movies/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setStatus({ type: 'success', message: 'Movie deleted successfully!' });
      fetchMovies(); // Refresh the list
    } catch (err) {
      setStatus({ type: 'error', message: 'Failed to delete movie.' });
    }
  };

  const cancelEdit = () => {
    setFormData({ title: '', description: '', releaseDate: '', genre: '', posterUrl: '', trailerId: '' });
    setEditingId(null);
    setStatus({ type: '', message: '' });
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-8">Admin Dashboard</h1>
        
        {/* --- FORM SECTION --- */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 mb-10">
          <div className="flex justify-between items-center mb-6 border-b pb-4">
            <h2 className="text-xl font-bold">{editingId ? 'Edit Movie' : 'Add a New Movie'}</h2>
            {editingId && (
              <button onClick={cancelEdit} className="text-sm font-bold text-gray-500 hover:text-red-600 transition">
                Cancel Edit
              </button>
            )}
          </div>
          
          {status.message && (
            <div className={`p-4 mb-6 rounded-lg font-semibold ${status.type === 'success' ? 'bg-green-100 text-green-700' : status.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
              {status.message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Movie Title</label>
                <input type="text" name="title" value={formData.title} onChange={handleChange} required
                  className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-gray-900 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Genre</label>
                <input type="text" name="genre" value={formData.genre} onChange={handleChange} required
                  className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-gray-900 outline-none" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
              <textarea name="description" value={formData.description} onChange={handleChange} required rows="3"
                className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-gray-900 outline-none"></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Release Date</label>
                <input type="date" name="releaseDate" value={formData.releaseDate} onChange={handleChange} required
                  className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-gray-900 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">YouTube Trailer ID</label>
                <input type="text" name="trailerId" value={formData.trailerId} onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-gray-900 outline-none" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Poster Image URL</label>
              <input type="url" name="posterUrl" value={formData.posterUrl} onChange={handleChange} required
                className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-gray-900 outline-none" />
            </div>

            <button type="submit" className={`w-full text-white font-bold py-3 px-4 rounded-xl transition duration-300 mt-4 ${editingId ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-900 hover:bg-black'}`}>
              {editingId ? 'Update Movie' : 'Publish Movie'}
            </button>
          </form>
        </div>

        {/* --- MANAGE MOVIES LIST SECTION --- */}
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Manage Existing Movies</h2>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {movies.length === 0 ? (
            <div className="p-8 text-center text-gray-500 italic">No movies found in the database.</div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {movies.map(movie => (
                <li key={movie._id} className="p-6 flex flex-col sm:flex-row justify-between items-center hover:bg-gray-50 transition">
                  <div className="flex items-center gap-4 mb-4 sm:mb-0 w-full sm:w-auto">
                    <img src={movie.posterUrl} alt={movie.title} className="w-16 h-20 object-cover rounded-md shadow-sm" />
                    <div>
                      <h3 className="font-bold text-lg text-gray-900">{movie.title}</h3>
                      <p className="text-sm text-gray-500 font-medium">{movie.genre}</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3 w-full sm:w-auto justify-end">
                    <button 
                      onClick={() => handleEditClick(movie)}
                      className="px-4 py-2 border border-blue-200 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg font-bold text-sm transition"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(movie._id)}
                      className="px-4 py-2 border border-red-200 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg font-bold text-sm transition"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;