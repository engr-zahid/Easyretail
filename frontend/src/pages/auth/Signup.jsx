import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import AnimatedText from "../../components/AnimatedText";

const Signup = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { signup, login } = useAuth();
  const navigate = useNavigate();

  const handleSignup = (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validation
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      setError("All fields are required");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    try {
      // Create account
      const signupSuccess = signup(firstName, lastName, email, password);
      
      if (signupSuccess) {
        // Auto-login after successful signup
        const loginSuccess = login(email, password);
        
        if (loginSuccess) {
          navigate("/", { replace: true });
        } else {
          setError("Account created! Please login manually.");
        }
      } else {
        setError("Failed to create account");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gradient-to-br from-[#fef3c7] to-[#fbbf24]">
      {/* LEFT INFO */}
     <div className="lg:w-1/2 flex items-center justify-center p-8 md:p-12 lg:p-16">
        <div className="max-w-md space-y-6 animate-fadeLeft">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900">
            Join Easy Retail
          </h1>
          <div className="text-lg md:text-xl text-gray-800">
            <AnimatedText
              text="A powerful digital retail management system designed to simplify inventory tracking, sales monitoring, customer handling, and business growth."
            />
          </div>
        </div>
      </div>

      {/* RIGHT FORM */}
      <div className="lg:w-1/2 flex items-center justify-center p-8 md:p-12 lg:p-16">
        <form
          onSubmit={handleSignup}
          className="w-full max-w-sm p-6 md:p-8 rounded-2xl bg-white shadow-2xl"
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-center text-gray-900">
            Create Account
          </h2>

          {error && (
            <div className="mb-4 md:mb-6 p-3 md:p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              placeholder="First Name"
              className="w-full p-3 md:p-4 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-[#fbbf24] focus:border-transparent transition-all"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Last Name"
              className="w-full p-3 md:p-4 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-[#fbbf24] focus:border-transparent transition-all"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>

          <input
            type="email"
            placeholder="Email"
            className="w-full mb-4 p-3 md:p-4 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-[#fbbf24] focus:border-transparent transition-all"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full mb-4 p-3 md:p-4 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-[#fbbf24] focus:border-transparent transition-all"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Confirm Password"
            className="w-full mb-6 p-3 md:p-4 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-[#fbbf24] focus:border-transparent transition-all"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <button 
            type="submit"
            disabled={loading}
            className={`w-full py-3 md:py-4 rounded-lg bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] text-white font-semibold hover:scale-105 transition-all duration-300 ${
              loading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>

          <p className="text-center text-sm md:text-base text-gray-600 mt-4 md:mt-6">
            Already have an account?{" "}
            <span
              className="cursor-pointer text-[#fbbf24] hover:underline"
              onClick={() => navigate("/login")}
            >
              Login
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;