const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('@prisma/client');

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('FATAL: DATABASE_URL is not set. Set DATABASE_URL in environment or .env file.');
  process.exit(1);
}

console.log('Using DATABASE_URL from environment');

let adapter;
try {
  adapter = new PrismaPg({ connectionString });
} catch (err) {
  console.error('Failed to create PrismaPg adapter:', err && err.message ? err.message : err);
  process.exit(1);
}

const prisma = new PrismaClient({ adapter });

module.exports = prisma;