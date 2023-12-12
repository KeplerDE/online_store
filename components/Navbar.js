// components/Navbar.js
import Link from 'next/link';
import { useSession, signOut } from "next-auth/react";





const Navbar = () => {
  const { data, status, loading } = useSession();
  console.log(data, status);
  return (
    <nav className="nav shadow p-2 justify-content-between mb-3">
      <Link className="navbar-brand" href="/">
        My Ecommerce Site 🎄
        </Link>
    {status === "authenticated" ? (
      <div className="d-flex">
        <Link className="nav-link" href="/dashboard/user">
          {data?.user?.name}
        </Link>
        <a
          className="nav-link pointer"
          onClick={() => signOut({ callbackUrl: "/login" })}
        >
          Logout
        </a>
      </div>
    ) : (
      <div className="d-flex">
        <Link className="nav-link" href="/login">
          Login
        </Link>
        <Link className="nav-link" href="/register">
          Register
        </Link>
      </div>)}


    </nav>
  );
};

export default Navbar;
