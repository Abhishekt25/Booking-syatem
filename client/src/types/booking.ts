export interface Booking {
  _id: string;
  name: string;
  email: string;
  date: string;
  time: string;
  serviceType: ServiceType;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type ServiceType = 'consultation' | 'meeting' | 'support' | 'training';

export interface CreateBookingData {
  name: string;
  email: string;
  date: string;
  time: string;
  serviceType: ServiceType;
  notes?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
  count?: number;
}