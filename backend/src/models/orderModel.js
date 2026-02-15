const prisma = require('../../config/prisma');

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

  async getOrderById(id) {
    try {
      const order = await prisma.order.findUnique({
        where: { id },
        include: {
          customer: true,
          orderItems: {
            include: {
              product: true
            }
          }
        }
      });
      return order;
    } catch (error) {
      console.error('Error in getOrderById:', error);
      throw error;
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

      // Update customer statistics
      if (orderData.customerId) {
        try {
          // Get current customer
          const customer = await prisma.customer.findUnique({
            where: { id: orderData.customerId }
          });

          if (customer) {
            // Update customer stats
            await prisma.customer.update({
              where: { id: orderData.customerId },
              data: {
                totalOrders: (customer.totalOrders || 0) + 1,
                totalSpent: (parseFloat(customer.totalSpent || 0) + totalAmount).toFixed(2),
                lastActive: new Date()
              }
            });
            console.log('✅ Customer statistics updated');
          }
        } catch (customerError) {
          console.error('⚠️ Error updating customer statistics:', customerError);
          // Don't fail the whole order if customer update fails
        }
      }

      // Update product statistics
      try {
        for (const item of orderData.items) {
          // Update product stock and sales
          await prisma.product.update({
            where: { id: item.productId },
            data: {
              quantity: {
                decrement: item.quantity
              },
              sales: {
                increment: item.quantity
              },
              updatedAt: new Date()
            }
          });

          console.log(`✅ Product ${item.productId} updated: -${item.quantity} stock, +${item.quantity} sales`);
        }
      } catch (productError) {
        console.error('⚠️ Error updating product statistics:', productError);
        // Continue even if product updates fail
      }

      return order;

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

      // First, get order with all details
      const order = await prisma.order.findUnique({
        where: { id },
        include: {
          customer: true,
          orderItems: true
        }
      });

      if (order) {
        // Restore customer statistics
        if (order.customerId) {
          try {
            const customer = await prisma.customer.findUnique({
              where: { id: order.customerId }
            });

            if (customer) {
              await prisma.customer.update({
                where: { id: order.customerId },
                data: {
                  totalOrders: Math.max(0, (customer.totalOrders || 1) - 1),
                  totalSpent: Math.max(0, (parseFloat(customer.totalSpent || 0) - order.totalAmount)).toFixed(2)
                }
              });
              console.log('✅ Customer statistics restored');
            }
          } catch (customerError) {
            console.error('⚠️ Error restoring customer statistics:', customerError);
          }
        }

        // Restore product stock & sales
        for (const item of order.orderItems) {
          try {
            await prisma.product.update({
              where: { id: item.productId },
              data: {
                quantity: {
                  increment: item.quantity
                },
                sales: {
                  decrement: item.quantity
                }
              }
            });
            console.log(`✅ Product ${item.productId} stock restored: +${item.quantity}`);
          } catch (productError) {
            console.error(`⚠️ Error restoring product ${item.productId}:`, productError);
          }
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

      // If order is completed, update last purchase date for customer
      if (status === 'COMPLETED' && order.customerId) {
        try {
          await prisma.customer.update({
            where: { id: order.customerId },
            data: {
              lastActive: new Date()
            }
          });
          console.log('✅ Customer last active updated');
        } catch (customerError) {
          console.error('⚠️ Error updating customer last active:', customerError);
        }
      }

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
  },

  // Get orders by customer ID
  async getOrdersByCustomer(customerId) {
    try {
      const orders = await prisma.order.findMany({
        where: { customerId },
        include: {
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
      return orders;
    } catch (error) {
      console.error('Error in getOrdersByCustomer:', error);
      return [];
    }
  },

  // Get recent orders summary
  async getRecentOrdersSummary(limit = 10) {
    try {
      const orders = await prisma.order.findMany({
        take: limit,
        include: {
          customer: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          orderItems: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  category: true
                }
              }
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
      return orders;
    } catch (error) {
      console.error('Error in getRecentOrdersSummary:', error);
      return [];
    }
  }
};

module.exports = orderModel;