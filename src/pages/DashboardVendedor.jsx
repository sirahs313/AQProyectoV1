import React, { useEffect, useState } from 'react';

const DashboardVendedor = () => {
  const [ventas, setVentas] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) return;

    fetch('http://localhost:8000/api/ventas', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        // Extraer id vendedor del token
        const payload = JSON.parse(atob(token.split('.')[1]));
        const idVendedor = payload.id;

        // Convertir a string para evitar problemas de tipo
        const ventasVendedor = data.filter(v => 
          v.id_vendedor._id.toString() === idVendedor.toString()
        );

        setVentas(ventasVendedor);
      })
      .catch(console.error);
  }, [token]);

  return (
    <div>
      <h2>Ventas realizadas</h2>
      {ventas.length === 0 ? (
        <p>No tienes ventas registradas.</p>
      ) : (
        ventas.map((venta) => (
          <div key={venta._id}>
            <p><strong>Fecha:</strong> {new Date(venta.fecha).toLocaleDateString()}</p>
            <p><strong>Cliente:</strong> {venta.id_cliente.name}</p>
            <p><strong>Productos:</strong></p>
            <ul>
              {venta.productos.map((p) => (
                <li key={p.id_producto}>
                  {p.descripcion} - Cantidad: {p.cantidad} - Precio: ${p.price}
                </li>
              ))}
            </ul>
            <hr />
          </div>
        ))
      )}
    </div>
  );
};

export default DashboardVendedor;
