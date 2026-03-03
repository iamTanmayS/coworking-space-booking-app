import { useState, useMemo, useEffect } from 'react';

interface TimeSlot {
    value: string; // "09:00"
    label: string; // "09:00 AM"
}

interface DateSlot {
    date: Date;
    dayName: string;
    dayNumber: number;
    monthName: string;
    isAvailable: boolean;
}

interface UseBookingScheduleViewModelProps {
    spaceSchedule?: {
        openDays: number[]; // 0-6, where 0 is Sunday
        openTime: string; // "09:00"
        closeTime: string; // "18:00"
    };
}

export const useBookingScheduleViewModel = ({
    spaceSchedule,
}: UseBookingScheduleViewModelProps = {}) => {
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedStartTime, setSelectedStartTime] = useState<string | null>(null);
    const [selectedEndTime, setSelectedEndTime] = useState<string | null>(null);

    /**
     * Generate dates for the next N days
     * @param daysCount - Number of days to generate (default: 30)
     * @returns Array of date slots with availability info
     */
    const generateDates = (daysCount: number = 30): DateSlot[] => {
        const dates: DateSlot[] = [];
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        for (let i = 0; i < daysCount; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);

            const dayOfWeek = date.getDay();
            const isAvailable = spaceSchedule
                ? spaceSchedule.openDays.includes(dayOfWeek)
                : true;

            dates.push({
                date,
                dayName: new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(date),
                dayNumber: date.getDate(),
                monthName: new Intl.DateTimeFormat('en-US', { month: 'short' }).format(date),
                isAvailable,
            });
        }

        return dates;
    };

    /**
     * Generate time slots between start and end time
     * @param startTime - Start time in "HH:mm" format (e.g., "09:00")
     * @param endTime - End time in "HH:mm" format (e.g., "18:00")
     * @param intervalMinutes - Interval between slots in minutes (default: 60)
     * @returns Array of time slots
     */
    const generateTimeSlots = (
        startTime: string = '00:00',
        endTime: string = '23:59',
        intervalMinutes: number = 60
    ): TimeSlot[] => {
        const slots: TimeSlot[] = [];
        const [startHour, startMinute] = startTime.split(':').map(Number);
        const [endHour, endMinute] = endTime.split(':').map(Number);

        let currentMinutes = startHour * 60 + startMinute;
        const endMinutes = endHour * 60 + endMinute;

        // Start time should not equal closing time
        while (currentMinutes < endMinutes) {
            const hours = Math.floor(currentMinutes / 60);
            const minutes = currentMinutes % 60;

            const timeValue = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
            const period = hours >= 12 ? 'PM' : 'AM';
            const displayHours = hours % 12 || 12;
            const timeLabel = `${displayHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${period}`;

            slots.push({
                value: timeValue,
                label: timeLabel,
            });

            currentMinutes += intervalMinutes;
        }

        return slots;
    };

    /**
     * Validate booking selection
     * @param date - Selected date
     * @param startTime - Selected start time
     * @param endTime - Selected end time
     * @returns Object with validation result and error message
     */
    const validateBooking = (
        date: Date | null,
        startTime: string | null,
        endTime: string | null
    ): { isValid: boolean; error?: string } => {
        if (!date) {
            return { isValid: false, error: 'Please select a date' };
        }

        if (!startTime) {
            return { isValid: false, error: 'Please select a start time' };
        }

        if (!endTime) {
            return { isValid: false, error: 'Please select an end time' };
        }

        // Check if date is in the past
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const selectedDateOnly = new Date(date);
        selectedDateOnly.setHours(0, 0, 0, 0);

        if (selectedDateOnly < today) {
            return { isValid: false, error: 'Cannot book dates in the past' };
        }

        // Check if space is open on selected day
        if (spaceSchedule) {
            const dayOfWeek = date.getDay();
            if (!spaceSchedule.openDays.includes(dayOfWeek)) {
                return { isValid: false, error: 'Space is closed on this day' };
            }
        }

        // Check if end time is after start time
        const [startHour, startMinute] = startTime.split(':').map(Number);
        const [endHour, endMinute] = endTime.split(':').map(Number);
        const startMinutes = startHour * 60 + startMinute;
        const endMinutes = endHour * 60 + endMinute;

        if (endMinutes <= startMinutes) {
            return { isValid: false, error: 'End time must be after start time' };
        }

        // Check if times are within space operating hours
        if (spaceSchedule) {
            const [openHour, openMinute] = spaceSchedule.openTime.split(':').map(Number);
            const [closeHour, closeMinute] = spaceSchedule.closeTime.split(':').map(Number);
            const openMinutes = openHour * 60 + openMinute;
            const closeMinutes = closeHour * 60 + closeMinute;

            if (startMinutes < openMinutes || endMinutes > closeMinutes) {
                return {
                    isValid: false,
                    error: `Booking must be between ${spaceSchedule.openTime} and ${spaceSchedule.closeTime}`,
                };
            }
        }

        return { isValid: true };
    };

    /**
     * Calculate booking duration in hours
     */
    const calculateDuration = (startTime: string, endTime: string): number => {
        const [startHour, startMinute] = startTime.split(':').map(Number);
        const [endHour, endMinute] = endTime.split(':').map(Number);
        const startMinutes = startHour * 60 + startMinute;
        const endMinutes = endHour * 60 + endMinute;
        return (endMinutes - startMinutes) / 60;
    };

    /**
     * Calculate total price based on duration and hourly rate
     */
    const calculateTotalPrice = (
        startTime: string | null,
        endTime: string | null,
        pricePerHour: number
    ): number => {
        if (!startTime || !endTime) return 0;
        const duration = calculateDuration(startTime, endTime);
        return duration * pricePerHour;
    };

    // Generate all available time slots once
    const allTimeSlots = useMemo(() => {
        if (!spaceSchedule) {
            return generateTimeSlots('09:00', '18:00', 60);
        }
        return generateTimeSlots(spaceSchedule.openTime, spaceSchedule.closeTime, 60);
    }, [spaceSchedule]);

    // Memoized dates
    const dates = useMemo(() => generateDates(30), [spaceSchedule]);

    // Filter start times based on selected date and current time
    const startTimes = useMemo(() => {
        const baseSlots = allTimeSlots;

        if (!selectedDate) return baseSlots;

        const today = new Date();
        const selected = new Date(selectedDate);

        const isToday = selected.toDateString() === today.toDateString();

        if (!isToday) return baseSlots;

        // Filter out past times for today
        const nowMinutes = today.getHours() * 60 + today.getMinutes();

        return baseSlots.filter(slot => {
            const [h, m] = slot.value.split(':').map(Number);
            return h * 60 + m > nowMinutes;
        });
    }, [selectedDate, allTimeSlots]);

    // Filter end times based on selected start time
    const endTimes = useMemo(() => {
        if (!selectedStartTime) return [];

        const [startHour, startMinute] = selectedStartTime.split(':').map(Number);
        const startMinutes = startHour * 60 + startMinute;
        const minEndMinutes = startMinutes + 60; // Minimum 1 hour booking

        return allTimeSlots.filter(slot => {
            const [h, m] = slot.value.split(':').map(Number);
            return h * 60 + m >= minEndMinutes;
        });
    }, [selectedStartTime, allTimeSlots]);

    // Auto-reset end time when start time changes and becomes invalid
    useEffect(() => {
        if (!selectedStartTime || !selectedEndTime) return;

        const [startHour, startMinute] = selectedStartTime.split(':').map(Number);
        const [endHour, endMinute] = selectedEndTime.split(':').map(Number);
        const startMinutes = startHour * 60 + startMinute;
        const endMinutes = endHour * 60 + endMinute;

        if (endMinutes <= startMinutes + 60) {
            setSelectedEndTime(null);
        }
    }, [selectedStartTime, selectedEndTime]);

    return {
        // State
        selectedDate,
        selectedStartTime,
        selectedEndTime,
        setSelectedDate,
        setSelectedStartTime,
        setSelectedEndTime,

        // Derived UI data
        dates,
        startTimes,
        endTimes,

        // Validation & Calculations
        validateBooking,
        calculateDuration,
        calculateTotalPrice,
    };
};
