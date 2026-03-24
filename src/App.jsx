import { BrowserRouter as Router, Routes, Route, Link, useNavigate, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import ShowSelection from './pages/ShowSelection';
import Booking from './pages/Booking';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile'; 
import AdminDashboard from './pages/AdminDashboard'; // --- NEW IMPORT ---
import ProtectedRoute from './components/ProtectedRoute';

// --- NEW: ADMIN PROTECTED ROUTE ---
const AdminRoute = ({ children }) => {
  const role = localStorage.getItem('role');
  if (role !== 'admin') {
    return <Navigate to="/" replace />; // Kick non-admins back to home
  }
  return children;
};

const Header = () => {
  const navigate = useNavigate();
  const userName = localStorage.getItem('userName'); 
  const role = localStorage.getItem('role'); // --- NEW: Get the role ---

  const handleLogout = () => {
    localStorage.clear(); 
    navigate('/login');
    window.location.reload(); 
  };

  return (
    <nav className="bg-white border-b border-gray-100 py-4 px-8 flex justify-between items-center sticky top-0 z-50 shadow-sm">
      <Link to="/" className="text-2xl font-black text-red-600 tracking-tighter">
        BOOKMYMOVIE
      </Link>
      
      <div className="flex items-center gap-6 font-medium text-gray-700">
        <Link to="/" className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition">Movies</Link>
        
        {userName ? (
          <div className="flex items-center gap-4 ">
            
            {/* --- NEW: ONLY SHOW TO ADMINS --- */}
            {role === 'admin' && (
              <Link to="/admin" className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-black transition border border-transparent shadow-sm">
                Admin Panel
              </Link>
            )}

            <Link to="/profile" className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition">
              My Bookings
            </Link>
            
            <span className="text-sm">Hi, <span className="font-bold text-gray-900">{userName}</span></span>
            
            <button 
              onClick={handleLogout}
              className="text-sm bg-gray-100 hover:bg-red-50 hover:text-red-600 px-4 py-2 rounded-lg transition"
            >
              Logout
            </button>
          </div>
        ) : (
          <Link to="/login" className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <Routes>
            {/* --- PUBLIC ROUTES --- */}
            <Route path="/" element={<Home />} />
            <Route path="/shows/:id" element={<ShowSelection />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* --- PROTECTED ROUTES (Logged in users only) --- */}
            <Route path="/book/:id" element={
              <ProtectedRoute>
                <Booking />
              </ProtectedRoute>
            } />
            <Route path="/checkout" element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            } /> 
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />

            {/* --- ADMIN ROUTE (Admins only) --- */}
            <Route path="/admin" element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            } />

          </Routes>
        </main>
        <footer className="bg-gray-900 text-white text-center py-6">
          <p>&copy; 2026 MovieBooking. All rights reserved.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;