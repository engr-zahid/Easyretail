import React, { useState, useEffect } from 'react';
import { Sparkles, Package, ShoppingBag, TrendingUp, Users, RefreshCw, CheckCircle } from 'lucide-react';

const Loader = ({ 
  type = "default", 
  message = "Loading...",
  size = "medium",
  fullScreen = false,
  progress = null,
  showTips = true,
  estimatedTime = 3 
}) => {
  const [tipIndex, setTipIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(estimatedTime);
  const [dots, setDots] = useState(".");
  
  const loadingTips = [
    { icon: Package, text: "Organizing your inventory", color: "from-blue-500 to-cyan-500" },
    { icon: ShoppingBag, text: "Processing recent orders", color: "from-emerald-500 to-green-500" },
    { icon: TrendingUp, text: "Analyzing sales data", color: "from-purple-500 to-pink-500" },
    { icon: Users, text: "Updating customer records", color: "from-amber-500 to-orange-500" },
    { icon: Sparkles, text: "Optimizing dashboard", color: "from-indigo-500 to-violet-500" }
  ];

  const sizeConfig = {
    small: { container: "h-6 w-6 sm:h-8 sm:w-8", spinner: "h-6 w-6 sm:h-8 sm:w-8", border: "border-2", text: "text-sm" },
    medium: { container: "h-10 w-10 sm:h-12 sm:w-12", spinner: "h-10 w-10 sm:h-12 sm:w-12", border: "border-3", text: "text-base sm:text-lg" },
    large: { container: "h-14 w-14 sm:h-16 sm:w-16", spinner: "h-14 w-14 sm:h-16 sm:w-16", border: "border-4", text: "text-lg sm:text-xl" },
    xlarge: { container: "h-16 w-16 sm:h-20 sm:w-20", spinner: "h-16 w-16 sm:h-20 sm:w-20", border: "border-4", text: "text-xl sm:text-2xl" }
  };

  const typeConfig = {
    default: { gradient: "from-blue-500 via-purple-500 to-pink-500", bgGradient: "from-blue-500/20 to-purple-500/20" },
    success: { gradient: "from-emerald-500 to-green-500", bgGradient: "from-emerald-500/20 to-green-500/20" },
    warning: { gradient: "from-amber-500 to-orange-500", bgGradient: "from-amber-500/20 to-orange-500/20" },
    error: { gradient: "from-rose-500 to-pink-500", bgGradient: "from-rose-500/20 to-pink-500/20" },
    processing: { gradient: "from-indigo-500 to-purple-500", bgGradient: "from-indigo-500/20 to-purple-500/20" }
  };

  useEffect(() => {
    const tipInterval = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % loadingTips.length);
    }, 3000);
    return () => clearInterval(tipInterval);
  }, []);

  useEffect(() => {
    const dotsInterval = setInterval(() => {
      setDots(prev => {
        if (prev === "...") return ".";
        return prev + ".";
      });
    }, 500);
    return () => clearInterval(dotsInterval);
  }, []);

  useEffect(() => {
    if (estimatedTime > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 0) {
            clearInterval(timer);
            return 0;
          }
          return prev - 0.1;
        });
      }, 100);
      return () => clearInterval(timer);
    }
  }, [estimatedTime]);

  const CurrentTip = loadingTips[tipIndex].icon;
  const currentTip = loadingTips[tipIndex];

  return (
    <div className={`
      ${fullScreen 
        ? "fixed inset-0 z-50 bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center" 
        : "flex items-center justify-center min-h-[200px]"}
      transition-all duration-300
    `}>
      <div className="relative z-10 w-full max-w-md mx-auto p-4 sm:p-6 md:p-8">
        <div className="text-center">
          {/* Animated logo/brand */}
          <div className="flex justify-center mb-6">
            <div className={`
              ${sizeConfig[size].container} rounded-2xl 
              bg-gradient-to-r ${typeConfig[type].bgGradient}
              flex items-center justify-center
              shadow-2xl
            `}>
              <div className={`
                ${sizeConfig[size].container} rounded-xl
                bg-gradient-to-r ${typeConfig[type].gradient}
                animate-spin
                flex items-center justify-center
              `}>
                <div className="h-3/4 w-3/4 rounded-lg bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
                  <Sparkles className={`${size === "small" ? "h-3 w-3" : size === "large" ? "h-5 w-5 sm:h-6 sm:w-6" : "h-4 w-4"} text-white`} />
                </div>
              </div>
            </div>
          </div>

          {/* Progress bar */}
          {progress !== null && (
            <div className="mb-6">
              <div className="flex justify-between text-sm text-slate-400 mb-2">
                <span>Loading</span>
                <span>{progress}%</span>
              </div>
              <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden">
                <div 
                  className={`h-full bg-gradient-to-r ${typeConfig[type].gradient} rounded-full transition-all duration-300`}
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Main message */}
          <h2 className={`
            ${sizeConfig[size].text} 
            font-bold text-white mb-4 sm:mb-6
          `}>
            {message}
            <span className="inline-block w-6 text-left">{dots}</span>
          </h2>

          {/* Current activity tip */}
          {showTips && (
            <div className="mb-6">
              <div className="inline-flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 rounded-xl bg-slate-800/50 border border-slate-700/50 max-w-sm mx-auto">
                <div className={`h-8 w-8 sm:h-10 sm:w-10 rounded-lg bg-gradient-to-r ${currentTip.color} flex items-center justify-center flex-shrink-0`}>
                  <CurrentTip className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                </div>
                <span className="text-sm text-slate-300 text-left">{currentTip.text}</span>
              </div>
            </div>
          )}

          {/* Estimated time */}
          {fullScreen && estimatedTime > 0 && (
            <div className="mb-6">
              <div className="inline-flex items-center gap-2 text-sm text-slate-400">
                <span>Estimated time remaining:</span>
                <span className="font-semibold text-white">{timeLeft.toFixed(1)}s</span>
              </div>
            </div>
          )}

          {/* Additional info for fullscreen */}
          {fullScreen && (
            <>
              {/* Tips carousel indicators */}
              <div className="flex justify-center gap-1.5 mb-6">
                {loadingTips.map((_, index) => (
                  <div
                    key={index}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      index === tipIndex 
                        ? `w-4 sm:w-6 bg-gradient-to-r ${typeConfig[type].gradient}` 
                        : 'w-1.5 bg-slate-700'
                    }`}
                  />
                ))}
              </div>

              {/* Helpful tips */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6 max-w-md mx-auto">
                <div className="text-left p-3 rounded-lg bg-slate-800/30 border border-slate-700/30">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="h-5 w-5 rounded-full bg-gradient-to-r from-blue-500/20 to-cyan-500/20 flex items-center justify-center">
                      <CheckCircle className="h-3 w-3 text-blue-400" />
                    </div>
                    <span className="text-xs font-medium text-slate-300">ShopSphere Pro</span>
                  </div>
                  <p className="text-xs text-slate-400">Your shop management system</p>
                </div>
                
                <div className="text-left p-3 rounded-lg bg-slate-800/30 border border-slate-700/30">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="h-5 w-5 rounded-full bg-gradient-to-r from-emerald-500/20 to-green-500/20 flex items-center justify-center">
                      <RefreshCw className="h-3 w-3 text-emerald-400" />
                    </div>
                    <span className="text-xs font-medium text-slate-300">Auto Refresh</span>
                  </div>
                  <p className="text-xs text-slate-400">Data updates in real-time</p>
                </div>
              </div>
            </>
          )}

          {/* Optional action buttons for fullscreen */}
          {fullScreen && (
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white 
                  bg-slate-800/50 hover:bg-slate-700/50 rounded-lg border border-slate-700/50 
                  transition-all duration-300 flex items-center justify-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh Page
              </button>
              
              <button
                onClick={() => console.log("Skip loading")}
                className="px-4 py-2 text-sm font-medium text-white 
                  bg-gradient-to-r from-slate-700/50 to-slate-800/50 
                  hover:from-slate-600/50 hover:to-slate-700/50
                  rounded-lg border border-slate-700/50 
                  transition-all duration-300"
              >
                Skip Loading
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const Spinner = ({ size = "medium", color = "default" }) => {
  const sizeClasses = {
    small: "h-5 w-5 sm:h-6 sm:w-6",
    medium: "h-7 w-7 sm:h-8 sm:w-8",
    large: "h-10 w-10 sm:h-12 sm:w-12"
  };

  const colorClasses = {
    default: "border-blue-500",
    success: "border-emerald-500",
    warning: "border-amber-500",
    error: "border-rose-500"
  };

  return (
    <div className="flex items-center justify-center">
      <div className={`${sizeClasses[size]} rounded-full border-2 ${colorClasses[color]} border-t-transparent animate-spin`}></div>
    </div>
  );
};

export const PageLoader = ({ message = "Loading page..." }) => (
  <Loader 
    type="processing" 
    message={message} 
    size="large" 
    fullScreen={true} 
    showTips={true}
    estimatedTime={5}
  />
);

export const InlineLoader = ({ message = "Loading" }) => (
  <div className="inline-flex items-center gap-2">
    <Spinner size="small" />
    <span className="text-sm text-slate-600 dark:text-slate-400">{message}</span>
  </div>
);

export const ButtonLoader = () => (
  <div className="flex items-center gap-2">
    <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
    <span>Loading...</span>
  </div>
);

export default Loader;