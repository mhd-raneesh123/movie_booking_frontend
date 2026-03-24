import { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

const ShowSelection = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const movie = location.state?.movie;

  const [selectedDate, setSelectedDate] = useState('Today, 23 Feb');

  const dates = ['Today, 23 Feb', 'Tue, 24 Feb', 'Wed, 25 Feb', 'Thu, 26 Feb', 'Fri 27 Feb'];
  
  const theaters = [
    { name: "PVR: Directors Cut", times: ["10:30 AM", "02:15 PM", "07:00 PM", "10:45 PM"] },
    { name: "Cinepolis: VIP Lounge", times: ["11:00 AM", "03:30 PM", "06:45 PM"] },
    { name: "Inox: Insignia", times: ["09:00 AM", "12:45 PM", "04:00 PM", "08:15 PM"] }
  ];

  // UPDATED: Added the login check guard here
  const handleTimeSelect = (theaterName, timeSlot) => {
    const userId = localStorage.getItem('userId'); 

    if (!userId) {
      alert("Please login to select a showtime and book your ticket!");
      navigate('/login');
      return; 
    }

    navigate(`/book/${id}`, { 
      state: { 
        movie: movie, 
        theater: theaterName, 
        time: timeSlot, 
        date: selectedDate 
      } 
    });
  };

  if (!movie) {
    return <div className="text-center p-20 text-xl">No movie data found. Please go back to Home.</div>;
  }
    
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{movie?.title}</h1>
            <p className="text-gray-500">{movie?.genre} • English</p>
          </div>
        </div>

        {/* --- MOVIE TRAILER SECTION --- */}
        {movie?.trailerId ? (
          <div className="mb-10">
            <div className="rounded-2xl overflow-hidden shadow-xl aspect-video bg-black border-4 border-white">
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${movie.trailerId}`}
                title={`${movie.title} Trailer`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        ) : (
          <div className="bg-gray-200 h-10 rounded-xl mb-10 flex items-center justify-center text-gray-500 text-sm italic">
            Trailer currently unavailable
          </div>
        )}

        {/* Date Selector */}
        <div className="flex gap-4 mb-10 overflow-x-auto pb-2">
          {dates.map(date => (
            <button 
              key={date}
              onClick={() => setSelectedDate(date)}
              className={`flex-shrink-0 px-6 py-3 rounded-xl font-bold transition ${selectedDate === date ? 'bg-red-600 text-white shadow-lg' : 'bg-white text-gray-600 border hover:border-red-500'}`}
            >
              {date}
            </button>
          ))}
        </div>

        {/* Theater & Time Slots */}
        <div className="space-y-6">
          {theaters.map(theater => (
            <div key={theater.name} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="font-bold text-lg mb-4 text-gray-800">📍 {theater.name}</h3>
              <div className="flex flex-wrap gap-3">
                {theater.times.map(time => (
                  <button 
                    key={time}
                    onClick={() => handleTimeSelect(theater.name, time)}
                    className="px-5 py-2 border border-green-500 text-green-600 rounded-lg font-semibold hover:bg-green-50 transition text-sm"
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShowSelection;