import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useStore from '../store/useStore';
import { orderAPI, productAPI } from '../lib/api';
import {  Package, ShoppingBag, DollarSign, Users, TrendingUp, Plus, Settings, UserCheck} from 'lucide-react';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user } = useStore();
  const [stats, setStats] = useState({ orders: [], products: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const ordersRes = await orderAPI.getOrders();
      setStats({ orders: ordersRes.data || [] });
      
      if (user.role === 'vendor' || user.role === 'admin') {
        const productsRes = await productAPI.getProducts();
        setStats(prev => ({ ...prev, products: productsRes.data.results || [] }));
      }
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const DashboardCard = ({ title, value, icon: Icon, color, link }) => (
    <Link to={link} className="card hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-3xl font-bold mt-2">{value}</p>
        </div>
        <div className={`p-4 rounded-full ${color}`}>
          <Icon className="h-8 w-8 text-white" />
        </div>
      </div>
    </Link>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user.first_name}!
        </h1>
        <p className="mt-2 text-gray-600">
          Here's what's happening with your account
        </p>
        <div className="mt-2">
          <span className="badge badge-info">{user.role}</span>
          {user.is_verified ? (
            <span className="badge badge-success ml-2">Verified</span>
          ) : (
            <span className="badge badge-warning ml-2">Not Verified</span>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <DashboardCard
          title="My Orders"
          value={stats.orders.length}
          icon={ShoppingBag}
          color="bg-blue-500"
          link="/orders"
        />
        
        {(user.role === 'vendor' || user.role === 'admin') && (
          <DashboardCard
            title="My Products"
            value={stats.products.length}
            icon={Package}
            color="bg-green-500"
            link="/vendor/products"
          />
        )}
        
        {user.role === 'admin' && (
          <>
            <DashboardCard
              title="Vendor Requests"
              value="New"
              icon={UserCheck}
              color="bg-purple-500"
              link="/admin/vendors"
            />
            <DashboardCard
              title="Total Sales"
              value="$0"
              icon={DollarSign}
              color="bg-yellow-500"
              link="/admin/orders"
            />
          </>
        )}
      </div>

      {/* Quick Actions */}
      <div className="card mb-8">
        <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/products"
            className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition"
          >
            <ShoppingBag className="h-6 w-6 text-primary-600" />
            <div>
              <p className="font-medium">Browse Products</p>
              <p className="text-sm text-gray-600">Explore our catalog</p>
            </div>
          </Link>

          {user.role === 'customer' && !user.vendor_request_pending && (
            <Link
              to="/become-vendor"
              className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition"
            >
              <TrendingUp className="h-6 w-6 text-primary-600" />
              <div>
                <p className="font-medium">Become a Vendor</p>
                <p className="text-sm text-gray-600">Start selling today</p>
              </div>
            </Link>
          )}

          {(user.role === 'vendor' || user.role === 'admin') && (
            <Link
              to="/vendor/products/new"
              className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition"
            >
              <Plus className="h-6 w-6 text-primary-600" />
              <div>
                <p className="font-medium">Add Product</p>
                <p className="text-sm text-gray-600">List a new item</p>
              </div>
            </Link>
          )}

          <Link
            to="/profile"
            className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition"
          >
            <Settings className="h-6 w-6 text-primary-600" />
            <div>
              <p className="font-medium">Profile Settings</p>
              <p className="text-sm text-gray-600">Manage your account</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Recent Orders */}
      {stats.orders.length > 0 && (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Recent Orders</h2>
            <Link to="/orders" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
              View All
            </Link>
          </div>
          <div className="space-y-4">
            {stats.orders.slice(0, 5).map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <p className="font-medium">Order #{order.order_number}</p>
                  <p className="text-sm text-gray-600">
                    {new Date(order.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold">${order.total}</p>
                  <span className={`badge ${
                    order.status === 'delivered' ? 'badge-success' :
                    order.status === 'cancelled' ? 'badge-danger' :
                    'badge-info'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;