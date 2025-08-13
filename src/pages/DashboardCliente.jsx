import React, { useEffect, useState } from 'react';

const DashboardCliente = () => {
  const [compras, setCompras] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchCompras = async () => {
      try {
        const res = await fetch('http://localhost:8000/api/ventas/mis-compras', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setCompras(data);
        } else {
          console.error('Error al cargar compras');
        }
      } catch (error) {
        console.error('Error en fetch:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCompras();
  }, [token]);

  if (loading) return <p>Cargando compras...</p>;

  return (
    <div>
      <h1>Panel Cliente</h1>
      <h2>Tus Compras</h2>
      {compras.length === 0 ? (
        <p>No tienes compras registradas.</p>
      ) : (
        compras.map((compra) => (
          <div
            key={compra._id}
            style={{ border: '1px solid #ccc', marginBottom: '15px', padding: '10px' }}
          >
            <p><strong>Fecha:</strong> {new Date(compra.fecha).toLocaleDateString()}</p>
            <p><strong>Vendedor:</strong> {compra.id_vendedor?.name || 'Desconocido'}</p>
            <p><strong>Productos:</strong></p>
            <ul>
              {compra.productos.map((producto) => (
                <li key={producto.id_producto}>
                  {producto.descripcion} - Cantidad: {producto.cantidad} - Precio unitario: ${producto.price.toFixed(2)}
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
};

export default DashboardCliente;
