import axios from 'axios';
import type{ Booking, CreateBookingData, ApiResponse } from '../types/booking';

// Use your backend URL explicitly
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, 
});

// Add request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(' API Request:', config.method?.toUpperCase(), config.url);
    console.log(' Request Data:', config.data);
    return config;
  },
  (error) => {
    console.error(' Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for logging
api.interceptors.response.use(
  (response) => {
    console.log(' API Response:', response.status, response.config.url);
    console.log(' Response Data:', response.data);
    return response;
  },
  (error) => {
    console.error(' API Error:', {
      message: error.message,
      status: error.response?.status,
      url: error.config?.url,
      data: error.response?.data
    });
    
    if (!error.response) {
      console.error(' Network error - Backend might be down');
    }
    
    return Promise.reject(error);
  }
);

export const bookingApi = {
  // Test connection first
  async testConnection(): Promise<ApiResponse<any>> {
    try {
        const response = await axios.get(
        import.meta.env.VITE_API_BASE_URL.replace('/api', '') + '/health'
      );
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: 'Backend server is not responding'
      };
    }
  },

  // Create a new booking
  async createBooking(bookingData: CreateBookingData): Promise<ApiResponse<Booking>> {
    try {
      const response = await api.post<ApiResponse<Booking>>('/bookings', bookingData);
      return response.data;
    } catch (error: any) {
      console.error('Create booking error:', error);
      
      if (error.response) {
        return error.response.data;
      } else if (error.request) {
        return {
          success: false,
          message: 'Network error - Cannot connect to backend server'
        };
      } else {
        return {
          success: false,
          message: error.message || 'Unknown error occurred'
        };
      }
    }
  },

  // Get all bookings
  async getAllBookings(): Promise<ApiResponse<Booking[]>> {
    try {
      const response = await api.get<ApiResponse<Booking[]>>('/bookings');
      return response.data;
    } catch (error: any) {
      console.error('Get bookings error:', error);
      
      if (error.response) {
        return error.response.data;
      } else if (error.request) {
        return {
          success: false,
          message: 'Network error - Cannot connect to backend server'
        };
      } else {
        return {
          success: false,
          message: error.message || 'Unknown error occurred'
        };
      }
    }
  },
};