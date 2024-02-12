// components/Navbar.js
import Link from 'next/link';
import { useSession, signOut } from "next-auth/react";


const Navbar = () => {
  const { data, status } = useSession();

  return (
    <nav className="nav shadow p-2 justify-content-between mb-3">
      <div className="d-flex flex-grow-1">
        <Link href="/">
          <span className="navbar-brand">My Ecommerce Site 🎄</span>
        </Link>
        <Link href="/shop">
          <span className="navbar-brand">Shop</span>
        </Link>
      </div>
      {status === "authenticated" ? (
        <div className="d-flex">
          <Link href={`/dashboard/${data?.user?.role === "admin" ? "admin" : "user"}`}>
            <span className="nav-link">{data?.user?.name} {data?.user?.role}</span>
          </Link>
          <span className="nav-link pointer" onClick={() => signOut({ callbackUrl: "/login" })}>
            Logout
          </span>
        </div>
      ) : status === "loading" ? (
        <div className="d-flex">
          <span className="nav-link text-danger">Loading</span>
        </div>
      ) : (
        <div className="d-flex">
          <Link href="/login">
            <span className="nav-link">Login</span>
          </Link>
          <Link href="/register">
            <span className="nav-link">Register</span>
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;