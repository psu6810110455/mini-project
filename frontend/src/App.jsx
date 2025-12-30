import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import BookingPage from './components/BookingPage';
import './index.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 font-sans">
        <header className="bg-white shadow p-4 mb-6">
          <div className="container mx-auto">
            <h1 className="text-xl font-bold text-gray-800">Sport Booking App</h1>
          </div>
        </header>

        <main>
          <Routes>
            <Route path="/" element={<Navigate to="/booking" replace />} />
            <Route path="/booking" element={<BookingPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
