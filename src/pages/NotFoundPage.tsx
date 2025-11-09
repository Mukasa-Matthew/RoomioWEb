import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="container flex min-h-[60vh] flex-col items-center justify-center gap-6 text-center">
      <span className="grid h-16 w-16 place-items-center rounded-2xl bg-sky-500/10 text-sky-600">
        <span className="text-2xl font-bold">404</span>
      </span>
      <div className="space-y-3">
        <h1 className="text-3xl font-semibold text-slate-900">Page not found</h1>
        <p className="text-sm text-slate-500">
          The page you’re looking for may have moved or is still under construction.
        </p>
      </div>
      <Link
        to="/"
        className="inline-flex items-center rounded-full bg-sky-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-sky-500"
      >
        Back to home
      </Link>
    </div>
  );
}






