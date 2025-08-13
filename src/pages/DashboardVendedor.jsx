import React, { useEffect, useState } from 'react';
import CreateSale from './CreateSale';

const DashboardVendedor = () => {
  const [ventas, setVentas] = useState([]);
  const [mostrarCrear, setMostrarCrear] = useState(false);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) return;

    fetch('http://localhost:8000/api/ventas', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        console.log('Ventas recibidas:', data);

        const payload = JSON.parse(atob(token.split('.')[1]));
        const idVendedor = payload.id;
        console.log('ID vendedor del token:', idVendedor);

        const ventasVendedor = data.filter(v => {
          const vendedorId = v.id_vendedor?._id || v.id_vendedor;
          console.log('Venta id_vendedor:', vendedorId);
          return String(vendedorId) === String(idVendedor);
        });

        setVentas(ventasVendedor);
      })
      .catch(console.error);
  }, [token]);

  return (
    <div>
      <h1>Panel Vendedor</h1>

      <button onClick={() => setMostrarCrear(!mostrarCrear)}>
        {mostrarCrear ? 'Cerrar formulario' : 'Generar venta'}
      </button>

      {mostrarCrear && <CreateSale token={token} />}

      <h2>Ventas realizadas</h2>
      {ventas.length === 0 ? (
        <p>No tienes ventas registradas.</p>
      ) : (
        ventas.map((venta) => (
          <div key={venta._id} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
            <p><strong>Fecha:</strong> {new Date(venta.fecha).toLocaleDateString()}</p>
            <p><strong>Cliente:</strong> {venta.id_cliente?.name || 'Cliente no encontrado'}</p>
            <p><strong>Productos:</strong></p>
            <ul>
              {venta.productos.map((p) => (
                <li key={p.id_producto}>
                  {p.descripcion} - Cantidad: {p.cantidad} - Precio: ${p.price}
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
};

export default DashboardVendedor;
