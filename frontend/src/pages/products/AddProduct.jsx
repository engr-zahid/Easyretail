import React, { useState } from "react";
import { productAPI } from "../api"; // Using centralized API client

const AddProduct = () => {
  const [form, setForm] = useState({
    name: "",
    price: "",
    quantity: "",
    category: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    // Clear errors when user starts typing
    if (error) setError(null);
    if (success) setSuccess(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Using the centralized API client (recommended approach)
      const data = await productAPI.create(form);
      console.log("✅ Product added:", data);
      
      // Show success message
      setSuccess(true);
      
      // Reset form
      setForm({
        name: "",
        price: "",
        quantity: "",
        category: "",
      });

      // Optional: Show success toast/notification
      // alert("Product added successfully!"); // Keep this if you prefer alerts

    } catch (err) {
      console.error("❌ Error adding product:", err);
      setError(err.message || "Failed to add product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-product-form">
      <h2>Add New Product</h2>
      
      {/* Success Message */}
      {success && (
        <div className="alert alert-success">
          ✅ Product added successfully!
        </div>
      )}
      
      {/* Error Message */}
      {error && (
        <div className="alert alert-error">
          ❌ {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Product Name *</label>
          <input
            id="name"
            name="name"
            placeholder="Enter product name"
            value={form.name}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="price">Price *</label>
          <input
            id="price"
            name="price"
            type="number"
            placeholder="0.00"
            value={form.price}
            onChange={handleChange}
            min="0"
            step="0.01"
            required
            disabled={loading}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="quantity">Quantity *</label>
          <input
            id="quantity"
            name="quantity"
            type="number"
            placeholder="0"
            value={form.quantity}
            onChange={handleChange}
            min="0"
            required
            disabled={loading}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="category">Category</label>
          <input
            id="category"
            name="category"
            placeholder="Electronics, Clothing, etc."
            value={form.category}
            onChange={handleChange}
            disabled={loading}
          />
        </div>
        
        <button 
          type="submit" 
          disabled={loading}
          className={loading ? "btn-loading" : ""}
        >
          {loading ? (
            <>
              <span className="spinner"></span> Adding...
            </>
          ) : (
            "Add Product"
          )}
        </button>
      </form>
      
      {/* Debug info (remove in production) */}
      <div className="debug-info" style={{marginTop: '20px', fontSize: '12px', color: '#666'}}>
        <small>
          API Endpoint: {process.env.VITE_API_URL || window.location.origin}/api/products
        </small>
      </div>
    </div>
  );
};

export default AddProduct;