export default function AdminDashboard() {
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-gray-900 text-white p-6">
        <h2 className="text-xl font-bold mb-6">Admin</h2>
        <ul className="space-y-3">
          <li>Users</li>
          <li>Vendors</li>
          <li>Products</li>
          <li>Orders</li>
        </ul>
      </aside>

      <main className="flex-1 p-8 bg-gray-100">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      </main>
    </div>
  );
}
