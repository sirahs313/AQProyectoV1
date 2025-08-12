// scripts/loadProducts.js
const sequelize = require('../backend/db.mysql.js');
const Product = require('../backend/models/Product');



async function loadProducts() {
  await sequelize.sync(); // asegurarse que tablas existen

  const products = [];
  for(let i = 1; i <= 200; i++) {
    products.push({
      descripcion: `Producto ${i}`,
      price: (Math.random() * 100).toFixed(2),
      stock: Math.floor(Math.random() * 100) + 1
    });
  }

  await Product.bulkCreate(products);
  console.log('200 productos insertados');
  process.exit(0);
}

loadProducts().catch(console.error);
