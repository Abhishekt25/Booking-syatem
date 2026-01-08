import express from 'express';
import { BookingController } from '../controllers/bookingController';

const router = express.Router();

// Create a new booking
router.post('/bookings', BookingController.createBooking);

// Get all bookings
router.get('/bookings', BookingController.getAllBookings);

export default router;