// import React from "react";
// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import { AuthProvider, useAuth } from "./context/AuthContext";

// import Login from "./pages/auth/Login";
// import Signup from "./pages/auth/Signup";
// import AdminLayout from "./layouts/AdminLayout";
// import Dashboard from "./pages/dashboard/Dashboard";

// // ProtectedRoute
// const ProtectedRoute = ({ children }) => {
//   const { user } = useAuth();
//   return user ? children : <Navigate to="/login" />;
// };

// function App() {
//   return (
//     <BrowserRouter>
//       <AuthProvider>
//         <Routes>
//           {/* Auth pages */}
//           <Route path="/login" element={<Login />} />
//           <Route path="/signup" element={<Signup />} />

//           {/* Dashboard layout + pages */}
//           <Route
//             path="/dashboard"
//             element={
//               <ProtectedRoute>
//                 <AdminLayout />
//               </ProtectedRoute>
//             }
//           >
//             <Route index element={<Dashboard />} />
//           </Route>

//           {/* Fallback */}
//           <Route path="*" element={<Navigate to="/login" />} />
//         </Routes>
//       </AuthProvider>
//     </BrowserRouter>
//   );
// }

// export default App;



import React from "react";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;