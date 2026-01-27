const prisma = require('../../config/prisma');
// const prisma = require('../utils/prisma');

const customerModel = {
  async findAll() {
    return await prisma.customer.findMany({
      orderBy: { createdAt: 'desc' }
    });
  },

  async findById(id) {
    return await prisma.customer.findUnique({
      where: { id }
    });
  },

  async create(data) {
    // Only include fields that exist in the database schema
    const { 
      name, 
      email, 
      phone = '', 
      address = '', 
      status = 'active', 
      notes = '' 
    } = data;
    
    return await prisma.customer.create({
      data: {
        name,
        email,
        phone,
        address,
        status,
        notes
      }
    });
  },

  async update(id, data) {
    // Only include fields that exist in the database schema
    const { 
      name, 
      email, 
      phone, 
      address, 
      status, 
      notes 
    } = data;
    
    const updateData = {};
    
    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email;
    if (phone !== undefined) updateData.phone = phone;
    if (address !== undefined) updateData.address = address;
    if (status !== undefined) updateData.status = status;
    if (notes !== undefined) updateData.notes = notes;
    
    return await prisma.customer.update({
      where: { id },
      data: updateData
    });
  },

  async delete(id) {
    return await prisma.customer.delete({
      where: { id }
    });
  },

  async findByEmail(email) {
    return await prisma.customer.findUnique({
      where: { email }
    });
  },

  async search(query) {
    return await prisma.customer.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { email: { contains: query, mode: 'insensitive' } },
          { phone: { contains: query } },
        ]
      },
      orderBy: { createdAt: 'desc' }
    });
  }
};

module.exports = customerModel;