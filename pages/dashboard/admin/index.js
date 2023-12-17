// pages/dashboard/admin.js
import React from 'react';
import AdminLayout from './layout';

// Содержимое административной панели
function AdminDashboard() {
  return (
    <div className="container">
      <div className="row">
        <div className="col">
          <p>Admin Dashboard</p>
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
