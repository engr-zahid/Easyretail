import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import AnimatedText from "../../components/AnimatedText";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const ok = login(email, password);
      
      if (ok) {
        navigate("/", { replace: true });
      } else {
        setError("Invalid email or password. Please sign up first.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Create test account
  const createTestAccount = () => {
    const testUser = {
      firstName: "Test",
      lastName: "User",
      email: "test@example.com",
      id: Date.now()
    };
    
    localStorage.setItem("user", JSON.stringify(testUser));
    localStorage.setItem("password", "password123");
    
    setEmail("test@example.com");
    setPassword("password123");
    
    alert("Test account created!\nEmail: test@example.com\nPassword: password123");
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gradient-to-br from-[#fef3c7] to-[#fbbf24]">
      {/* LEFT ANIMATED TEXT */}
      <div className="lg:w-1/2 flex items-center justify-center p-8 md:p-12 lg:p-16">
        <div className="max-w-md space-y-6 animate-fadeLeft">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900">
            Easy Retail
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
          onSubmit={handleLogin}
          className="w-full max-w-sm p-6 md:p-8 rounded-2xl bg-white shadow-2xl animate-fadeRight"
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-center text-gray-900">
            Login to Dashboard
          </h2>

          {error && (
            <div className="mb-4 md:mb-6 p-3 md:p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

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
            className="w-full mb-6 p-3 md:p-4 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-[#fbbf24] focus:border-transparent transition-all"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button 
            type="submit"
            disabled={loading}
            className={`w-full py-3 md:py-4 rounded-lg bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] text-white font-semibold hover:scale-105 transition-all duration-300 ${
              loading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>

          <p className="text-center text-sm md:text-base text-gray-600 mt-4 md:mt-6">
            No account?{" "}
            <span
              className="cursor-pointer text-[#fbbf24] hover:underline"
              onClick={() => navigate("/signup")}
            >
              Create one
            </span>
          </p>

          <div className="mt-4 md:mt-6 pt-4 md:pt-6 border-t border-gray-200">
            <button 
              type="button"
              onClick={createTestAccount}
              className="w-full py-2 md:py-3 text-sm md:text-base bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Quick Test: Create Test Account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;