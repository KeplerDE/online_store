import { BsFillCartCheckFill } from 'react-icons/bs';
import Link from 'next/link';
import { useSession, signOut } from "next-auth/react";
import { useProduct } from '@/context/product';
import { useCart } from '@/context/cart'; 

const Navbar = () => {
  const { data, status } = useSession();
  const {
    productSearchQuery,
    setProductSearchQuery,
    fetchProductSearchResults,
  } = useProduct();
  const { cartItems } = useCart(); 

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

      {/* Форма поиска */}
      <form className="d-flex mx-2" 
      role="search" 
      onSubmit={fetchProductSearchResults}>
        <input
          className="form-control"
          type="search"
          placeholder="Search products"
          aria-label="Search"
          onChange={(e) => setProductSearchQuery(e.target.value)}
          value={productSearchQuery}
        />
        <button className="btn" type="submit" style={{ borderRadius: "20px" }}>
          🔍
        </button>
      </form>

      {status === "authenticated" && ( // Показываем корзину только для аутентифицированных пользователей
        <>
          {/* Ссылка на корзину с иконкой и количеством товаров */}
          <Link href="/cart" className="nav-link text-danger">
            <BsFillCartCheckFill size={25} />
            {cartItems?.length > 0 && (
              <span className="cart-item-count">
                {cartItems.length}
              </span>
            )}
          </Link>

          <div className="d-flex">
            <Link href={`/dashboard/${data?.user?.role === "admin" ? "admin" : "user"}`}>
              <span className="nav-link">{data?.user?.name} ({data?.user?.role})</span>
            </Link>
            <span className="nav-link pointer" onClick={() => signOut({ callbackUrl: "/login" })}>
              Logout
            </span>
          </div>
        </>
      )}

      {status === "loading" && (
        <div className="d-flex">
          <span className="nav-link text-danger">Loading...</span>
        </div>
      )}

      {status !== "authenticated" && status !== "loading" && (
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
