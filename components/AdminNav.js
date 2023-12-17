
import Link from "next/link";
import Navbar from "./Navbar";

export default function AdminNav() {
  return (
    <>
      <Navbar />
      <nav className="nav justify-content-center mb-3">
        <Link href="/dashboard/admin">
          <span className="nav-link">Admin</span>
        </Link>
        <Link href="/dashboard/admin/product/create">
          <span className="nav-link">Create Product</span>
        </Link>
      </nav>
    </>
  );
}
