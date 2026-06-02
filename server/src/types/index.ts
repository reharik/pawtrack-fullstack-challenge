export interface Tenant {
  id: string;
  name: string;
  timezone: string;
}

export interface Pet {
  id: string;
  tenantId: string;
  name: string;
  species: 'dog' | 'cat' | 'bird' | 'rabbit' | 'other';
  breed: string;
  ownerName: string;
  ownerPhone: string;
  notes: string;
}

export type BookingStatus = 'requested' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';

export interface StatusChange {
  from: BookingStatus;
  to: BookingStatus;
  changedAt: string;
  changedBy: string;
}
export interface Booking {
  id: string;
  tenantId: string;
  petId: string;
  sitterId: string;
  status: BookingStatus;
  scheduledDate: string;
  startTime: string;
  endTime: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
  statusChangedAt: string;
  statusChangedBy: string;
  statusHistory: StatusChange[]
}

export interface Sitter {
  id: string;
  tenantId: string;
  name: string;
  email: string;
  phone: string;
}

export interface AuthContext {
  tenantId: string;
  userId: string;
  role: 'admin' | 'staff' | 'sitter';
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PageInput {
  page: number;
  limit: number;
}

// Valid status transitions
export const VALID_TRANSITIONS: Record<BookingStatus, BookingStatus[]> = {
  requested: ['confirmed', 'cancelled'],
  confirmed: ['in_progress', 'cancelled'],
  in_progress: ['completed'],
  completed: [],
  cancelled: [],
};
