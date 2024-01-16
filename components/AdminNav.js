
import Link from "next/link";

export default function AdminNav() {
  return (
    <>
      <nav className="nav justify-content-center mb-3">
        <Link href="/dashboard/admin">
          <span className="nav-link">Admin</span>
        </Link>
        <Link href="/dashboard/admin/category">
          <span className="nav-link">Categories</span>
        </Link>
        <Link className="nav-link" href="/dashboard/admin/tag">
        Tags
        </Link>
        <Link className="nav-link" href="/dashboard/admin/product">
        Add Product
        </Link>
      </nav>
    </>
  );
}
