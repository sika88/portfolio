import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-page py-28 text-center">
      <p className="eyebrow">Error 404</p>
      <h1 className="mt-3 font-display text-5xl font-semibold">That page isn’t here</h1>
      <p className="mt-4 text-muted">It may have moved, or the link might be wrong.</p>
      <Link href="/" className="btn-primary mt-8">
        Back to the home page
      </Link>
    </div>
  );
}
