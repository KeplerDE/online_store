// app/dashboard/admin/layout.js
import AdminNav from '@/components/AdminNav';

export default function AdminLayout({ children }) {
  return (
    <>
      <AdminNav />
      {children}
    </>
  );
}
