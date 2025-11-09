import { Link, useParams } from 'react-router-dom';
import { useAsync } from '../hooks/useAsync';
import {
  fetchUniversityHostels,
  type HostelSummary,
  type UniversitySummary,
} from '../lib/api';

export default function UniversityDetailPage() {
  const { id } = useParams<{ id: string }>();
  const universityId = Number(id);

  const { data, loading, error } = useAsync<{
    university: UniversitySummary;
    hostels: HostelSummary[];
  }>(() => fetchUniversityHostels(universityId), [universityId]);

  if (Number.isNaN(universityId)) {
    return (
      <div className="container py-20 text-center">
        <h1 className="text-3xl font-semibold text-slate-900">Invalid request</h1>
        <p className="mt-2 text-sm text-slate-500">
          The university identifier is missing or malformed.
        </p>
        <Link
          to="/universities"
          className="mt-6 inline-flex items-center rounded-full bg-sky-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-sky-500"
        >
          Back to universities
        </Link>
      </div>
    );
  }

  if (loading && !data) {
    return (
      <div className="container space-y-8 py-20">
        <div className="h-64 animate-pulse rounded-3xl bg-slate-200" />
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
                <div className="h-3 w-4/5 rounded bg-slate-200" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="container py-20 text-center">
        <h1 className="text-3xl font-semibold text-slate-900">University not found</h1>
        <p className="mt-2 text-sm text-slate-500">
          {error
            ? `We couldn't load the university because: ${error}`
            : 'The university you are looking for may have been unpublished or removed.'}
        </p>
        <Link
          to="/universities"
          className="mt-6 inline-flex items-center rounded-full bg-sky-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-sky-500"
        >
          Back to universities
        </Link>
      </div>
    );
  }

  const { university, hostels } = data;
  const heroImage =
    hostels.find((item) => item.primaryImage)?.primaryImage ??
    'https://images.unsplash.com/photo-1460518451285-97b6aa326961?auto=format&fit=crop&w=1200&q=80';

  return (
    <div className="pb-20">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt={university.name}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-slate-900/70 to-slate-900/60" />
        </div>

        <div className="relative z-10 container flex flex-col gap-6 py-24 text-white md:flex-row md:items-end md:justify-between">
          <div className="space-y-4">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-wide">
              RooMio Partner University
            </span>
            <h1 className="text-4xl font-bold sm:text-5xl">{university.name}</h1>
            <p className="max-w-2xl text-sm text-slate-200">{university.address}</p>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-200/90">
              {university.contactEmail && (
                <span>
                  Email: <span className="font-semibold">{university.contactEmail}</span>
                </span>
              )}
              {university.contactPhone && (
                <span>
                  Phone:{' '}
                  <span className="font-semibold">
                    {university.contactPhone ?? 'Not provided'}
                  </span>
                </span>
              )}
              {university.website && (
                <a
                  href={university.website}
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold text-sky-200 underline-offset-4 hover:underline"
                >
                  Visit website
                </a>
              )}
            </div>
          </div>
          <Link
            to="/universities"
            className="inline-flex items-center gap-2 rounded-full border border-white/30 px-5 py-2 text-sm font-medium text-white transition hover:bg-white/10"
          >
            ← All universities
          </Link>
        </div>
      </section>

      <section className="container space-y-8 pt-16">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">Hostels near {university.code}</h2>
            <p className="text-sm text-slate-500">
              All hostels are verified and managed through RooMio’s platform with live availability
              tracking.
            </p>
          </div>
          <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-600">
            {hostels.length} hostels
          </span>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {hostels.map((hostel) => (
            <article
              key={hostel.id}
              className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="aspect-[16/9] overflow-hidden bg-slate-100">
                <img
                  src={
                    hostel.primaryImage ??
                    'https://images.unsplash.com/photo-1523217582562-09d0def993a6?auto=format&fit=crop&w=900&q=80'
                  }
                  alt={hostel.name}
                  className="h-full w-full object-cover transition duration-500 hover:scale-105"
                />
              </div>
              <div className="space-y-4 p-6">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-lg font-semibold text-slate-900">{hostel.name}</h3>
                  <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600">
                    {hostel.availableRooms} rooms
                  </span>
                </div>
                <p className="text-sm text-slate-500 line-clamp-3">{hostel.description}</p>
                <div className="flex flex-wrap gap-2">
                  {hostel.amenities.slice(0, 3).map((amenity) => (
                    <span
                      key={amenity}
                      className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between border-t border-slate-200 pt-4 text-sm">
                  <div className="font-semibold text-slate-900">
                    {hostel.pricePerRoom
                      ? `UGX ${Number(hostel.pricePerRoom).toLocaleString()}`
                      : 'Contact for pricing'}
                    {hostel.pricePerRoom && (
                      <span className="text-xs font-normal text-slate-500"> / semester</span>
                    )}
                    {typeof hostel.bookingFee === 'number' && (
                      <div className="text-xs font-normal text-slate-500">
                        Booking fee UGX {Number(hostel.bookingFee).toLocaleString()}
                      </div>
                    )}
                  </div>
                  <Link
                    to={`/hostels/${hostel.id}`}
                    className="text-sm font-semibold text-sky-600 hover:text-sky-500"
                  >
                    View hostel →
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

