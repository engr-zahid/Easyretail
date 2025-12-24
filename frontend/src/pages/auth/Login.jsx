import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const Login = () => {
 const navigate = useNavigate();
 const [showPassword, setShowPassword] = useState(false);
 const [formData, setFormData] = useState({
 email: '',
 password: '',
 });
 const [loading, setLoading] = useState(false);

 const handleSubmit = async (e) => {
 e.preventDefault();
 setLoading(true);
 
 // Simulate API call
 setTimeout(() => {
 setLoading(false);
 navigate('/');
 }, 1500);
 };

 const handleChange = (e) => {
 setFormData({
 ...formData,
 [e.target.name]: e.target.value,
 });
 };

 return (
 <div>
 <div className="text-center mb-8">
 <h2 className="text-2xl font-bold text-gray-900">Sign in to your account</h2>
 <p className="mt-2 text-sm text-gray-600">
 Or{' '}
 <Link to="/register" className="font-medium text-primary-600 hover:text-primary-500">
 create a new account
 </Link>
 </p>
 </div>

 <form onSubmit={handleSubmit} className="space-y-6">
 <Input
 label="Email address"
 name="email"
 type="email"
 autoComplete="email"
 required
 leftIcon={<Mail className="h-5 w-5 text-gray-400" />}
 value={formData.email}
 onChange={handleChange}
 placeholder="you@example.com"
 />
 
 <Input
 label="Password"
 name="password"
 type={showPassword ? 'text' : 'password'}
 autoComplete="current-password"
 required
 leftIcon={<Lock className="h-5 w-5 text-gray-400" />}
 rightIcon={
 <button
 type="button"
 onClick={() => setShowPassword(!showPassword)}
 className="text-gray-400 hover:text-gray-500"
 >
 {showPassword ? (
 <EyeOff className="h-5 w-5" />
 ) : (
 <Eye className="h-5 w-5" />
 )}
 </button>
 }
 value={formData.password}
 onChange={handleChange}
 placeholder="••••••••"
 />
 
 <div className="flex items-center justify-between">
 <div className="flex items-center">
 <input
 id="remember-me"
 name="remember-me"
 type="checkbox"
 className="h-4 w-4 text-primary-600 -300 rounded focus:ring-primary-500"
 />
 <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
 Remember me
 </label>
 </div>
 
 <Link to="/forgot-password" className="text-sm text-primary-600 hover:text-primary-500">
 Forgot password?
 </Link>
 </div>
 
 <Button
 type="submit"
 loading={loading}
 className="w-full"
 >
 Sign in
 </Button>
 </form>
 
 <div className="mt-6">
 <div className="relative">
 <div className="absolute inset-0 flex items-center">
 <div className="w-full -300" />
 </div>
 <div className="relative flex justify-center text-sm">
 <span className="px-2 bg-white text-gray-500">Or continue with</span>
 </div>
 </div>
 
 <div className="mt-6 grid grid-cols-2 gap-3">
 <Button variant="secondary" className="w-full">
 Google
 </Button>
 <Button variant="secondary" className="w-full">
 GitHub
 </Button>
 </div>
 </div>
 </div>
 );
};

export default Login;