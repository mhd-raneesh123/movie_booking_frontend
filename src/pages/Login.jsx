import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://movie-booking-backend-mebh.onrender.com/api/users/login', formData);
      
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userName', response.data.name || "User"); 
      localStorage.setItem('userId', response.data.userId);
      // --- NEW: SAVE THE ROLE ---
      localStorage.setItem('role', response.data.role || "user"); 
      
      navigate('/'); 
      window.location.reload(); // Refresh to update the Navbar immediately
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md border border-gray-100">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-6">Welcome Back</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
            <input type="email" name="email" onChange={handleChange} required
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" placeholder="john@example.com" />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
            <input type="password" name="password" onChange={handleChange} required
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" placeholder="********" />
          </div>
          <button type="submit" className="w-full bg-gray-900 text-white font-bold py-2 px-4 rounded-lg hover:bg-black transition duration-300">
            Log In
          </button>
        </form>
        <p className="text-center mt-4 text-gray-600 text-sm">
          Don't have an account? <Link to="/signup" className="text-red-600 hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;