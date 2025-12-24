import React, { useState, useEffect } from 'react';
import { 
  User, 
  Lock, 
  Bell, 
  Mail, 
  Upload, 
  Save,
  Camera,
  Shield,
  CreditCard,
  Globe,
  Moon,
  ChevronRight,
  CheckCircle,
  XCircle
} from 'lucide-react';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [animatePage, setAnimatePage] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    // Profile
    name: 'Admin User',
    email: 'admin@example.com',
    bio: 'System Administrator',
    location: 'San Francisco, CA',
    website: 'https://admin.example.com',
    phone: '+1 (555) 987-6543',
    
    // Account
    language: 'en',
    timezone: 'America/Los_Angeles',
    currency: 'USD',
    
    // Notifications
    emailNotifications: true,
    pushNotifications: true,
    marketingEmails: false,
    securityAlerts: true,
    
    // Security
    twoFactorAuth: true,
    password: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [darkMode, setDarkMode] = useState(false);
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    setAnimatePage(true);
  }, []);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleToggle = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    console.log('Settings saved:', formData);
    setIsSaving(false);
    setShowSuccess(true);
    
    // Hide success message after 3 seconds
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User, description: 'Personal information' },
    { id: 'account', label: 'Account', icon: CreditCard, description: 'Preferences & billing' },
    { id: 'security', label: 'Security', icon: Shield, description: 'Privacy & security' },
    { id: 'notifications', label: 'Notifications', icon: Bell, description: 'Alerts & updates' },
  ];

  const renderProfileSection = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 p-4 sm:p-6 bg-gradient-to-r from-blue-50 to-slate-50 rounded-xl border border-slate-300">
        <div className="relative group">
          <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
            {profileImage ? (
              <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <User className="h-10 w-10 sm:h-12 sm:w-12 md:h-16 md:w-16 text-blue-600" />
            )}
          </div>
          <label className="absolute bottom-0 right-0 p-2 sm:p-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-all duration-300 hover:scale-110 cursor-pointer shadow-lg">
            <Camera className="h-3 w-3 sm:h-4 sm:w-4" />
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>
        </div>
        <div className="flex-1">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1 sm:mb-2">{formData.name}</h3>
          <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">{formData.bio}</p>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            <button
              onClick={() => document.querySelector('input[type="file"]').click()}
              className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-300 hover:scale-105 shadow-sm text-xs sm:text-sm"
            >
              <Upload className="h-3 w-3 sm:h-4 sm:w-4" />
              Upload New Photo
            </button>
            <button
              onClick={() => setProfileImage(null)}
              className="px-3 sm:px-4 py-2 sm:py-2.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg border border-slate-300 transition-all duration-300 hover:scale-105 text-xs sm:text-sm"
            >
              Remove Photo
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-sm sm:text-base"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-sm sm:text-base"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-sm sm:text-base"
            placeholder="+1 (555) 123-4567"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
            Location
          </label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => handleInputChange('location', e.target.value)}
            className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-sm sm:text-base"
            placeholder="City, Country"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
            Bio
          </label>
          <textarea
            value={formData.bio}
            onChange={(e) => handleInputChange('bio', e.target.value)}
            rows={3}
            className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 resize-none text-sm sm:text-base"
            placeholder="Tell us about your role..."
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
            Website
          </label>
          <div className="flex">
            <span className="inline-flex items-center px-3 py-2 sm:py-3 rounded-l-lg border border-r-0 border-slate-300 bg-gray-50 text-gray-500 text-sm">
              https://
            </span>
            <input
              type="text"
              value={formData.website.replace('https://', '')}
              onChange={(e) => handleInputChange('website', `https://${e.target.value}`)}
              className="flex-1 px-3 sm:px-4 py-2 sm:py-3 border border-slate-300 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-sm sm:text-base"
              placeholder="example.com"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderAccountSection = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
            Language
          </label>
          <div className="relative">
            <select
              value={formData.language}
              onChange={(e) => handleInputChange('language', e.target.value)}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 appearance-none bg-white text-sm sm:text-base"
            >
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
              <option value="de">Deutsch</option>
              <option value="ja">日本語</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
            Timezone
          </label>
          <div className="relative">
            <select
              value={formData.timezone}
              onChange={(e) => handleInputChange('timezone', e.target.value)}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 appearance-none bg-white text-sm sm:text-base"
            >
              <option value="America/Los_Angeles">Pacific Time (PT)</option>
              <option value="America/Denver">Mountain Time (MT)</option>
              <option value="America/Chicago">Central Time (CT)</option>
              <option value="America/New_York">Eastern Time (ET)</option>
              <option value="Europe/London">GMT (London)</option>
              <option value="Europe/Paris">CET (Paris)</option>
              <option value="Asia/Tokyo">JST (Tokyo)</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
            Currency
          </label>
          <div className="relative">
            <select
              value={formData.currency}
              onChange={(e) => handleInputChange('currency', e.target.value)}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 appearance-none bg-white text-sm sm:text-base"
            >
              <option value="USD">US Dollar ($)</option>
              <option value="EUR">Euro (€)</option>
              <option value="GBP">British Pound (£)</option>
              <option value="JPY">Japanese Yen (¥)</option>
              <option value="CAD">Canadian Dollar (C$)</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-6 border border-slate-300 rounded-xl bg-gradient-to-r from-slate-50 to-blue-50/30 hover:shadow-md transition-all duration-300">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="p-2 sm:p-3 rounded-lg bg-slate-200">
              <Moon className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-slate-700" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 text-sm sm:text-base">Dark Mode</h4>
              <p className="text-gray-600 text-xs sm:text-sm">Switch between light and dark theme</p>
            </div>
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`relative inline-flex h-6 w-11 sm:h-7 sm:w-12 md:h-8 md:w-16 items-center rounded-full transition-all duration-300 ${
              darkMode ? 'bg-blue-600' : 'bg-gray-300'
            } hover:scale-105`}
          >
            <span
              className={`inline-block h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 transform rounded-full bg-white shadow-lg transition-all duration-300 ${
                darkMode ? 'translate-x-5 sm:translate-x-6 md:translate-x-9' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      <div className="p-4 sm:p-6 border border-red-300 rounded-xl bg-gradient-to-r from-red-50 to-red-50/30">
        <div className="flex items-start gap-3 sm:gap-4">
          <div className="p-2 sm:p-3 rounded-lg bg-red-100 flex-shrink-0">
            <XCircle className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-red-600" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-red-900 text-sm sm:text-base mb-1 sm:mb-2">Danger Zone</h4>
            <p className="text-red-700 mb-3 sm:mb-4 text-xs sm:text-sm">
              Once you delete your account, all data will be permanently removed. This action cannot be undone.
            </p>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              <button className="px-3 sm:px-4 py-2 sm:py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-300 hover:scale-105 shadow-sm text-xs sm:text-sm">
                Delete Account
              </button>
              <button className="px-3 sm:px-4 py-2 sm:py-2.5 border border-slate-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-300 hover:scale-105 text-xs sm:text-sm">
                Export All Data
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSecuritySection = () => (
    <div className="space-y-6">
      <div className="space-y-4 sm:space-y-6">
        <h3 className="text-lg font-semibold text-gray-900">Change Password</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
              Current Password
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-sm sm:text-base"
              placeholder="••••••••"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
              New Password
            </label>
            <input
              type="password"
              value={formData.newPassword}
              onChange={(e) => handleInputChange('newPassword', e.target.value)}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-sm sm:text-base"
              placeholder="••••••••"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
              Confirm New Password
            </label>
            <input
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-sm sm:text-base"
              placeholder="••••••••"
            />
          </div>
        </div>
        <div className="p-3 sm:p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-blue-700 text-xs sm:text-sm">
            Password must be at least 8 characters long and include uppercase, lowercase, numbers, and special characters.
          </p>
        </div>
      </div>

      <div className="p-4 sm:p-6 border border-slate-300 rounded-xl bg-gradient-to-r from-slate-50 to-blue-50/30 hover:shadow-md transition-all duration-300">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6">
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="p-2 sm:p-3 rounded-lg bg-blue-100 flex-shrink-0">
              <Lock className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-blue-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 text-sm sm:text-base">Two-Factor Authentication</h4>
              <p className="text-gray-600 text-xs sm:text-sm mt-0.5 sm:mt-1">
                Add an extra layer of security to your account by requiring a verification code
              </p>
            </div>
          </div>
          <button
            onClick={() => handleToggle('twoFactorAuth')}
            className={`px-4 py-2 sm:px-5 sm:py-2.5 md:px-6 md:py-3 rounded-lg font-medium transition-all duration-300 hover:scale-105 text-xs sm:text-sm ${
              formData.twoFactorAuth
                ? 'bg-green-600 text-white hover:bg-green-700 shadow-sm'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {formData.twoFactorAuth ? 'Disable 2FA' : 'Enable 2FA'}
          </button>
        </div>
        {formData.twoFactorAuth && (
          <div className="mt-4 p-3 sm:p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center gap-2 sm:gap-3">
              <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
              <p className="text-green-700 text-xs sm:text-sm">
                Two-factor authentication is currently active. You'll be asked for a verification code when signing in.
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 sm:p-6 border border-slate-300 rounded-xl">
        <h4 className="font-semibold text-gray-900 mb-4 sm:mb-6 text-sm sm:text-base">Active Sessions</h4>
        <div className="space-y-3 sm:space-y-4">
          {[
            { device: 'Chrome on Windows', location: 'San Francisco, USA', time: 'Active now', current: true },
            { device: 'Safari on iPhone', location: 'New York, USA', time: '2 hours ago', current: false },
            { device: 'Firefox on Mac', location: 'London, UK', time: 'Yesterday', current: false },
          ].map((session, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 sm:p-4 hover:bg-slate-50 rounded-lg transition-colors duration-300 group"
            >
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 flex items-center justify-center flex-shrink-0">
                  <Globe className="h-4 w-4 text-blue-600" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1 sm:gap-2">
                    <p className="font-medium text-gray-900 text-xs sm:text-sm truncate">{session.device}</p>
                    {session.current && (
                      <span className="px-1.5 sm:px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full flex-shrink-0">
                        Current
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 text-xs sm:text-sm truncate">{session.location} • {session.time}</p>
                </div>
              </div>
              {!session.current && (
                <button className="text-red-600 hover:text-red-700 text-xs sm:text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Revoke
                </button>
              )}
            </div>
          ))}
        </div>
        <button className="w-full mt-3 sm:mt-4 py-2.5 sm:py-3 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all duration-300 font-medium text-sm">
          See all active sessions
        </button>
      </div>
    </div>
  );

  const renderNotificationsSection = () => (
    <div className="space-y-6">
      <div className="space-y-4 sm:space-y-6">
        {[
          { 
            id: 'emailNotifications', 
            label: 'Email Notifications', 
            description: 'Receive email updates about your account activity',
            icon: Mail 
          },
          { 
            id: 'pushNotifications', 
            label: 'Push Notifications', 
            description: 'Receive push notifications in your browser',
            icon: Bell 
          },
          { 
            id: 'marketingEmails', 
            label: 'Marketing Emails', 
            description: 'Receive emails about new features and products',
            icon: Mail 
          },
          { 
            id: 'securityAlerts', 
            label: 'Security Alerts', 
            description: 'Get notified about important security updates',
            icon: Shield 
          },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-6 border border-slate-300 rounded-xl hover:bg-slate-50/50 transition-all duration-300"
            >
              <div className="flex items-start sm:items-center gap-3 sm:gap-4 mb-3 sm:mb-0">
                <div className="p-2 sm:p-3 rounded-lg bg-blue-100 flex-shrink-0">
                  <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm sm:text-base">{item.label}</h4>
                  <p className="text-gray-600 text-xs sm:text-sm mt-0.5 sm:mt-1">{item.description}</p>
                </div>
              </div>
              <button
                onClick={() => handleToggle(item.id)}
                className={`relative inline-flex h-6 w-11 sm:h-7 sm:w-14 items-center rounded-full transition-all duration-300 ${
                  formData[item.id] ? 'bg-blue-600' : 'bg-gray-300'
                } hover:scale-105`}
              >
                <span
                  className={`inline-block h-4 w-4 sm:h-5 sm:w-5 transform rounded-full bg-white shadow-lg transition-all duration-300 ${
                    formData[item.id] ? 'translate-x-5 sm:translate-x-8' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          );
        })}
      </div>

      <div className="p-4 sm:p-6 border border-slate-300 rounded-xl">
        <h4 className="font-semibold text-gray-900 mb-4 sm:mb-6 text-sm sm:text-base">Notification Frequency</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
          {['Real-time', 'Daily Digest', 'Weekly Summary', 'Never'].map((frequency) => (
            <label
              key={frequency}
              className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 border border-slate-300 rounded-lg hover:bg-slate-50 cursor-pointer transition-all duration-300"
            >
              <input
                type="radio"
                name="frequency"
                defaultChecked={frequency === 'Real-time'}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300"
              />
              <div>
                <span className="font-medium text-gray-900 text-sm block">{frequency}</span>
                <span className="text-xs text-gray-500">
                  {frequency === 'Real-time' ? 'Instant alerts' :
                   frequency === 'Daily Digest' ? 'Once per day' :
                   frequency === 'Weekly Summary' ? 'Weekly report' : 'No notifications'}
                </span>
              </div>
            </label>
          ))}
        </div>
      </div>

      <div className="p-4 sm:p-6 border border-slate-300 rounded-xl bg-gradient-to-r from-blue-50 to-slate-50">
        <h4 className="font-semibold text-gray-900 mb-3 sm:mb-4 text-sm sm:text-base">Notification Channels</h4>
        <div className="space-y-2 sm:space-y-3">
          {['Email', 'SMS', 'Browser Push', 'Mobile App', 'Slack', 'Discord'].map((channel) => (
            <label
              key={channel}
              className="flex items-center justify-between p-3 sm:p-4 bg-white rounded-lg border border-slate-300 hover:shadow-sm transition-all duration-300"
            >
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 rounded-lg bg-gray-100">
                  <Bell className="h-3 w-3 sm:h-4 sm:w-4 text-gray-600" />
                </div>
                <span className="font-medium text-gray-900 text-sm sm:text-base">{channel}</span>
              </div>
              <input
                type="checkbox"
                defaultChecked={['Email', 'Browser Push'].includes(channel)}
                className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 rounded focus:ring-blue-500 border-slate-300"
              />
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  const renderActiveSection = () => {
    switch (activeTab) {
      case 'profile':
        return renderProfileSection();
      case 'account':
        return renderAccountSection();
      case 'security':
        return renderSecuritySection();
      case 'notifications':
        return renderNotificationsSection();
      default:
        return renderProfileSection();
    }
  };

  const activeTabData = tabs.find(t => t.id === activeTab);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 p-3 sm:p-4 md:p-6">
      {/* Success Message */}
      {showSuccess && (
        <div className="fixed top-4 right-4 sm:top-6 sm:right-6 z-50">
          <div className="flex items-center gap-2 sm:gap-3 px-4 py-3 sm:px-6 sm:py-4 bg-green-50 border border-green-200 rounded-xl shadow-lg max-w-xs sm:max-w-sm">
            <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-green-600 flex-shrink-0" />
            <div className="min-w-0">
              <p className="font-medium text-green-800 text-sm sm:text-base truncate">Settings saved successfully!</p>
              <p className="text-green-600 text-xs sm:text-sm truncate">Your changes have been applied.</p>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className={`mb-6 sm:mb-8`}>
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-1 sm:mb-2 md:mb-3">
            Settings
          </h1>
          <p className="text-gray-600 text-sm sm:text-base lg:text-lg">
            Manage your account and preferences
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:w-64">
            <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-300 shadow-sm p-3 sm:p-4 sticky top-4 sm:top-8">
              <nav className="space-y-1 sm:space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center justify-between p-3 sm:p-4 rounded-lg sm:rounded-xl transition-all duration-300 ${
                        isActive
                          ? 'bg-gradient-to-r from-blue-50 to-blue-100/50 text-blue-700 border border-blue-200'
                          : 'text-gray-700 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className={`p-1.5 sm:p-2 rounded-lg ${
                          isActive ? 'bg-blue-100' : 'bg-slate-100'
                        }`}>
                          <Icon className={`h-4 w-4 ${isActive ? 'text-blue-600' : 'text-gray-600'}`} />
                        </div>
                        <div className="text-left">
                          <span className="font-semibold text-sm sm:text-base block">{tab.label}</span>
                          <span className="text-gray-500 text-xs hidden sm:block">{tab.description}</span>
                        </div>
                      </div>
                      <ChevronRight className={`h-3 w-3 sm:h-4 sm:w-4 transition-transform duration-300 ${
                        isActive ? 'rotate-90 text-blue-600' : 'text-gray-400'
                      }`} />
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <form onSubmit={handleSubmit}>
              <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-300 shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300">
                {/* Section Header */}
                <div className="p-4 sm:p-6 md:p-8 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
                    <div>
                      <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
                        {activeTabData?.label}
                      </h2>
                      <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">
                        {activeTabData?.description}
                      </p>
                    </div>
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="flex items-center gap-2 sm:gap-3 px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-3.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-lg sm:rounded-xl hover:from-blue-600 hover:to-blue-700 active:scale-95 transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                    >
                      {isSaving ? (
                        <>
                          <div className="h-4 w-4 sm:h-5 sm:w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 sm:h-5 sm:w-5" />
                          Save Changes
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Section Content */}
                <div className="p-4 sm:p-6 md:p-8">
                  {renderActiveSection()}
                </div>

                {/* Bottom Actions */}
                <div className="p-4 sm:p-6 md:p-8 border-t border-slate-200 bg-slate-50/50">
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="flex-1 flex items-center justify-center gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-lg sm:rounded-xl hover:from-blue-600 hover:to-blue-700 active:scale-95 transition-all duration-300 hover:scale-105 shadow-md text-sm sm:text-base"
                    >
                      <Save className="h-4 w-4 sm:h-5 sm:w-5" />
                      {isSaving ? 'Saving...' : 'Save All Settings'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        // Reset form
                        setFormData({
                          name: 'Admin User',
                          email: 'admin@example.com',
                          bio: 'System Administrator',
                          location: 'San Francisco, CA',
                          website: 'https://admin.example.com',
                          phone: '+1 (555) 987-6543',
                          language: 'en',
                          timezone: 'America/Los_Angeles',
                          currency: 'USD',
                          emailNotifications: true,
                          pushNotifications: true,
                          marketingEmails: false,
                          securityAlerts: true,
                          twoFactorAuth: true,
                          password: '',
                          newPassword: '',
                          confirmPassword: '',
                        });
                        setProfileImage(null);
                        setDarkMode(false);
                      }}
                      className="flex-1 px-4 sm:px-6 py-3 sm:py-4 border-2 border-slate-300 text-gray-700 font-semibold rounded-lg sm:rounded-xl hover:bg-white active:scale-95 transition-all duration-300 hover:scale-105 text-sm sm:text-base"
                    >
                      Reset to Default
                    </button>
                  </div>
                </div>
              </div>
            </form>

            {/* Tips Card */}
            <div className="mt-6 sm:mt-8 bg-gradient-to-r from-blue-50/80 to-purple-50/80 border border-slate-300 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">Settings Tips</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
                {[
                  { icon: Shield, title: 'Security First', desc: 'Enable 2FA and use strong passwords' },
                  { icon: Bell, title: 'Stay Informed', desc: 'Keep important notifications enabled' },
                  { icon: User, title: 'Profile Complete', desc: 'Complete your profile for better experience' },
                ].map((tip, index) => {
                  const Icon = tip.icon;
                  return (
                    <div
                      key={index}
                      className="bg-white/70 backdrop-blur-sm p-3 sm:p-4 rounded-xl border border-slate-300 hover:shadow-md transition-all duration-300"
                    >
                      <div className="flex items-center gap-3 sm:gap-4 mb-2 sm:mb-3">
                        <div className="p-2 sm:p-3 rounded-lg bg-gradient-to-r from-blue-100 to-purple-100 flex-shrink-0">
                          <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                        </div>
                        <h4 className="font-semibold text-gray-900 text-sm sm:text-base">{tip.title}</h4>
                      </div>
                      <p className="text-gray-600 text-xs sm:text-sm">{tip.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;