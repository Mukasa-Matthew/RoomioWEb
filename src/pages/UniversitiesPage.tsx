import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAsync } from '../hooks/useAsync';
import {
  fetchUniversitiesWithHostels,
  type UniversitySummary,
} from '../lib/api';

export default function UniversitiesPage() {
  const {
    data,
    loading,
    error,
  } = useAsync<UniversitySummary[]>(() => fetchUniversitiesWithHostels(), []);

  const universities = data ?? [];
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUniversities = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return universities;

    return universities.filter((university) => {
      const matchesUniversity =
        university.name.toLowerCase().includes(query) ||
        university.code.toLowerCase().includes(query) ||
        (university.address ?? '').toLowerCase().includes(query);

      const matchesHostel = university.hostels.some((hostel) => {
        const description = hostel.description?.toLowerCase() ?? '';
        return (
          hostel.name.toLowerCase().includes(query) ||
          hostel.address.toLowerCase().includes(query) ||
          description.includes(query)
        );
      });

      return matchesUniversity || matchesHostel;
    });
  }, [searchTerm, universities]);

  return (
    <div className="container py-16">
      <div className="mx-auto max-w-3xl text-center">
        <span className="text-sm font-semibold uppercase tracking-wide text-sky-500">
          Our Network
        </span>
        <h1 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">
          Universities partnering with RooMio
        </h1>
        <p className="mt-3 text-sm text-slate-500">
          Browse active partner universities and explore verified hostels managed through our
          platform. Every listing includes live availability, curated amenities, and trusted
          on-the-ground management teams.
        </p>
      </div>

      <div className="mx-auto mt-10 flex max-w-3xl flex-col gap-2">
        <label htmlFor="university-search" className="text-xs font-semibold uppercase text-slate-500">
          Search by university or hostel name
        </label>
        <input
          id="university-search"
          type="search"
          placeholder="Start typing e.g. Makerere, Nkumba, Dream Hostel..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm transition focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/30"
        />
        {searchTerm && filteredUniversities.length === 0 && !loading && (
          <p className="text-xs font-medium text-rose-500">
            No universities or hostels matched “{searchTerm}”. Try another name or location.
          </p>
        )}
      </div>

      <div className="mt-14 grid gap-6 md:grid-cols-2">
        {loading && (
          <>
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="animate-pulse overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
              >
                <div className="aspect-[16/9] bg-slate-200" />
                <div className="space-y-3 p-6">
                  <div className="h-6 w-2/3 rounded bg-slate-200" />
                  <div className="h-4 w-1/2 rounded bg-slate-200" />
                  <div className="h-3 rounded bg-slate-200" />
                </div>
              </div>
            ))}
          </>
        )}

        {error && (
          <div className="rounded-3xl border border-red-200 bg-red-50/80 p-6 text-sm text-red-600 md:col-span-2">
            Unable to load universities from the server. {error}
          </div>
        )}

        {!loading && !error && filteredUniversities.length === 0 && (
          <div className="md:col-span-2">
            <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500 shadow-sm">
              No universities or hostels match your search yet. Once the super admin publishes public
              listings, they will appear automatically.
            </div>
          </div>
        )}

        {!loading &&
          filteredUniversities.map((university) => (
            <Link
              to={`/universities/${university.id}`}
              key={university.id}
              className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="aspect-[16/9] overflow-hidden bg-slate-100">
                  <img
                    src={
                      university.hostels.find((hostel) => hostel.primaryImage)?.primaryImage ??
                      'https://images.unsplash.com/photo-1460518451285-97b6aa326961?auto=format&fit=crop&w=900&q=80'
                    }
                    alt={university.name}
                    className="h-full w-full object-cover transition duration-500 hover:scale-105"
                  />
              </div>
              <div className="space-y-3 p-6">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h2 className="text-xl font-semibold text-slate-900">{university.name}</h2>
                    <p className="text-xs uppercase tracking-wide text-sky-500">
                      {university.code}
                    </p>
                  </div>
                  <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-600">
                    {university.hostels.length} hostels
                  </span>
                </div>
                <p className="text-sm text-slate-500">{university.address}</p>
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                  {university.contactEmail && <span>{university.contactEmail}</span>}
                  {university.contactPhone && <span>{university.contactPhone}</span>}
                  {university.website && (
                    <span className="truncate text-sky-600 hover:text-sky-500">
                      {university.website.replace(/^https?:\/\//, '')}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
}

