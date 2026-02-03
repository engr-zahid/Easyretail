
// src/models/orderModel.js
const prisma = require('../../config/prisma'); // Import from your config file

const orderModel = {
  async getAllOrders() {
    try {
      console.log('📋 Fetching all orders from database...');
      
      const orders = await prisma.order.findMany({
        include: {
          customer: true,
          orderItems: {
            include: {
              product: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
      
      console.log(`✅ Found ${orders.length} orders in database`);
      return orders;
      
    } catch (error) {
      console.error('❌ Error in getAllOrders:', error);
      return [];
    }
  },

  async createOrder(orderData) {
    try {
      console.log('🔄 Creating order in database...');
      console.log('Input:', JSON.stringify(orderData, null, 2));
      
      // Validate
      if (!orderData.items || orderData.items.length === 0) {
        throw new Error('Order must have at least one item');
      }
      
      // Calculate total
      const totalAmount = orderData.items.reduce((sum, item) => {
        return sum + (item.price * item.quantity);
      }, 0);
      
      // Generate order number
      const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
      
      // Create order
      const order = await prisma.order.create({
        data: {
          orderNumber,
          customerId: orderData.customerId || null,
          totalAmount,
          status: 'PENDING',
          paymentMethod: orderData.paymentMethod || 'CASH',
          notes: orderData.notes || '',
          orderItems: {
            create: orderData.items.map(item => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price,
              subtotal: item.price * item.quantity
            }))
          }
        },
        include: {
          customer: true,
          orderItems: {
            include: {
              product: true
            }
          }
        }
      });
      
      console.log('✅ Order created successfully!');
      console.log('Order ID:', order.id);
      console.log('Order Number:', order.orderNumber);
      console.log('Total:', order.totalAmount);
      
      // Update product quantities
      for (const item of orderData.items) {
        await prisma.product.update({
          where: { id: item.productId },
          data: {
            quantity: {
              decrement: item.quantity
            }
          }
        });
      }
      
      return {
        id: order.id,
        orderNumber: order.orderNumber,
        customerId: order.customerId,
        customer: order.customer,
        totalAmount: order.totalAmount,
        status: order.status,
        paymentMethod: order.paymentMethod,
        notes: order.notes,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
        orderItems: order.orderItems
      };
      
    } catch (error) {
      console.error('❌ Error creating order:', error);
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        code: error.code,
        meta: error.meta
      });
      throw error;
    }
  },

  async deleteOrder(id) {
    try {
      console.log(`Deleting order ${id}`);
      
      // First, get order items to update product quantities
      const order = await prisma.order.findUnique({
        where: { id },
        include: {
          orderItems: true
        }
      });
      
      if (order) {
        // Restore product quantities
        for (const item of order.orderItems) {
          await prisma.product.update({
            where: { id: item.productId },
            data: {
              quantity: {
                increment: item.quantity
              }
            }
          });
        }
      }
      
      // Delete order items first
      await prisma.orderItem.deleteMany({
        where: { orderId: id }
      });
      
      // Delete order
      const deletedOrder = await prisma.order.delete({
        where: { id }
      });
      
      console.log('Order deleted successfully');
      return deletedOrder;
    } catch (error) {
      console.error('Error in deleteOrder model:', error);
      throw error;
    }
  },

  async updateOrderStatus(id, status) {
    try {
      console.log(`Updating order status ${id} to ${status}`);
      
      const order = await prisma.order.update({
        where: { id },
        data: { status },
        include: {
          customer: true,
          orderItems: {
            include: {
              product: true
            }
          }
        }
      });
      
      console.log('Order status updated successfully');
      return order;
    } catch (error) {
      console.error('Error in updateOrderStatus model:', error);
      throw error;
    }
  },

  async getStats() {
    try {
      console.log('Fetching order stats...');
      
      const totalOrders = await prisma.order.count();
      const completedOrders = await prisma.order.count({
        where: { status: 'COMPLETED' }
      });
      const pendingOrders = await prisma.order.count({
        where: { 
          OR: [
            { status: 'PENDING' },
            { status: 'PROCESSING' }
          ]
        }
      });
      const totalRevenue = await prisma.order.aggregate({
        where: { status: 'COMPLETED' },
        _sum: { totalAmount: true }
      });

      return {
        totalOrders,
        completedOrders,
        pendingOrders,
        totalRevenue: totalRevenue._sum.totalAmount || 0
      };
    } catch (error) {
      console.error('Error in getStats model:', error);
      return {
        totalOrders: 0,
        completedOrders: 0,
        pendingOrders: 0,
        totalRevenue: 0
      };
    }
  }
};

module.exports = orderModel;