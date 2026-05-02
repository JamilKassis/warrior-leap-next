'use client';

import { useState, useEffect } from 'react';
import { useBookings } from '@/hooks/use-bookings';
import {
  Booking,
  BookingStatus,
  BookingPackageType,
  BookingZone,
  BookingsFilters,
  BookingStats,
  BOOKING_STATUS_CONFIG,
  ZONE_LABELS,
  SERVICE_LEVEL_LABELS,
} from '@/types/bookings';
import { RENT_PACKAGES, RENT_ADDONS } from '@/data/rent-packages';
import {
  CalendarDaysIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  PencilSquareIcon,
  TrashIcon,
  XCircleIcon,
  ClockIcon,
  CheckCircleIcon,
  ChartBarIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  UsersIcon,
  EyeIcon,
} from '@heroicons/react/24/outline';

interface ViewModal {
  isOpen: boolean;
  booking: Booking | null;
}

interface DeleteConfirmModal {
  isOpen: boolean;
  booking: Booking | null;
}

const PACKAGE_LABELS: Record<BookingPackageType, string> =
  RENT_PACKAGES.reduce((acc, p) => ({ ...acc, [p.slug]: p.title }), {} as Record<BookingPackageType, string>);

export function BookingsManagement() {
  const { bookings, loading, error, fetchBookings, updateBooking, deleteBooking, getBookingStats } = useBookings();
  const [filters, setFilters] = useState<BookingsFilters>({});
  const [showFilters, setShowFilters] = useState(false);
  const [stats, setStats] = useState<BookingStats | null>(null);
  const [viewModal, setViewModal] = useState<ViewModal>({ isOpen: false, booking: null });
  const [deleteConfirmModal, setDeleteConfirmModal] = useState<DeleteConfirmModal>({ isOpen: false, booking: null });
  const [saving, setSaving] = useState(false);

  // Edit fields in the view modal
  const [editStatus, setEditStatus] = useState<BookingStatus>('pending');
  const [editTotal, setEditTotal] = useState<string>('');
  const [editAdminNotes, setEditAdminNotes] = useState('');

  useEffect(() => {
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadAll = async () => {
    try {
      await fetchBookings(filters);
      const s = await getBookingStats();
      setStats(s);
    } catch (err) {
      console.error('Error loading bookings:', err);
    }
  };

  const handleFilterChange = (key: keyof BookingsFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value || undefined }));
  };

  const handleApplyFilters = () => fetchBookings(filters);
  const handleClearFilters = () => { setFilters({}); fetchBookings(); };

  const openView = (booking: Booking) => {
    setEditStatus(booking.status);
    setEditTotal(booking.estimated_total != null ? String(booking.estimated_total) : '');
    setEditAdminNotes(booking.admin_notes || '');
    setViewModal({ isOpen: true, booking });
  };

  const handleSaveEdits = async () => {
    if (!viewModal.booking) return;
    setSaving(true);
    try {
      await updateBooking(viewModal.booking.id, {
        status: editStatus,
        estimated_total: editTotal ? Number(editTotal) : undefined,
        admin_notes: editAdminNotes,
      });
      setViewModal({ isOpen: false, booking: null });
      loadAll();
    } catch (err) {
      console.error('Error updating booking:', err);
      alert('Failed to update booking');
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteConfirmModal.booking) return;
    setSaving(true);
    try {
      await deleteBooking(deleteConfirmModal.booking.id);
      setDeleteConfirmModal({ isOpen: false, booking: null });
      loadAll();
    } catch (err) {
      console.error('Error deleting booking:', err);
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (dateString: string) =>
    new Date(dateString + (dateString.length <= 10 ? 'T00:00:00' : '')).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
    });

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(amount);

  const getStatusBadge = (status: BookingStatus) => {
    const cfg = BOOKING_STATUS_CONFIG[status];
    const colorMap: Record<string, string> = {
      yellow: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      blue: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      purple: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      green: 'bg-green-500/20 text-green-400 border-green-500/30',
      red: 'bg-red-500/20 text-red-400 border-red-500/30',
    };
    return (
      <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${colorMap[cfg.color]}`}>
        {cfg.label}
      </span>
    );
  };

  // ─── Loading / Error ──
  if (loading && bookings.length === 0 && !stats) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-16 h-16 border-4 border-brand-primary/20 border-t-brand-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (error && bookings.length === 0) {
    return (
      <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
        <div className="flex">
          <XCircleIcon className="h-5 w-5 text-red-400" />
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-300">Error loading bookings</h3>
            <p className="mt-1 text-sm text-red-400">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Bookings</h1>
          <p className="text-sm text-gray-400 mt-1">Mobile ice bath rental requests & event bookings</p>
        </div>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
          <StatCard icon={<ChartBarIcon className="h-5 w-5" />} label="Total" value={stats.totalBookings} accent="brand-primary" />
          <StatCard icon={<ClockIcon className="h-5 w-5" />} label="Pending" value={stats.pendingBookings} accent="yellow-400" />
          <StatCard icon={<CheckCircleIcon className="h-5 w-5" />} label="Confirmed" value={stats.confirmedBookings} accent="blue-400" />
          <StatCard icon={<CalendarDaysIcon className="h-5 w-5" />} label="Upcoming" value={stats.upcomingBookings} accent="purple-400" />
          <StatCard icon={<CheckCircleIcon className="h-5 w-5" />} label="Revenue" value={formatCurrency(stats.totalRevenue)} accent="green-400" />
        </div>
      )}

      {/* Filter bar */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, phone, booking #"
              value={filters.search || ''}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleApplyFilters()}
              className="w-full pl-9 pr-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder-gray-500 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/30"
            />
          </div>
          <button
            onClick={() => setShowFilters(s => !s)}
            className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-gray-300 hover:bg-white/10 transition-all text-sm font-medium flex items-center gap-1.5"
          >
            <FunnelIcon className="h-4 w-4" /> Filters
          </button>
          <button
            onClick={handleApplyFilters}
            className="px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90 transition-all text-sm font-medium"
          >
            Apply
          </button>
          {(filters.status || filters.package_type || filters.zone || filters.date_from || filters.date_to || filters.search) && (
            <button
              onClick={handleClearFilters}
              className="px-3 py-2 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg hover:bg-red-500/20 transition-all text-sm font-medium"
            >
              Clear
            </button>
          )}
        </div>

        {showFilters && (
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-2 mt-3">
            <select
              value={filters.status || ''}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-brand-primary"
            >
              <option value="" className="bg-brand-dark">All statuses</option>
              {Object.entries(BOOKING_STATUS_CONFIG).map(([key, { label }]) => (
                <option key={key} value={key} className="bg-brand-dark">{label}</option>
              ))}
            </select>
            <select
              value={filters.package_type || ''}
              onChange={(e) => handleFilterChange('package_type', e.target.value)}
              className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-brand-primary"
            >
              <option value="" className="bg-brand-dark">All packages</option>
              {Object.entries(PACKAGE_LABELS).map(([key, label]) => (
                <option key={key} value={key} className="bg-brand-dark">{label}</option>
              ))}
            </select>
            <select
              value={filters.zone || ''}
              onChange={(e) => handleFilterChange('zone', e.target.value)}
              className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-brand-primary"
            >
              <option value="" className="bg-brand-dark">All zones</option>
              {Object.entries(ZONE_LABELS).map(([key, label]) => (
                <option key={key} value={key} className="bg-brand-dark">{label}</option>
              ))}
            </select>
            <input
              type="date"
              value={filters.date_from || ''}
              onChange={(e) => handleFilterChange('date_from', e.target.value)}
              className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-brand-primary"
            />
            <input
              type="date"
              value={filters.date_to || ''}
              onChange={(e) => handleFilterChange('date_to', e.target.value)}
              className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-brand-primary"
            />
          </div>
        )}
      </div>

      {/* Empty */}
      {!loading && bookings.length === 0 && (
        <div className="bg-white/5 border border-white/10 rounded-xl p-12 text-center">
          <CalendarDaysIcon className="w-12 h-12 text-gray-500 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-white mb-1">No bookings yet</h3>
          <p className="text-sm text-gray-400">Booking requests submitted via the rent page will appear here.</p>
        </div>
      )}

      {/* List */}
      <div className="space-y-2">
        {bookings.map(b => (
          <article
            key={b.id}
            className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/[0.07] transition-colors"
          >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1.5">
                  <span className="text-white font-medium">{b.customer_name}</span>
                  <span className="font-mono text-xs text-gray-500">{b.booking_number}</span>
                  {getStatusBadge(b.status)}
                </div>
                <div className="flex items-center gap-x-4 gap-y-1 flex-wrap text-xs text-gray-400">
                  <span className="flex items-center gap-1"><CalendarDaysIcon className="w-3.5 h-3.5" />{formatDate(b.event_date)}{b.event_time ? ` · ${b.event_time}` : ''}</span>
                  <span className="flex items-center gap-1"><MapPinIcon className="w-3.5 h-3.5" />{ZONE_LABELS[b.location_zone]}</span>
                  <span className="flex items-center gap-1"><UsersIcon className="w-3.5 h-3.5" />{b.guest_count || '—'} guests</span>
                  <span>{PACKAGE_LABELS[b.package_type]} · {SERVICE_LEVEL_LABELS[b.service_level]}</span>
                </div>
                <div className="flex items-center gap-x-3 gap-y-1 flex-wrap text-xs text-gray-500 mt-1.5">
                  <a href={`tel:${b.phone}`} className="flex items-center gap-1 hover:text-brand-primary"><PhoneIcon className="w-3.5 h-3.5" />{b.phone}</a>
                  <a href={`mailto:${b.email}`} className="flex items-center gap-1 hover:text-brand-primary"><EnvelopeIcon className="w-3.5 h-3.5" />{b.email}</a>
                  {b.estimated_total != null && <span className="text-green-400 font-medium">{formatCurrency(b.estimated_total)}</span>}
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => openView(b)}
                  className="px-3 py-1.5 bg-brand-primary/10 text-brand-light border border-brand-primary/30 rounded-lg hover:bg-brand-primary/20 transition-all text-xs font-medium flex items-center gap-1.5"
                >
                  <EyeIcon className="w-3.5 h-3.5" /> View
                </button>
                <button
                  onClick={() => setDeleteConfirmModal({ isOpen: true, booking: b })}
                  className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                  aria-label="Delete"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* View / Edit Modal */}
      {viewModal.isOpen && viewModal.booking && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-brand-dark rounded-xl p-5 max-w-xl w-full shadow-2xl border border-white/10 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-white">Booking details</h3>
                <p className="text-xs text-gray-400 font-mono">{viewModal.booking.booking_number}</p>
              </div>
              <button
                onClick={() => setViewModal({ isOpen: false, booking: null })}
                className="p-1 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/10"
              >
                <XCircleIcon className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <DetailGrid booking={viewModal.booking} />

              {viewModal.booking.notes && (
                <DetailBlock label="Customer notes">{viewModal.booking.notes}</DetailBlock>
              )}

              {viewModal.booking.addons && viewModal.booking.addons.length > 0 && (
                <DetailBlock label="Add-ons">
                  {viewModal.booking.addons
                    .map(slug => RENT_ADDONS.find(a => a.slug === slug)?.label || slug)
                    .join(', ')}
                </DetailBlock>
              )}

              <div className="border-t border-white/10 pt-4 space-y-3">
                <h4 className="text-xs uppercase tracking-wider text-brand-primary/90 mb-2">Admin</h4>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Status</label>
                    <select
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value as BookingStatus)}
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-brand-primary"
                    >
                      {Object.entries(BOOKING_STATUS_CONFIG).map(([k, { label }]) => (
                        <option key={k} value={k} className="bg-brand-dark">{label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Estimated total (USD)</label>
                    <input
                      type="number"
                      step="1"
                      min="0"
                      value={editTotal}
                      onChange={(e) => setEditTotal(e.target.value)}
                      placeholder="0"
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-brand-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-gray-400 mb-1">Admin notes</label>
                  <textarea
                    rows={3}
                    value={editAdminNotes}
                    onChange={(e) => setEditAdminNotes(e.target.value)}
                    placeholder="Internal notes — not visible to customer"
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-brand-primary resize-none"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-5 pt-3 border-t border-white/10">
              <button
                onClick={() => setViewModal({ isOpen: false, booking: null })}
                disabled={saving}
                className="px-4 py-2 text-gray-300 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all text-sm font-medium disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdits}
                disabled={saving}
                className="px-5 py-2 text-white bg-brand-primary rounded-lg hover:bg-brand-primary/90 transition-all text-sm font-medium flex items-center gap-1.5 disabled:opacity-50"
              >
                <PencilSquareIcon className="w-4 h-4" />
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteConfirmModal.isOpen && deleteConfirmModal.booking && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-brand-dark rounded-xl p-5 max-w-sm w-full shadow-2xl border border-white/10">
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-500/15 rounded-full">
              <TrashIcon className="w-6 h-6 text-red-400" />
            </div>
            <h3 className="text-lg font-bold text-white mb-3 text-center">Delete booking</h3>
            <p className="text-sm text-gray-300 mb-4 text-center">
              Delete <span className="font-semibold text-white">{deleteConfirmModal.booking.booking_number}</span> from {deleteConfirmModal.booking.customer_name}?
            </p>
            <p className="text-xs text-red-400 font-medium text-center mb-4">This cannot be undone.</p>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setDeleteConfirmModal({ isOpen: false, booking: null })}
                disabled={saving}
                className="px-4 py-2 text-gray-300 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all text-sm font-medium disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={saving}
                className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition-all text-sm font-medium flex items-center gap-1.5 disabled:opacity-50"
              >
                <TrashIcon className="w-3.5 h-3.5" />
                {saving ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ icon, label, value, accent }: { icon: React.ReactNode; label: string; value: number | string; accent: string }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-3 sm:p-4">
      <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
        <span className={`text-${accent}`}>{icon}</span>
        {label}
      </div>
      <div className="text-xl sm:text-2xl font-bold text-white">{value}</div>
    </div>
  );
}

function DetailGrid({ booking }: { booking: Booking }) {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-3">
      <Detail label="Customer">{booking.customer_name}</Detail>
      <Detail label="Submitted">{new Date(booking.created_at).toLocaleString()}</Detail>
      <Detail label="Phone"><a href={`tel:${booking.phone}`} className="text-brand-primary">{booking.phone}</a></Detail>
      <Detail label="Email"><a href={`mailto:${booking.email}`} className="text-brand-primary">{booking.email}</a></Detail>
      <Detail label="Package">{PACKAGE_LABELS[booking.package_type]}</Detail>
      <Detail label="Service level">{SERVICE_LEVEL_LABELS[booking.service_level]}</Detail>
      <Detail label="Event date">{new Date(booking.event_date + 'T00:00:00').toLocaleDateString()} {booking.event_time ? `· ${booking.event_time}` : ''}</Detail>
      <Detail label="Duration">{booking.duration_hours ? `${booking.duration_hours}h` : '—'}</Detail>
      <Detail label="Guests">{booking.guest_count || '—'}</Detail>
      <Detail label="Zone">{ZONE_LABELS[booking.location_zone]}</Detail>
      <div className="col-span-2">
        <Detail label="Address">{booking.location_address}</Detail>
      </div>
    </div>
  );
}

function Detail({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-xs text-gray-500 uppercase tracking-wider mb-0.5">{label}</div>
      <div className="text-sm text-white">{children}</div>
    </div>
  );
}

function DetailBlock({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="bg-white/[0.03] border border-white/5 rounded-lg p-3">
      <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">{label}</div>
      <div className="text-sm text-white whitespace-pre-wrap">{children}</div>
    </div>
  );
}
