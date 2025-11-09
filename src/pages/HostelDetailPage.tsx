import { ChangeEvent, FormEvent, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAsync } from '../hooks/useAsync';
import {
  createHostelBooking,
  fetchHostelDetail,
  type HostelDetail,
  type PublicBookingConfirmation,
} from '../lib/api';

export default function HostelDetailPage() {
  const { id } = useParams<{ id: string }>();
  const hostelId = Number(id);

  const { data, loading, error } = useAsync<HostelDetail>(() => fetchHostelDetail(hostelId), [hostelId]);
  const initialFormState = {
    fullName: '',
    email: '',
    phone: '',
    paymentPhone: '',
    gender: '',
    course: '',
    preferredCheckIn: '',
    stayDuration: '',
    notes: '',
  };
  const [formState, setFormState] = useState(initialFormState);
  const [submitting, setSubmitting] = useState(false);
  const [bookingResult, setBookingResult] = useState<PublicBookingConfirmation | null>(null);
  const [bookingError, setBookingError] = useState<string | null>(null);

  if (Number.isNaN(hostelId)) {
    return (
      <div className="container py-20 text-center">
        <h1 className="text-3xl font-semibold text-slate-900">Invalid request</h1>
        <p className="mt-2 text-sm text-slate-500">The hostel identifier is missing or invalid.</p>
        <Link
          to="/universities"
          className="mt-6 inline-flex items-center rounded-full bg-sky-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-sky-500"
        >
          Browse universities
        </Link>
      </div>
    );
  }

  if (loading && !data) {
    return (
      <div className="container space-y-8 py-20">
        <div className="h-72 animate-pulse rounded-3xl bg-slate-200" />
        <div className="grid gap-6 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="animate-pulse overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
            >
              <div className="aspect-[16/9] bg-slate-200" />
              <div className="space-y-4 p-6">
                <div className="h-5 w-2/3 rounded bg-slate-200" />
                <div className="h-3 w-full rounded bg-slate-200" />
                <div className="h-3 w-3/5 rounded bg-slate-200" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="container py-20 text-center">
        <h1 className="text-3xl font-semibold text-slate-900">Hostel not found</h1>
        <p className="mt-2 text-sm text-slate-500">
          {error
            ? `We couldn't load this hostel because: ${error}`
            : 'This hostel may have been unpublished or is not yet available on the public portal.'}
        </p>
        <Link
          to="/universities"
          className="mt-6 inline-flex items-center rounded-full bg-sky-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-sky-500"
        >
          Browse universities
        </Link>
      </div>
    );
  }

  const hostel = data;
  const university = {
    id: hostel.universityId ?? undefined,
    name: hostel.universityName ?? 'Partner University',
    code: hostel.universityCode ?? 'RMI',
    address: hostel.universityAddress ?? '',
  };

  const amenities = hostel.amenities ?? [];
  const heroImage =
    hostel.primaryImage ??
    'https://images.unsplash.com/photo-1523217582562-09d0def993a6?auto=format&fit=crop&w=900&q=80';
  const bookingFee =
    typeof hostel.bookingFee === 'number' && Number.isFinite(hostel.bookingFee)
      ? hostel.bookingFee
      : null;
  const bookingFeeLabel = bookingFee ? `UGX ${Number(bookingFee).toLocaleString()}` : 'Not set';
  const bookingDisabled = bookingFee === null;

  const handleInputChange =
    (field: keyof typeof formState) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const value = event.target.value;
      setFormState((prev) => {
        if (field === 'phone') {
          const shouldMirrorPaymentPhone = !prev.paymentPhone || prev.paymentPhone === prev.phone;
          return {
            ...prev,
            phone: value,
            paymentPhone: shouldMirrorPaymentPhone ? value : prev.paymentPhone,
          };
        }
        return {
          ...prev,
          [field]: value,
        };
      });
    };

  const handleBookingSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (bookingDisabled) {
      setBookingError('This hostel has not enabled online bookings yet.');
      return;
    }
    if (!formState.fullName.trim() || !formState.phone.trim()) {
      setBookingError('Please provide your full name and a phone number we can reach.');
      return;
    }

    setSubmitting(true);
    setBookingError(null);
    try {
      const confirmation = await createHostelBooking(hostelId, {
        fullName: formState.fullName.trim(),
        email: formState.email.trim() || undefined,
        phone: formState.phone.trim(),
        paymentPhone: formState.paymentPhone.trim() || formState.phone.trim(),
        gender: formState.gender || undefined,
        course: formState.course.trim() || undefined,
        preferredCheckIn: formState.preferredCheckIn || undefined,
        stayDuration: formState.stayDuration.trim() || undefined,
        notes: formState.notes.trim() || undefined,
      });
      setBookingResult(confirmation);
      setFormState(initialFormState);
    } catch (submitError) {
      setBookingResult(null);
      setBookingError(
        submitError instanceof Error
          ? submitError.message
          : 'We could not submit your booking. Please try again.',
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pb-20">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImage} alt={hostel.name} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-slate-900/70 to-slate-900/60" />
        </div>

        <div className="container relative z-10 flex flex-col gap-8 py-24 text-white lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl space-y-5">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-wide">
              {university.name}
            </span>
            <h1 className="text-4xl font-bold sm:text-5xl">{hostel.name}</h1>
            <p className="text-sm text-slate-200">{hostel.address}</p>
            <p className="text-sm leading-relaxed text-slate-200/90">{hostel.description}</p>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-200/80">
              {typeof hostel.distanceFromCampus === 'number' && (
                <span>📍 {hostel.distanceFromCampus} km to campus</span>
              )}
              <span>🏠 {hostel.availableRooms} rooms available</span>
              <span>
                💰{' '}
                {hostel.pricePerRoom
                  ? `UGX ${Number(hostel.pricePerRoom).toLocaleString()}`
                  : 'Contact for pricing'}
                {hostel.pricePerRoom && <span className="opacity-70">/ semester</span>}
              </span>
              {bookingFee !== null && <span>💳 Booking fee {bookingFeeLabel}</span>}
            </div>
          </div>

          {university.id ? (
            <Link
              to={`/universities/${university.id}`}
              className="inline-flex items-center gap-2 rounded-full border border-white/30 px-5 py-2 text-sm font-medium text-white transition hover:bg-white/10"
            >
              ← Back to {university.code}
            </Link>
          ) : (
            <Link
              to="/universities"
              className="inline-flex items-center gap-2 rounded-full border border-white/30 px-5 py-2 text-sm font-medium text-white transition hover:bg-white/10"
            >
              ← Browse universities
            </Link>
          )}
        </div>
      </section>

      <section className="container mt-12 grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <div className="space-y-8">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Amenities & highlights</h2>
            <p className="mt-2 text-sm text-slate-500">
              Everything residents can expect when they book a stay at {hostel.name}.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {amenities.length > 0 ? (
                amenities.map((amenity) => (
                  <span
                    key={amenity}
                    className="rounded-full bg-sky-50 px-3 py-1 text-xs font-medium text-sky-600"
                  >
                    {amenity}
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-500">Amenities information coming soon.</span>
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Book a room</h2>
            <p className="mt-2 text-sm text-slate-500">
              Secure your slot at {hostel.name}. A non-refundable booking fee of{' '}
              <span className="font-semibold text-sky-600">{bookingFeeLabel}</span> is required.
              RooMio will send payment instructions to the phone number you provide.
            </p>
            <form onSubmit={handleBookingSubmit} className="mt-6 grid gap-4">
              {bookingResult && (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50/80 px-4 py-3 text-sm text-emerald-700">
                  <p className="font-semibold">Booking received!</p>
                  <p className="mt-1">
                    Reference: <span className="font-mono">{bookingResult.paymentReference}</span>
                  </p>
                  <p className="mt-1 text-xs text-emerald-600/80">
                    Keep this reference handy while completing the payment.
                  </p>
                </div>
              )}
              {bookingError && (
                <div className="rounded-2xl border border-rose-200 bg-rose-50/80 px-4 py-3 text-sm text-rose-600">
                  {bookingError}
                </div>
              )}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <input
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-200"
                  placeholder="Your full name *"
                  type="text"
                  value={formState.fullName}
                  onChange={handleInputChange('fullName')}
                  required
                  disabled={bookingDisabled || submitting}
                />
                <input
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-200"
                  placeholder="Course / faculty"
                  type="text"
                  value={formState.course}
                  onChange={handleInputChange('course')}
                  disabled={bookingDisabled || submitting}
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <input
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-200"
                  placeholder="Email address"
                  type="email"
                  value={formState.email}
                  onChange={handleInputChange('email')}
                  disabled={bookingDisabled || submitting}
                />
                <select
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600 outline-none transition focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-200"
                  value={formState.gender}
                  onChange={handleInputChange('gender')}
                  disabled={bookingDisabled || submitting}
                >
                  <option value="">Gender (optional)</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="mixed">Prefer not to say</option>
                </select>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <input
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-200"
                  placeholder="Primary phone number *"
                  type="tel"
                  value={formState.phone}
                  onChange={handleInputChange('phone')}
                  required
                  disabled={bookingDisabled || submitting}
                />
                <input
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-200"
                  placeholder="Payment phone (if different)"
                  type="tel"
                  value={formState.paymentPhone}
                  onChange={handleInputChange('paymentPhone')}
                  disabled={bookingDisabled || submitting}
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label className="flex flex-col gap-2 text-xs font-medium uppercase tracking-wide text-slate-500">
                  Preferred check-in
                  <input
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-200"
                    type="date"
                    value={formState.preferredCheckIn}
                    onChange={handleInputChange('preferredCheckIn')}
                    disabled={bookingDisabled || submitting}
                  />
                </label>
                <input
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-200"
                  placeholder="Stay duration (e.g., Full semester)"
                  type="text"
                  value={formState.stayDuration}
                  onChange={handleInputChange('stayDuration')}
                  disabled={bookingDisabled || submitting}
                />
              </div>

              <textarea
                className="min-h-[120px] rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-200"
                placeholder="Share any room preferences or notes for the hostel team."
                value={formState.notes}
                onChange={handleInputChange('notes')}
                disabled={bookingDisabled || submitting}
              />

              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-full bg-sky-600 px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-sky-500 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500"
                disabled={bookingDisabled || submitting}
              >
                {submitting ? 'Processing...' : `Submit & Pay ${bookingFeeLabel}`}
              </button>
              {bookingDisabled && (
                <p className="text-xs text-rose-500">
                  This hostel has not set a public booking fee yet. Please check back later or contact the hostel
                  directly.
                </p>
              )}
            </form>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">University insights</h3>
            <p className="mt-2 text-sm text-slate-500">
              Managed in partnership with {university.name}. Admins keep listings updated for accurate
              student bookings.
            </p>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-2">
                <dt className="text-slate-500">University code</dt>
                <dd className="font-semibold text-slate-900">{university.code}</dd>
              </div>
              {university.address && (
                <div className="rounded-2xl bg-slate-50 px-4 py-2 text-slate-500">
                  <dt>Address</dt>
                  <dd className="font-semibold text-slate-900">{university.address}</dd>
                </div>
              )}
            </dl>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">Explore more hostels</h3>
            <p className="mt-2 text-sm text-slate-500">
              Other units around {university.name} you might want to tour.
            </p>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="text-xs text-slate-500">
                Additional hostels from this university will appear here as they are published.
              </li>
            </ul>
          </div>
        </aside>
      </section>
    </div>
  );
}

