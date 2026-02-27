import React, { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { BookingContext } from './BookingContext.context.js';

export const BookingProvider = ({ children }) => {
    const { user } = useAuth();
    const [bookings, setBookings] = useState(() => {
        if (user) {
            try {
                const saved = localStorage.getItem(`bookings_${user.email}`);
                return saved ? JSON.parse(saved) : [];
            } catch (error) {
                console.error('Error parsing bookings:', error);
                return [];
            }
        }
        return [];
    });

    useEffect(() => {
        const saved = user ? localStorage.getItem(`bookings_${user.email}`) : null;
        const parsed = saved ? JSON.parse(saved) : [];

        setTimeout(() => {
            setBookings(prev => {
                if (JSON.stringify(prev) === JSON.stringify(parsed)) return prev;
                return parsed;
            });
        }, 0);
    }, [user]);

    const addBooking = (bookingData) => {
        if (!user) return;

        const newBooking = {
            ...bookingData,
            id: Date.now(),
            timestamp: new Date().toISOString(),
            userEmail: user.email
        };

        const updatedBookings = [...bookings, newBooking];
        setBookings(updatedBookings);
        localStorage.setItem(`bookings_${user.email}`, JSON.stringify(updatedBookings));
        return newBooking;
    };

    return (
        <BookingContext.Provider value={{ bookings, addBooking }}>
            {children}
        </BookingContext.Provider>
    );
};


