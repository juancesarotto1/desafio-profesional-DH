import { useContext } from 'react';
import { BookingContext } from './BookingContext.context.js';

export const useBookings = () => useContext(BookingContext);
