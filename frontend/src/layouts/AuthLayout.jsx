import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';

const AuthLayout = () => {
 return (
 <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
 <div className="sm:mx-auto sm:w-full sm:max-w-md">
 <div className="flex justify-center">
 <div className="bg-primary-600 p-3 rounded-lg">
 <ShoppingBag className="h-12 w-12 text-white" />
 </div>
 </div>
 <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
 Shop Admin Panel
 </h2>
 <p className="mt-2 text-center text-sm text-gray-600">
 Professional shop management system
 </p>
 </div>

 <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
 <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
 <Outlet />
 </div>
 
 <div className="mt-6 text-center">
 <Link 
 to="/" 
 className="text-sm text-primary-600 hover:text-primary-500"
 >
 ← Back to dashboard
 </Link>
 </div>
 </div>
 </div>
 );
};

export default AuthLayout;