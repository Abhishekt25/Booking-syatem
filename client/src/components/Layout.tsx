import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { FaCalendarAlt, FaPlus } from 'react-icons/fa';

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <FaCalendarAlt className="h-8 w-8 text-blue-600 mr-3" />
              <span className="text-xl font-bold text-gray-800">Booking Manager</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/"
                className="px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition-colors duration-200 flex items-center"
              >
                <FaCalendarAlt className="mr-2" />
                View Bookings
              </Link>
              <Link
                to="/create"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center"
              >
                <FaPlus className="mr-2" />
                New Booking
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>

    </div>
  );
};

export default Layout;