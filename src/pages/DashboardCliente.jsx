import React, { useEffect, useState } from 'react';

const DashboardCliente = () => {
  const [ventas, setVentas] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchVentas = async () => {
      try {
        const res = await fetch('http://localhost:8000/api/ventas/mis-ventas', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setVentas(data);
        } else {
          console.error('Error al cargar ventas');
        }
      } catch (error) {
        console.error('Error en fetch:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchVentas();
  }, [token]);

  if (loading) return <p>Cargando ventas...</p>;

  return (
    <div>
      <h1>Panel Cliente</h1>
      <h2>Tus Ventas</h2>
      {ventas.length === 0 ? (
        <p>No tienes ventas registradas.</p>
      ) : (
        ventas.map((venta) => (
          <div key={venta._id} style={{ border: '1px solid #ccc', marginBottom: '15px', padding: '10px' }}>
            <p><strong>Fecha:</strong> {new Date(venta.fecha).toLocaleDateString()}</p>
            <p><strong>Vendedor:</strong> {venta.id_vendedor?.name || 'Desconocido'}</p>
            <p><strong>Productos:</strong></p>
            <ul>
              {venta.productos.map((producto) => (
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
