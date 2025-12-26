import React from "react";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ProductsProvider } from "./context/ProductsContext";
import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ProductsProvider>
          <AppRoutes />
        </ProductsProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;