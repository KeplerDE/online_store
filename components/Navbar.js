// components/Navbar.js
import Link from 'next/link';

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <Link className="navbar-brand" href="/">
        My Ecommerce Site
      </Link>
      {/* Add additional navigation links or elements here */}
    </nav>
  );
};

export default Navbar;
