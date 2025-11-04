'use client'
import React, { useState } from 'react';
import { Eye, X, Package, Calendar, CreditCard, User, Phone, MapPin, ShoppingBag, Hash } from 'lucide-react';
import '@/app/globals.css';

interface Product {
  productName: string;
  quantity: number;
  productImg: string;
  price: number;
  category: string;
}

interface Order {
  orderId: string;
  placedOn: string;
  paymentStatus: 'Paid' | 'Pending' | 'Failed';
  products: Product[];
  address: string;
  userName: string;
  mobileNo: string;
  totalAmount: number;
}

const OrderDashboard = () => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Sample data
  const orders: Order[] = [
    {
      orderId: 'ORD-2025-001',
      placedOn: '2025-10-05',
      paymentStatus: 'Paid',
      products: [
        {
          productName: 'Wireless Headphones',
          quantity: 2,
          productImg: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200',
          price: 2999,
          category: 'Electronics'
        },
        {
          productName: 'Phone Case',
          quantity: 1,
          productImg: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=200',
          price: 499,
          category: 'Accessories'
        }
      ],
      address: '123 MG Road, Pune, Maharashtra 411001',
      userName: 'Rahul Sharma',
      mobileNo: '+91 98765 43210',
      totalAmount: 6497
    },
    {
      orderId: 'ORD-2025-002',
      placedOn: '2025-10-06',
      paymentStatus: 'Paid',
      products: [
        {
          productName: 'Smart Watch',
          quantity: 1,
          productImg: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200',
          price: 15999,
          category: 'Electronics'
        }
      ],
      address: '45 Brigade Road, Bangalore, Karnataka 560001',
      userName: 'Priya Patel',
      mobileNo: '+91 87654 32109',
      totalAmount: 15999
    },
    {
      orderId: 'ORD-2025-003',
      placedOn: '2025-10-07',
      paymentStatus: 'Paid',
      products: [
        {
          productName: 'Running Shoes',
          quantity: 1,
          productImg: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200',
          price: 3499,
          category: 'Fashion'
        },
        {
          productName: 'Sports T-Shirt',
          quantity: 3,
          productImg: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200',
          price: 799,
          category: 'Fashion'
        },
        {
          productName: 'Water Bottle',
          quantity: 2,
          productImg: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=200',
          price: 299,
          category: 'Sports'
        }
      ],
      address: '78 Park Street, Kolkata, West Bengal 700016',
      userName: 'Amit Kumar',
      mobileNo: '+91 76543 21098',
      totalAmount: 6494
    },
    {
      orderId: 'ORD-2025-004',
      placedOn: '2025-10-08',
      paymentStatus: 'Paid',
      products: [
        {
          productName: 'Laptop Bag',
          quantity: 1,
          productImg: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200',
          price: 1299,
          category: 'Accessories'
        }
      ],
      address: '12 Connaught Place, New Delhi, Delhi 110001',
      userName: 'Sneha Reddy',
      mobileNo: '+91 65432 10987',
      totalAmount: 1299
    }
  ];

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Paid':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Failed':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = orders.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(orders.length / itemsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };
  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Order Management</h1>
              <p className="text-gray-500 text-sm">View and manage all customer orders</p>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-lg p-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-500 font-medium">Total Orders</p>
              <Package className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-500 font-medium">Total Revenue</p>
              <CreditCard className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">
              ₹{orders.reduce((sum, order) => sum + order.totalAmount, 0).toLocaleString('en-IN')}
            </p>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-500 font-medium">Paid Orders</p>
              <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-xs text-green-600 font-bold">✓</span>
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {orders.filter(order => order.paymentStatus === 'Paid').length}
            </p>
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="hidden lg:block bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Order ID</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Products</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentOrders.map((order, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <Hash className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-900">{order.orderId}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{new Date(order.placedOn).toLocaleDateString('en-IN')}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{order.userName}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <ShoppingBag className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{order.products.length} item{order.products.length > 1 ? 's' : ''}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-semibold text-gray-900">₹{order.totalAmount.toLocaleString('en-IN')}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${getStatusColor(order.paymentStatus)}`}>
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleViewOrder(order)}
                        className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        <span>View</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Desktop Pagination */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
            <div className="text-sm text-gray-600">
              Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, orders.length)} of {orders.length} orders
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={prevPage}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  currentPage === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Previous
              </button>
              
              <div className="flex space-x-1">
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index}
                    onClick={() => paginate(index + 1)}
                    className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                      currentPage === index + 1
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
              
              <button
                onClick={nextPage}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  currentPage === totalPages
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Next
              </button>
            </div>
          </div>
        </div>

        {/* Mobile/Tablet Card View */}
        <div className="lg:hidden space-y-4">
          {currentOrders.map((order, idx) => (
            <div key={idx} className="bg-white rounded-xl shadow-lg p-5 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Hash className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-bold text-gray-900">{order.orderId}</span>
                </div>
                <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(order.paymentStatus)}`}>
                  {order.paymentStatus}
                </span>
              </div>
              
              <div className="space-y-3 mb-4">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(order.placedOn).toLocaleDateString('en-IN')}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <User className="w-4 h-4" />
                  <span className="font-medium">{order.userName}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <ShoppingBag className="w-4 h-4" />
                  <span>{order.products.length} item{order.products.length > 1 ? 's' : ''}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total Amount:</span>
                  <span className="text-lg font-bold text-gray-900">₹{order.totalAmount.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <button
                onClick={() => handleViewOrder(order)}
                className="w-full inline-flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
              >
                <Eye className="w-4 h-4" />
                <span>View Details</span>
              </button>
            </div>
          ))}
          
          {/* Mobile Pagination */}
          <div className="bg-white rounded-xl shadow-lg p-4">
            <div className="text-sm text-gray-600 text-center mb-3">
              Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, orders.length)} of {orders.length} orders
            </div>
            <div className="flex items-center justify-center space-x-2">
              <button
                onClick={prevPage}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  currentPage === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Previous
              </button>
              
              <div className="flex space-x-1">
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index}
                    onClick={() => paginate(index + 1)}
                    className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                      currentPage === index + 1
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
              
              <button
                onClick={nextPage}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  currentPage === totalPages
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto scrollbar-hide">
            {/* Modal Header */}
            <div className="sticky top-0 bg-blue-500 text-white p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Order Details</h2>
                  <p className="text-blue-100 text-sm mt-1">{selectedOrder.orderId}</p>
                </div>
                <button
                  onClick={closeModal}
                  className="w-10 h-10 rounded-full  bg-opacity-20 hover:bg-opacity-30 flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Customer Info */}
              <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-5">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
                  <User className="w-5 h-5 text-blue-600" />
                  <span>Customer Information</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 uppercase mb-1">Name</p>
                    <p className="text-sm font-semibold text-gray-900">{selectedOrder.userName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase mb-1">Mobile Number</p>
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <p className="text-sm font-semibold text-gray-900">{selectedOrder.mobileNo}</p>
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-xs text-gray-500 uppercase mb-1">Delivery Address</p>
                    <div className="flex items-start space-x-2">
                      <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                      <p className="text-sm text-gray-900">{selectedOrder.address}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Info */}
              <div className="bg-gradient-to-br from-gray-50 to-purple-50 rounded-xl p-5">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
                  <Package className="w-5 h-5 text-purple-600" />
                  <span>Order Information</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 uppercase mb-1">Order Date</p>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <p className="text-sm font-semibold text-gray-900">
                        {new Date(selectedOrder.placedOn).toLocaleDateString('en-IN', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase mb-1">Payment Status</p>
                    <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(selectedOrder.paymentStatus)}`}>
                      {selectedOrder.paymentStatus}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase mb-1">Total Amount</p>
                    <div className="flex items-center space-x-2">
                      <CreditCard className="w-4 h-4 text-gray-400" />
                      <p className="text-lg font-bold text-gray-900">₹{selectedOrder.totalAmount.toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Products */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
                  <ShoppingBag className="w-5 h-5 text-green-600" />
                  <span>Products ({selectedOrder.products.length})</span>
                </h3>
                <div className="space-y-3">
                  {selectedOrder.products.map((product, idx) => (
                    <div key={idx} className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center space-x-4">
                        <img
                          src={product.productImg}
                          alt={product.productName}
                          className="w-20 h-20 object-cover rounded-lg shadow"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-semibold text-gray-900 mb-1">{product.productName}</h4>
                          <p className="text-xs text-gray-500 mb-2">Category: {product.category}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-600">Qty: <span className="font-semibold">{product.quantity}</span></span>
                            <span className="text-sm font-bold text-gray-900">₹{(product.price * product.quantity).toLocaleString('en-IN')}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total Summary */}
              <div className="bg-blue-400 rounded-xl p-5 text-white">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold">Total Order Amount</span>
                  <span className="text-2xl font-bold">₹{selectedOrder.totalAmount.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-gray-50 p-4 rounded-b-2xl border-t border-gray-200">
              <button
                onClick={closeModal}
                className="w-full py-3 bg-gray-800 hover:bg-gray-900 text-white font-semibold rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDashboard;