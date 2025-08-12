const { DataTypes } = require('sequelize');
const sequelize = require('../db.mysql.js');

const Product = sequelize.define('Product', {
  descripcion: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: 'products', // nombre de tu tabla en MySQL
  timestamps: false,
});

module.exports = Product;
