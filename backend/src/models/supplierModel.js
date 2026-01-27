const prisma = require('../../config/prisma');

const supplierModel = {
  async findAll() {
    return await prisma.supplier.findMany({
      orderBy: { createdAt: 'desc' }
    });
  },

  async findById(id) {
    return await prisma.supplier.findUnique({
      where: { id }
    });
  },

  async create(data) {
    // Extract only fields that exist in the database schema
    const { 
      name, 
      email, 
      phone = null, 
      address = null, 
      company = null, 
      status = 'active', 
      notes = null 
    } = data;
    
    return await prisma.supplier.create({
      data: {
        name,
        email,
        phone,
        address,
        company,
        status,
        notes
      }
    });
  },

  async update(id, data) {
    // Extract only fields that exist in the database schema
    const { 
      name, 
      email, 
      phone, 
      address, 
      company, 
      status, 
      notes 
    } = data;
    
    // Build update object with only provided fields
    const updateData = {};
    
    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email;
    if (phone !== undefined) updateData.phone = phone;
    if (address !== undefined) updateData.address = address;
    if (company !== undefined) updateData.company = company;
    if (status !== undefined) updateData.status = status;
    if (notes !== undefined) updateData.notes = notes;
    
    return await prisma.supplier.update({
      where: { id },
      data: updateData
    });
  },

  async delete(id) {
    return await prisma.supplier.delete({
      where: { id }
    });
  },

  async findByEmail(email) {
    return await prisma.supplier.findUnique({
      where: { email }
    });
  },

  async search(query) {
    return await prisma.supplier.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { email: { contains: query, mode: 'insensitive' } },
          { company: { contains: query, mode: 'insensitive' } },
          { phone: { contains: query } },
        ]
      },
      orderBy: { createdAt: 'desc' }
    });
  }
};

module.exports = supplierModel;