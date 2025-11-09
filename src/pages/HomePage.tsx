import { FormEvent, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAsync } from '../hooks/useAsync';
import {
  fetchUniversitiesWithHostels,
  type HostelSummary,
  type UniversitySummary,
} from '../lib/api';

export default function HomePage() {
  const {
    data: universityData,
    loading,
    error,
  } = useAsync<UniversitySummary[]>(() => fetchUniversitiesWithHostels(), []);

  const universities = universityData ?? [];
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const searchResults = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (query.length < 2) return [];

    const hostelMatches = universities.flatMap((university) =>
      university.hostels
        .filter((hostel) => {
          const description = hostel.description?.toLowerCase() ?? '';
          return (
            hostel.name.toLowerCase().includes(query) ||
            hostel.address.toLowerCase().includes(query) ||
            description.includes(query) ||
            university.name.toLowerCase().includes(query)
          );
        })
        .map((hostel) => ({
          id: hostel.id,
          name: hostel.name,
          subtitle: `${university.name} • ${hostel.availableRooms} rooms available`,
          to: `/hostels/${hostel.id}`,
          type: 'hostel' as const,
          score: hostel.name.toLowerCase().startsWith(query) ? 0 : 1,
        })),
    );

    const universityMatches = universities
      .filter((university) => {
        return (
          university.name.toLowerCase().includes(query) ||
          university.code.toLowerCase().includes(query) ||
          (university.address ?? '').toLowerCase().includes(query)
        );
      })
      .map((university) => ({
        id: university.id,
        name: university.name,
        subtitle: `${university.hostels.length} hostels • ${university.code}`,
        to: `/universities/${university.id}`,
        type: 'university' as const,
        score: university.name.toLowerCase().startsWith(query) ? 0 : 1,
      }));

    return [...hostelMatches, ...universityMatches]
      .sort((a, b) => a.score - b.score || a.name.localeCompare(b.name))
      .slice(0, 6);
  }, [searchTerm, universities]);

  const featuredHostels = useMemo<HostelSummary[]>(() => {
    const all = universities.flatMap((university) => university.hostels);
    return all.filter((hostel) => hostel.primaryImage).slice(0, Math.min(4, all.length));
  }, [universities]);

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (searchResults.length > 0) {
      navigate(searchResults[0].to);
    }
  };

  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-br from-sky-600 via-cyan-600 to-blue-700 py-24 text-white">
        <div className="container relative z-10 flex flex-col gap-12 lg:flex-row lg:items-center">
          <div className="max-w-2xl space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1 text-sm font-medium">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              RooMio Public Booking Portal
            </span>
            <h1 className="text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
              Find a campus hostel you’ll love—book before you even arrive.
            </h1>
            <p className="text-lg text-sky-100">
              Browse trusted universities, explore verified hostels, and secure your room online.
              Every listing is powered by RooMio’s hostel management platform.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link
                to="/universities"
                className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-sky-600 shadow-lg transition hover:shadow-xl"
              >
                Explore universities
              </Link>
              <Link
                to="#featured"
                className="inline-flex items-center justify-center rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                See featured hostels
              </Link>
            </div>

            <form
              className="relative mt-6 max-w-xl"
              onSubmit={handleSearch}
              role="search"
              aria-label="Search hostels and universities"
            >
              <div className="flex items-center gap-3 rounded-2xl bg-white/10 p-2 pr-3 shadow-lg backdrop-blur transition focus-within:bg-white/15">
                <span className="grid h-9 w-9 flex-none place-items-center rounded-xl bg-white/15 text-white/90">
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m21 21-3.5-3.5m0-7a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0Z"
                    />
                  </svg>
                </span>
                <div className="flex-1">
                  <label htmlFor="homepage-search" className="sr-only">
                    Search for hostels or universities
                  </label>
                  <input
                    id="homepage-search"
                    type="search"
                    placeholder="Search for hostels, universities, locations..."
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    className="h-11 w-full border-0 bg-transparent text-base text-white placeholder:text-sky-100 focus:outline-none focus:ring-0"
                  />
                </div>
                <button
                  type="submit"
                  className="inline-flex h-10 items-center justify-center rounded-xl bg-white px-4 text-sm font-semibold text-sky-600 shadow-md transition hover:bg-sky-50"
                >
                  Search
                </button>
              </div>

              {searchTerm.trim().length > 0 && (
                <div className="absolute left-0 right-0 top-[calc(100%+0.75rem)] overflow-hidden rounded-2xl bg-white text-slate-900 shadow-2xl">
                  {searchResults.length === 0 ? (
                    <div className="px-4 py-6 text-sm text-slate-500">
                      No results found for “{searchTerm}”. Try another hostel or university name.
                    </div>
                  ) : (
                    <ul className="divide-y divide-slate-100">
                      {searchResults.map((result) => (
                        <li key={`${result.type}-${result.id}`}>
                          <Link
                            to={result.to}
                            className="flex items-center justify-between gap-3 px-4 py-4 text-sm transition hover:bg-sky-50"
                          >
                            <div className="flex flex-col">
                              <span className="font-semibold text-slate-900">{result.name}</span>
                              <span className="text-xs text-slate-500">{result.subtitle}</span>
                            </div>
                            <span className="text-xs font-semibold uppercase tracking-wide text-sky-500">
                              {result.type === 'hostel' ? 'Hostel' : 'University'}
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </form>
          </div>

          <div className="relative flex-1">
            <div className="glass-panel p-6 text-slate-100">
              <h3 className="text-lg font-semibold uppercase tracking-wide text-blue-100">
                Why students choose RooMio
              </h3>
              <ul className="mt-4 space-y-4 text-sm leading-relaxed text-blue-100/90">
                <li>• Verified hostels with real-time availability data</li>
                <li>• Smart filters by university, pricing, and amenities</li>
                <li>• Secure bookings and instant notifications</li>
                <li>• Managed and monitored by our platform partners</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="absolute left-1/2 top-20 h-[480px] w-[480px] -translate-x-1/2 rounded-full bg-sky-400/40 blur-[120px]" />
      </section>

      <section className="container space-y-12 py-20" id="featured">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-3xl font-semibold text-slate-900">Featured hostels</h2>
            <p className="text-sm text-slate-500">
              Curated spaces with outstanding amenities and student experiences.
            </p>
          </div>
          <Link
            to="/universities"
            className="inline-flex items-center gap-2 text-sm font-medium text-sky-600 hover:text-sky-500"
          >
            Explore all listings
            <span aria-hidden="true">→</span>
          </Link>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {loading && universities.length === 0 && (
            <>
              {Array.from({ length: 2 }).map((_, index) => (
                <div
                  key={index}
                  className="animate-pulse overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <div className="mb-4 h-44 rounded-2xl bg-slate-200" />
                  <div className="h-6 w-2/3 rounded bg-slate-200" />
                  <div className="mt-4 space-y-2">
                    <div className="h-3 rounded bg-slate-200" />
                    <div className="h-3 w-4/5 rounded bg-slate-200" />
                    <div className="h-3 w-3/5 rounded bg-slate-200" />
                  </div>
                </div>
              ))}
            </>
          )}

          {!loading && featuredHostels.length === 0 && (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
              No hostels have been published yet. Once super admins publish hostels, they will
              appear here automatically.
            </div>
          )}

          {featuredHostels.map((hostel) => (
            <article
              key={hostel.id}
              className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="aspect-[16/9] overflow-hidden bg-slate-100">
                <img
                  src={
                    hostel.primaryImage ??
                    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=960&q=80'
                  }
                  alt={hostel.name}
                  className="h-full w-full object-cover transition duration-500 hover:scale-105"
                />
              </div>
              <div className="space-y-4 p-6">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-xl font-semibold text-slate-900">{hostel.name}</h3>
                  <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600">
                    {hostel.availableRooms} rooms left
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-slate-600">{hostel.description}</p>
                <div className="flex flex-wrap gap-2">
                  {hostel.amenities.slice(0, 4).map((amenity) => (
                    <span
                      key={amenity}
                      className="rounded-full bg-sky-50 px-3 py-1 text-xs font-medium text-sky-600"
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
                    View details →
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="container space-y-8">
          <div className="text-center">
            <span className="text-sm font-semibold uppercase tracking-wide text-sky-500">
              Verified Institutions
            </span>
            <h2 className="mt-2 text-3xl font-semibold text-slate-900">
              Universities onboarded on RooMio
            </h2>
            <p className="mx-auto mt-2 max-w-2xl text-sm text-slate-500">
              Every university listing is validated by our team. Hostels are vetted, managed, and
              monitored through the RooMio platform for student safety and satisfaction.
            </p>
          </div>

          {error && (
            <div className="rounded-3xl border border-red-200 bg-red-50/80 p-6 text-sm text-red-600">
              Unable to load universities from the server. {error}
            </div>
          )}

          <div className="grid gap-6 md:grid-cols-2">
          {loading && universities.length === 0
              ? Array.from({ length: 2 }).map((_, index) => (
                  <div
                    key={index}
                    className="animate-pulse overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
                  >
                    <div className="aspect-[16/9] bg-slate-200" />
                    <div className="space-y-3 p-6">
                      <div className="h-5 w-2/3 rounded bg-slate-200" />
                      <div className="h-4 w-1/2 rounded bg-slate-200" />
                      <div className="h-3 w-full rounded bg-slate-200" />
                    </div>
                  </div>
                ))
              : universities.map((university) => (
              <Link
                key={university.id}
                to={`/universities/${university.id}`}
                className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="aspect-[16/9] overflow-hidden bg-slate-100">
                  <img
                    src={
                      university.hostels.find((hostel) => hostel.primaryImage)?.primaryImage ??
                      'https://images.unsplash.com/photo-1460518451285-97b6aa326961?auto=format&fit=crop&w=900&q=80'
                    }
                    alt={university.name}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="space-y-4 p-6">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">{university.name}</h3>
                      <p className="text-sm uppercase tracking-wide text-sky-500">
                        {university.code}
                      </p>
                    </div>
                    <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-600">
                      {university.hostels.length} hostels
                    </span>
                  </div>
                  <p className="text-sm text-slate-500">{university.address}</p>
                  <p className="text-xs font-medium text-slate-500">
                    Tap to explore hostels managed under {university.name}
                  </p>
                </div>
              </Link>
                ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-slate-900 py-16 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.25),transparent_55%)]" />
        <div className="container relative z-10 grid gap-10 md:grid-cols-2 md:items-center">
          <div className="space-y-4">
            <h2 className="text-3xl font-semibold">
              Ready to have your hostel featured?
            </h2>
            <p className="text-sm text-slate-300">
              Hostels on RooMio enjoy automated bookings, secure payments, and real-time occupancy
              tracking. Super admins can publish rich profiles with galleries, amenities, and room
              details for students.
            </p>
          </div>
          <div className="flex flex-col gap-4 text-sm">
            <Link
              to="#"
              className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 font-semibold text-slate-900 transition hover:bg-slate-100"
            >
              Request a demo
            </Link>
            <p className="text-xs text-slate-400">
              Already on RooMio? Log in to your admin portal to update your public profile and
              gallery.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

