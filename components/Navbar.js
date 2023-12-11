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


      <div className='d-flex'>
        <Link href="/login" className='nav-link'>
          Login
        </Link>
        <Link href="/register" className='nav-link'>
          Register
        </Link>
      </div>

    </nav>
  );
};

export default Navbar;
