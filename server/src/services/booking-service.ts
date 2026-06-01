import { v4 as uuid } from 'uuid';
import type {
  Booking,
  BookingStatus,
  PaginatedResult,
} from '../types/index.js';
import { VALID_TRANSITIONS } from '../types/index.js';
import { store } from '../store/memory-store.js';
import { eventBus } from './event-emitter.js';

interface ListBookingsParams {
  tenantId: string;
  page: number;
  limit: number;
  date?: string;
  status?: BookingStatus;
}

interface CreateBookingParams {
  tenantId: string;
  petId: string;
  sitterId: string;
  scheduledDate: string;
  startTime: string;
  endTime: string;
  notes: string;
  createdBy: string;
}
const toInterval = (
  date: string,
  startTime: string,
  endTime: string,
): { start: Date; end: Date } => {
  const result = {
    start: new Date(`${date}T${startTime}`),
    end: new Date(`${date}T${endTime}`),
  };
  if (result.end <= result.start) {
    // result.end should be next day
    result.end = new Date(result.end.getTime() + 24 * 60 * 60 * 1000);
  }
  return result;
};

export class BookingService {
  /**
   * List bookings for a tenant with optional date and status filters.
   * Supports pagination.
   */
  public listBookings(params: ListBookingsParams): PaginatedResult<Booking> {
    const { tenantId, page, limit, date, status } = params;

    let bookings = store.getBookingsByTenant(tenantId);

    // Filter by date if provided
    if (date) {
      // Match bookings on the requested date
      bookings = bookings.filter((b) => b.scheduledDate.startsWith(date));
    }

    // Filter by status if provided
    if (status) {
      bookings = bookings.filter((b) => b.status === status);
    }

    // Sort by scheduled date descending (newest first)
    bookings.sort(
      (a, b) =>
        new Date(b.scheduledDate).getTime() -
        new Date(a.scheduledDate).getTime(),
    );

    const total = bookings.length;
    const totalPages = Math.ceil(total / limit);

    const offset = page * limit;
    const paginatedBookings = bookings.slice(offset, offset + limit);

    return {
      data: paginatedBookings,
      total,
      page,
      limit,
      totalPages,
    };
  }

  /**
   * Create a new booking.
   * Checks for overlapping bookings with the same sitter.
   */
  public async createBooking(params: CreateBookingParams): Promise<Booking> {
    const {
      tenantId,
      petId,
      sitterId,
      scheduledDate,
      startTime,
      endTime,
      notes,
      createdBy,
    } = params;

    const pet = store.getPet(petId);
    const sitter = store.getSitter(sitterId);
    if (
      !pet ||
      !sitter ||
      pet.tenantId !== tenantId ||
      sitter.tenantId !== tenantId
    ) {
      throw new Error('Pet or sitter not found');
    }

    // Check for overlapping bookings with the same sitter or pet
    const candidates = store
      .getAllBookings()
      .filter(
        (b) =>
          b.tenantId === tenantId &&
          b.status !== 'cancelled' &&
          (b.sitterId === sitterId || b.petId === petId),
      );

    const newInterval = toInterval(scheduledDate, startTime, endTime);
    const hasOverlap = candidates.some((b) => {
      const existing = toInterval(b.scheduledDate, b.startTime, b.endTime);
      return (
        newInterval.start < existing.end && newInterval.end > existing.start
      );
    });

    if (hasOverlap) {
      throw new Error(
        'Sitter or pet has an overlapping booking for this time slot',
      );
    }

    // Simulate async operation (like a database write)
    await new Promise((resolve) => setTimeout(resolve, 10));

    const now = new Date().toISOString();
    const booking: Booking = {
      id: `booking_${uuid().slice(0, 8)}`,
      tenantId,
      petId,
      sitterId,
      status: 'requested',
      scheduledDate,
      startTime,
      endTime,
      notes,
      createdAt: now,
      updatedAt: now,
      statusChangedAt: now,
      statusChangedBy: createdBy,
    };

    store.createBooking(booking);

    eventBus.emit('booking.created', {
      bookingId: booking.id,
      tenantId: booking.tenantId,
      petId: booking.petId,
      sitterId: booking.sitterId,
    });

    return booking;
  }

  /**
   * Update booking status with transition validation.
   */
  public updateStatus(
    bookingId: string,
    newStatus: BookingStatus,
    changedBy: string,
    tenantId: string,
  ): { success: boolean; booking?: Booking; error?: string } {
    const booking = store.getBooking(bookingId);

    if (!booking || booking.tenantId !== tenantId) {
      // slightly opaque error message to prevent exposing unnecessary information
      return { success: false, error: 'Booking not found' };
    }

    const allowedTransitions = VALID_TRANSITIONS[booking.status];
    if (!allowedTransitions.includes(newStatus)) {
      return {
        success: false,
        error: `Cannot transition from '${booking.status}' to '${newStatus}'`,
      };
    }

    // Overwrite status — no history kept
    const updatedBooking: Booking = {
      ...booking,
      status: newStatus,
      updatedAt: new Date().toISOString(),
      statusChangedAt: new Date().toISOString(),
      statusChangedBy: changedBy,
    };

    store.updateBooking(updatedBooking);

    // Overwrite status and notify listeners
    eventBus.emit('booking.statusChanged', {
      bookingId: updatedBooking.id,
      previousStatus: booking.status,
      newStatus,
      changedBy,
    });

    return { success: true, booking: updatedBooking };
  }

  /**
   * Get a single booking by ID.
   */
  public getBooking(bookingId: string, tenantId: string): Booking | undefined {
    const booking = store.getBooking(bookingId);
    if (!booking || booking.tenantId !== tenantId) {
      return undefined;
    }
    return booking;
  }
}

export const bookingService = new BookingService();
