import React, { useEffect, useState } from 'react';

const VentasList = ({ token }) => {
  const [ventas, setVentas] = useState([]);
  const [ubicacion, setUbicacion] = useState(null);
  const [loadingUbicacion, setLoadingUbicacion] = useState(true);
  const [errorUbicacion, setErrorUbicacion] = useState(false);

  // Fetch ventas (depende de token)
  useEffect(() => {
    fetch('http://localhost:8000/api/ventas', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setVentas(data);
        else {
          console.error("Respuesta inesperada:", data);
          setVentas([]);
        }
      })
      .catch(err => {
        console.error(err);
        setVentas([]);
      });
  }, [token]);

  // Fetch ubicación (solo se hace una vez)
  useEffect(() => {
    fetch('http://localhost:5000/api/ubicacion')
      .then(res => {
        if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);
        return res.json();
      })
      .then(data => {
        setUbicacion(data);
        setLoadingUbicacion(false);
      })
      .catch(err => {
        console.error('Error cargando ubicación:', err);
        setErrorUbicacion(true);
        setLoadingUbicacion(false);
      });
  }, []);

  return (
    <div>
      <h2>Ventas</h2>

      {loadingUbicacion && <p>Cargando ubicación de la tienda...</p>}
      {errorUbicacion && <p style={{ color: 'red' }}>Error cargando ubicación.</p>}

      {ventas.length === 0 ? (
        <p>No hay ventas registradas.</p>
      ) : (
        ventas.map(v => (
          <div key={v._id} style={{ border: '1px solid gray', margin: '10px', padding: '10px' }}>
            <p><b>Fecha:</b> {new Date(v.fecha).toLocaleDateString()}</p>
            <p><b>Vendedor:</b> {v.id_vendedor?.name}</p>
            <p><b>Cliente:</b> {v.id_cliente?.name}</p>
            <p><b>Productos:</b></p>
            <ul>
              {Array.isArray(v.productos) && v.productos.map(p => (
                <li key={p.id_producto}>
                  {p.descripcion} - Cantidad: {p.cantidad} - Precio: ${p.price}
                </li>
              ))}
            </ul>

            <p style={{ fontSize: '0.9em', color: '#555', marginBottom: '4px' }}>
              Ubicación de la tienda:
            </p>

            {ubicacion && (
              <div style={{ width: '300px', height: '150px', border: '1px solid #ccc', borderRadius: '5px', overflow: 'hidden' }}>
                <iframe
                  title="Mapa dinámico de la tienda"
                  width="100%"
                  height="100%"
                  style={{ border: 'none' }}
                  loading="lazy"
                  src={`https://www.google.com/maps?q=${ubicacion.latitud},${ubicacion.longitud}&hl=es&z=15&output=embed`}
                />
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default VentasList;
