import { Request, Response } from 'express';
import Booking, { IBooking } from '../models/Booking';

export class BookingController {
  // Create a new booking
  static async createBooking(req: Request, res: Response): Promise<void> {
    try {
      const bookingData: Omit<IBooking, 'createdAt' | 'updatedAt'> = req.body;
      
      // Validate required fields
      if (!bookingData.name || !bookingData.email || !bookingData.date || !bookingData.time || !bookingData.serviceType) {
        res.status(400).json({
          success: false,
          message: 'All required fields must be provided'
        });
        return;
      }

      const booking = new Booking(bookingData);
      await booking.save();

      res.status(201).json({
        success: true,
        data: booking,
        message: 'Booking created successfully'
      });
    } catch (error: any) {
      if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map((err: any) => err.message);
        res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: messages
        });
      } else {
        console.error('Error creating booking:', error);
        res.status(500).json({
          success: false,
          message: 'Internal server error'
        });
      }
    }
  }

  // Get all bookings
  static async getAllBookings(req: Request, res: Response): Promise<void> {
    try {
      const bookings = await Booking.find().sort({ date: 1, time: 1 });
      
      res.status(200).json({
        success: true,
        count: bookings.length,
        data: bookings
      });
    } catch (error) {
      console.error('Error fetching bookings:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
}