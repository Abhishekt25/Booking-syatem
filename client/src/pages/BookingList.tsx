import React, { useEffect, useState } from 'react';
import { bookingApi } from '../api/bookingApi';
import type { Booking } from '../types/booking';
import { FaUser, FaEnvelope, FaCalendarDay, FaClock, FaTag, FaSpinner } from 'react-icons/fa';
import { format } from 'date-fns';
import { toast } from 'react-toastify';

const BookingList: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await bookingApi.getAllBookings();
      
      if (response.success && response.data) {
        setBookings(response.data);
      } else {
        setError(response.message || 'Failed to fetch bookings');
        toast.error(response.message || 'Failed to fetch bookings');
      }
    } catch (err) {
      setError('An error occurred while fetching bookings');
      toast.error('An error occurred while fetching bookings');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const getServiceTypeColor = (type: string) => {
    switch (type) {
      case 'consultation':
        return 'bg-blue-100 text-blue-800';
      case 'meeting':
        return 'bg-green-100 text-green-800';
      case 'support':
        return 'bg-yellow-100 text-yellow-800';
      case 'training':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <FaSpinner className="animate-spin text-4xl text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p className="text-red-600">{error}</p>
        <button
          onClick={fetchBookings}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Bookings</h1>
        <p className="text-gray-600 mt-2">Manage all your appointments and meetings</p>
      </div>

      {bookings.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <FaCalendarDay className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">No bookings yet</h3>
          <p className="mt-2 text-gray-500">Get started by creating your first booking.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                      <FaUser className="mr-2 text-blue-500" />
                      {booking.name}
                    </h3>
                    <p className="text-gray-600 text-sm mt-1 flex items-center">
                      <FaEnvelope className="mr-2" />
                      {booking.email}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getServiceTypeColor(booking.serviceType)}`}>
                    {booking.serviceType}
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center text-gray-700">
                    <FaCalendarDay className="mr-3 text-gray-400" />
                    <span>{format(new Date(booking.date), 'MMMM dd, yyyy')}</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <FaClock className="mr-3 text-gray-400" />
                    <span>{booking.time}</span>
                  </div>
                  {booking.notes && (
                    <div className="mt-4 pt-4 border-t">
                      <p className="text-gray-600 text-sm">{booking.notes}</p>
                    </div>
                  )}
                </div>

                <div className="mt-6 text-xs text-gray-500">
                  Created: {format(new Date(booking.createdAt), 'MMM dd, yyyy HH:mm')}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookingList;