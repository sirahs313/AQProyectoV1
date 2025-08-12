const express = require('express');
const router = express.Router();
const Venta = require('../models/Venta');
const Product = require('../models/Product'); // Modelo Sequelize para productos
const { verifyToken, allowRoles } = require('../middlewares/auth');

// Crear venta y otras rutas (si tienes, poner aquí)

// GET /api/ventas con detalle completo de productos (solo admin y vendedor)
router.get('/', verifyToken, allowRoles('admin', 'vendedor'), async (req, res) => {
  try {
    const ventas = await Venta.find()
      .populate('id_vendedor', 'name email role')
      .populate('id_cliente', 'name email role');

    // Mapeamos ventas para incluir detalle completo de productos desde MySQL
    const ventasConDetalle = await Promise.all(
      ventas.map(async (venta) => {
        const productosConDetalle = await Promise.all(
          venta.productos.map(async (p) => {
            const prodSQL = await Product.findOne({ where: { id: p.id_producto } });
            return {
              id_producto: p.id_producto,
              cantidad: p.cantidad,
              descripcion: prodSQL ? prodSQL.descripcion : 'Producto no encontrado',
              price: prodSQL ? prodSQL.price : 0,
            };
          })
        );

        return {
          _id: venta._id,
          fecha: venta.fecha,
          id_vendedor: venta.id_vendedor,
          id_cliente: venta.id_cliente,
          productos: productosConDetalle,
        };
      })
    );

    res.json(ventasConDetalle); // Siempre enviamos array para evitar errores en frontend
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error en servidor' });
  }
});

module.exports = router;
