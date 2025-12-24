export const orders = [
  {
    id: '#ORD-001',
    customer: 'John Doe',
    email: 'john@example.com',
    phone: '+1 234 567 8900',
    items: [
      { product: 'Premium T-Shirt', quantity: 2, price: 29.99 },
      { product: 'Water Bottle', quantity: 1, price: 24.99 },
    ],
    subtotal: 84.97,
    tax: 8.50,
    shipping: 5.99,
    total: 99.46,
    status: 'completed',
    payment: 'Credit Card',
    shippingAddress: '123 Main St, New York, NY 10001',
    billingAddress: '123 Main St, New York, NY 10001',
    createdAt: '2024-01-15 10:30:00',
    updatedAt: '2024-01-15 14:45:00',
  },
];