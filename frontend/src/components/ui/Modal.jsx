import React, { useEffect } from 'react';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children, size = 'medium' }) => {
 useEffect(() => {
 const handleEscape = (e) => {
 if (e.key === 'Escape') onClose();
 };
 
 if (isOpen) {
 document.addEventListener('keydown', handleEscape);
 document.body.style.overflow = 'hidden';
 }
 
 return () => {
 document.removeEventListener('keydown', handleEscape);
 document.body.style.overflow = 'unset';
 };
 }, [isOpen, onClose]);

 if (!isOpen) return null;

 const sizes = {
 small: 'max-w-md',
 medium: 'max-w-lg',
 large: 'max-w-2xl',
 xlarge: 'max-w-4xl',
 };

 return (
 <div className="fixed inset-0 z-50 overflow-y-auto">
 <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
 {/* Background overlay */}
 <div
 className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
 onClick={onClose}
 />
 
 {/* Modal panel */}
 <div className={`inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:w-full ${sizes[size]}`}>
 {/* Header */}
 <div className="px-6 py-4 -200 flex items-center justify-between">
 <h3 className="text-lg font-medium text-gray-900">{title}</h3>
 <button
 onClick={onClose}
 className="p-1 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 transition-colors"
 >
 <X className="h-5 w-5" />
 </button>
 </div>
 
 {/* Content */}
 <div className="px-6 py-4">
 {children}
 </div>
 
 {/* Footer (optional) */}
 {/* Add footer buttons here if needed */}
 </div>
 </div>
 </div>
 );
};

export default Modal;