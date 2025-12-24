import React from 'react';

const Input = React.forwardRef(({
 label,
 error,
 helperText,
 className = '',
 required = false,
 leftIcon,
 rightIcon,
 ...props
}, ref) => {
 return (
 <div className="w-full">
 {label && (
 <label className="block text-sm font-medium text-gray-700 mb-1">
 {label}
 {required && <span className="text-red-500 ml-1">*</span>}
 </label>
 )}
 
 <div className="relative">
 {leftIcon && (
 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
 {leftIcon}
 </div>
 )}
 
 <input
 ref={ref}
 className={`
 w-full px-3 py-2.5 rounded-lg focus:outline-none focus:ring-2 transition-colors
 ${leftIcon ? 'pl-10' : ''}
 ${rightIcon ? 'pr-10' : ''}
 ${error 
 ? '-300 focus:ring-red-500 focus:' 
 : '-300 focus:ring-primary-500 focus:'
 }
 ${className}
 `}
 {...props}
 />
 
 {rightIcon && (
 <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
 {rightIcon}
 </div>
 )}
 </div>
 
 {(error || helperText) && (
 <p className={`mt-1 text-sm ${error ? 'text-red-600' : 'text-gray-500'}`}>
 {error || helperText}
 </p>
 )}
 </div>
 );
});

Input.displayName = 'Input';

export default Input;