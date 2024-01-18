// pages/dashboard/admin.js
import React from 'react';
import AdminLayout from './layout';
import ProductList from "@/components/admin/ProductList";

// Содержимое административной панели
function AdminDashboard() {
  return (
    <div className="container">
      <div className="row">
        <div className="col">
        <ProductList />
          <hr />
          ...
        </div>
      </div>
    </div>
  );
}

// Экспорт готовой административной страницы
export default function AdminPage() {
  return (
    <AdminLayout>
      <AdminDashboard />
    </AdminLayout>
  );
}
