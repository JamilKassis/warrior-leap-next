export type BookingPackageType = 'home' | 'corporate' | 'gym' | 'event' | 'retreat' | 'content';
export type BookingServiceLevel = 'drop_off' | 'attended' | 'coached';
export type BookingZone = 'beirut' | 'mount_lebanon' | 'north' | 'south' | 'bekaa';
export type BookingStatus = 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';

export interface Booking {
  id: string;
  booking_number: string;

  customer_name: string;
  email: string;
  phone: string;

  event_date: string;
  event_time: string | null;
  duration_hours: number | null;
  guest_count: number | null;

  package_type: BookingPackageType;
  service_level: BookingServiceLevel;

  location_zone: BookingZone;
  location_address: string;

  addons: string[];

  estimated_total: number | null;
  deposit_paid: number | null;
  status: BookingStatus;

  notes: string | null;
  admin_notes: string | null;

  created_at: string;
  updated_at: string;
}

export interface CreateBookingData {
  customer_name: string;
  email: string;
  phone: string;
  event_date: string;
  event_time?: string;
  duration_hours?: number;
  guest_count?: number;
  package_type: BookingPackageType;
  service_level: BookingServiceLevel;
  location_zone: BookingZone;
  location_address: string;
  addons?: string[];
  notes?: string;
}

export interface UpdateBookingData {
  status?: BookingStatus;
  estimated_total?: number;
  deposit_paid?: number;
  admin_notes?: string;
  event_date?: string;
  event_time?: string;
  duration_hours?: number;
  guest_count?: number;
}

export interface BookingsFilters {
  status?: BookingStatus;
  package_type?: BookingPackageType;
  zone?: BookingZone;
  date_from?: string;
  date_to?: string;
  search?: string;
}

export interface BookingStats {
  totalBookings: number;
  pendingBookings: number;
  confirmedBookings: number;
  completedBookings: number;
  upcomingBookings: number;
  monthBookings: number;
  totalRevenue: number;
}

export const BOOKING_STATUS_CONFIG: Record<BookingStatus, { label: string; color: string }> = {
  pending: { label: 'Pending', color: 'yellow' },
  confirmed: { label: 'Confirmed', color: 'blue' },
  in_progress: { label: 'In Progress', color: 'purple' },
  completed: { label: 'Completed', color: 'green' },
  cancelled: { label: 'Cancelled', color: 'red' },
};

export const ZONE_LABELS: Record<BookingZone, string> = {
  beirut: 'Beirut',
  mount_lebanon: 'Mount Lebanon',
  north: 'North Lebanon',
  south: 'South Lebanon',
  bekaa: 'Bekaa',
};

export const SERVICE_LEVEL_LABELS: Record<BookingServiceLevel, string> = {
  drop_off: 'Drop-Off',
  attended: 'Attended',
  coached: 'Coached',
};
