import React from 'react';
import { Loader2 } from 'lucide-react';

const Button = ({
 children,
 variant = 'primary',
 size = 'medium',
 loading = false,
 disabled = false,
 className = '',
 ...props
}) => {
 const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
 
 const variants = {
 primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500',
 secondary: 'bg-white -300 text-gray-700 hover:bg-gray-50 focus:ring-primary-500',
 danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
 success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
 ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-primary-500',
 };
 
 const sizes = {
 small: 'px-3 py-1.5 text-sm',
 medium: 'px-4 py-2.5 text-sm',
 large: 'px-6 py-3 text-base',
 };

 return (
 <button
 className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
 disabled={disabled || loading}
 {...props}
 >
 {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
 {children}
 </button>
 );
};

export default Button;