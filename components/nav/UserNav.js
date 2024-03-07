import { useRouter } from 'next/router';

export default function UserNav() {
  const router = useRouter();

  // Function to handle navigation
  const navigateTo = (path) => {
    router.push(path);
  };

  return (
    <nav className="nav justify-content-center mb-3">
      <a className="nav-link" onClick={() => navigateTo('/dashboard/user')}>Dashboard</a>
      <a className="nav-link" onClick={() => navigateTo('/dashboard/user/orders')}>Orders</a>
    </nav>
  );
}
