// components/Sidebar.tsx
import Link from "next/link";

export const Sidebar = () => {
  return (
    <aside className="sticky top-0 w-64 bg-muted p-4 flex flex-col gap-4">
      <h2 className="text-lg font-semibold">Government Services</h2>
      <nav className="flex flex-col gap-2">
        <Link href="#" className="hover:underline">Apply for Passport</Link>
        <Link href="#" className="hover:underline">Tax Filing</Link>
        <Link href="#" className="hover:underline">Driver License Renewal</Link>
        <Link href="#" className="hover:underline">Public Health Forms</Link>
        <Link href="/upload" className="hover:underline">Document Upload</Link>
        <Link href="/forms" className="hover:underline">Fillable Forms</Link>
      </nav>
    </aside>
  );
};