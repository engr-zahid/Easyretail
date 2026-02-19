import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from '../../utils/api';
import {
  ArrowLeft,
  Edit,
  Trash2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  User,
  DollarSign,
  ShoppingBag,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  X,
  Package,
  Clock,
  CreditCard,
  FileText,
} from "lucide-react";
import Button from "../../components/ui/Button";
import Loader from "../../components/common/Loader";
import Modal from "../../components/ui/Modal";

const CustomerDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [orders, setOrders] = useState([]); // NEW: Store customer orders
  const [loading, setLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(false); // NEW
  const [error, setError] = useState("");
  const [deleteModal, setDeleteModal] = useState(false);
  const [activeTab, setActiveTab] = useState("details"); // NEW: Tab state
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });

  useEffect(() => {
    fetchCustomer();
    fetchCustomerOrders(); // NEW: Fetch orders
  }, [id]);

  useEffect(() => {
    const handleThemeChange = (event) => {
      setIsDarkMode(event.detail);
    };

    window.addEventListener("themeChange", handleThemeChange);

    return () => {
      window.removeEventListener("themeChange", handleThemeChange);
    };
  }, []);

  const fetchCustomer = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/customers/${id}`);

      if (res.data && res.data.success) {
        const customerData = res.data.data;
        setCustomer({
          ...customerData,
          joinedDate: customerData.createdAt
            ? new Date(customerData.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })
            : "N/A",
          lastActive: customerData.updatedAt
            ? new Date(customerData.updatedAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })
            : "N/A",
        });
        setError("");
      } else {
        setError("Customer not found");
      }
    } catch (err) {
      console.error("Error fetching customer:", err);
      setError("Failed to load customer details. Please try again.");
      // Demo data for testing
      setCustomer({
        id: id,
        name: "Demo Customer",
        email: "demo@example.com",
        phone: "+1234567890",
        address: "123 Main St, City, Country",
        status: "active",
        totalOrders: 15,
        totalSpent: "1250.50",
        joinedDate: "January 15, 2024",
        lastActive: "March 10, 2024",
        notes: "Regular customer with good purchase history.",
        avatar: "👤",
      });
    } finally {
      setLoading(false);
    }
  };

  // NEW: Fetch customer orders
  const fetchCustomerOrders = async () => {
    try {
      setOrdersLoading(true);
      const res = await api.get(`/orders/customer/${id}`);

      if (res.data && res.data.success) {
        setOrders(res.data.orders || []);
      }
    } catch (err) {
      console.error("Error fetching customer orders:", err);
      // Demo orders for testing
      setOrders([
        {
          id: "ORD-001",
          orderNumber: "ORD-2024-001",
          totalAmount: 199.99,
          status: "COMPLETED",
          paymentMethod: "Credit Card",
          createdAt: "2024-03-10T10:30:00Z",
          orderItems: [
            { product: { name: "Premium T-Shirt" }, quantity: 2, price: 29.99 },
            { product: { name: "Water Bottle" }, quantity: 1, price: 24.99 },
          ],
        },
        {
          id: "ORD-002",
          orderNumber: "ORD-2024-002",
          totalAmount: 89.99,
          status: "PROCESSING",
          paymentMethod: "PayPal",
          createdAt: "2024-03-08T14:20:00Z",
          orderItems: [
            {
              product: { name: "Wireless Earbuds" },
              quantity: 1,
              price: 89.99,
            },
          ],
        },
      ]);
    } finally {
      setOrdersLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/customers/${id}`);
      navigate("/customers");
    } catch (error) {
      console.error("Error deleting customer:", error);
      setError("Failed to delete customer. Please try again.");
    }
  };

  const getAvatarEmoji = (name) => {
    if (!name) return "👤";
    const firstLetter = name.charAt(0).toUpperCase();
    if (firstLetter >= "A" && firstLetter <= "D") return "👨";
    if (firstLetter >= "E" && firstLetter <= "H") return "👩";
    if (firstLetter >= "I" && firstLetter <= "L") return "👨‍💼";
    if (firstLetter >= "M" && firstLetter <= "P") return "👩‍💼";
    return "👤";
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "COMPLETED":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300";
      case "PROCESSING":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300";
      case "PENDING":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case "CANCELLED":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300";
    }
  };

  if (loading) return <Loader />;

  if (!customer && !loading) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
          Customer Not Found
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          The customer you're looking for doesn't exist.
        </p>
        <Link to="/customers">
          <Button>Back to Customers</Button>
        </Link>
      </div>
    );
  }

  return (
    <div
      className={`${isDarkMode ? "bg-gray-900" : "bg-gray-50"} min-h-screen p-6`}
    >
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <Link
            to="/customers"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Customers
          </Link>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div className="flex items-center mb-4 sm:mb-0">
              <div className="h-16 w-16 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400 flex items-center justify-center text-white text-2xl font-bold">
                {getAvatarEmoji(customer.name)}
              </div>
              <div className="ml-4">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {customer.name}
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Customer Details
                </p>
              </div>
            </div>

            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={() => navigate(`/orders/create?customerId=${id}`)}
              >
                <ShoppingBag className="h-4 w-4 mr-2" />
                New Order
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate(`/customers/edit/${id}`)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Customer
              </Button>
              <Button variant="danger" onClick={() => setDeleteModal(true)}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-700 dark:text-red-300">{error}</p>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab("details")}
                className={`py-3 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "details"
                    ? "border-blue-500 text-blue-600 dark:text-blue-400"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
                }`}
              >
                <User className="inline h-4 w-4 mr-2" />
                Details
              </button>
              <button
                onClick={() => setActiveTab("orders")}
                className={`py-3 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "orders"
                    ? "border-blue-500 text-blue-600 dark:text-blue-400"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
                }`}
              >
                <ShoppingBag className="inline h-4 w-4 mr-2" />
                Orders ({orders.length})
              </button>
              <button
                onClick={() => setActiveTab("analytics")}
                className={`py-3 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "analytics"
                    ? "border-blue-500 text-blue-600 dark:text-blue-400"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
                }`}
              >
                <TrendingUp className="inline h-4 w-4 mr-2" />
                Analytics
              </button>
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "details" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Contact Info */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Contact Information
                  </h2>
                </div>

                <div className="p-6">
                  <div className="space-y-6">
                    <div className="flex items-start">
                      <div className="h-10 w-10 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                        <User className="h-5 w-5" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Full Name
                        </p>
                        <p className="font-medium text-gray-900 dark:text-gray-100">
                          {customer.name}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="h-10 w-10 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                        <Mail className="h-5 w-5" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Email Address
                        </p>
                        <p className="font-medium text-gray-900 dark:text-gray-100">
                          {customer.email}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="h-10 w-10 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                        <Phone className="h-5 w-5" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Phone Number
                        </p>
                        <p className="font-medium text-gray-900 dark:text-gray-100">
                          {customer.phone || "Not provided"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="h-10 w-10 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                        <MapPin className="h-5 w-5" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Address
                        </p>
                        <p className="font-medium text-gray-900 dark:text-gray-100">
                          {customer.address || "Not provided"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {customer.notes && (
                <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
                  <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      Notes
                    </h2>
                  </div>
                  <div className="p-6">
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                      {customer.notes}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Stats */}
            <div>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Customer Details
                  </h2>
                </div>

                <div className="p-6">
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Customer ID
                      </p>
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        {customer.id}
                      </p>
                    </div>

                    <div className="flex items-start">
                      <div className="h-10 w-10 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                        <Calendar className="h-5 w-5" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Joined Date
                        </p>
                        <p className="font-medium text-gray-900 dark:text-gray-100">
                          {customer.joinedDate}
                        </p>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Last Active
                      </p>
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        {customer.lastActive}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Status
                      </p>
                      <span
                        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                          customer.status === "active"
                            ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300"
                            : "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300"
                        }`}
                      >
                        {customer.status === "active" ? (
                          <CheckCircle className="h-4 w-4" />
                        ) : (
                          <AlertCircle className="h-4 w-4" />
                        )}
                        {customer.status === "active" ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Purchase History
                  </h2>
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {customer.totalOrders || 0}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Total Orders
                      </div>
                    </div>

                    <div className="text-center p-4 rounded-lg bg-emerald-50 dark:bg-emerald-900/20">
                      <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                        ${customer.totalSpent || "0.00"}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Total Spent
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <TrendingUp className="h-4 w-4 text-emerald-500" />
                      <span>Good customer retention</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === "orders" && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Order History
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {orders.length} orders found for this customer
              </p>
            </div>

            {ordersLoading ? (
              <div className="p-6 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  Loading orders...
                </p>
              </div>
            ) : orders.length === 0 ? (
              <div className="p-6 text-center">
                <ShoppingBag className="h-12 w-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                  No Orders Yet
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  This customer hasn't placed any orders yet.
                </p>
                <Button
                  onClick={() => navigate(`/orders/create?customerId=${id}`)}
                >
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  Create First Order
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-900">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Order #
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Items
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Total
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Payment
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {orders.map((order) => (
                      <tr
                        key={order.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700/50"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {order.orderNumber}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 dark:text-gray-300">
                            {formatDate(order.createdAt)}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 dark:text-gray-300">
                            {order.orderItems?.length || 0} items
                            {order.orderItems?.slice(0, 2).map((item, idx) => (
                              <div
                                key={idx}
                                className="text-xs text-gray-500 dark:text-gray-400"
                              >
                                • {item.product?.name} × {item.quantity}
                              </div>
                            ))}
                            {order.orderItems?.length > 2 && (
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                +{order.orderItems.length - 2} more
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                            ${order.totalAmount?.toFixed(2) || "0.00"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 dark:text-gray-300">
                            {order.paymentMethod}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="flex space-x-2">
                            <Link to={`/orders/${order.id}`}>
                              <Button variant="ghost" size="small">
                                <Eye className="h-3 w-3 mr-1" />
                                View
                              </Button>
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === "analytics" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Purchase Analytics
                  </h2>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                          {customer.totalOrders || 0}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Total Orders
                        </div>
                      </div>
                      <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                        <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                          ${customer.totalSpent || "0.00"}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Total Spent
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-gray-50 dark:bg-gray-900/20 rounded-lg">
                      <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                        Order Frequency
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {customer.totalOrders > 0
                          ? `Average of ${(customer.totalOrders / 3).toFixed(1)} orders per month`
                          : "No orders yet"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Customer Value
                  </h2>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    <div>
                      <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                        $
                        {customer.totalOrders > 0
                          ? (
                              parseFloat(customer.totalSpent || 0) /
                              customer.totalOrders
                            ).toFixed(2)
                          : "0.00"}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Average Order Value
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Customer Since
                        </span>
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {customer.joinedDate}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Last Order
                        </span>
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {orders.length > 0
                            ? formatDate(orders[0].createdAt)
                            : "Never"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <Modal
        isOpen={deleteModal}
        onClose={() => setDeleteModal(false)}
        title="Delete Customer"
      >
        <div className="p-4">
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Are you sure you want to delete{" "}
            <span className="font-semibold">{customer.name}</span>? This action
            cannot be undone.
          </p>
          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={() => setDeleteModal(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Delete Customer
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CustomerDetail;
