import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const DashboardVendedor = () => {
  const [ventas, setVentas] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    fetch('http://localhost:8000/api/ventas', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const idVendedor = payload.id;

        const ventasVendedor = data.filter(v => {
          const vendedorId = v.id_vendedor?._id || v.id_vendedor;
          return String(vendedorId) === String(idVendedor);
        });

        setVentas(ventasVendedor);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (!token) {
    return (
      <div style={styles.container}>
        <h1>Panel Vendedor</h1>
        <p style={styles.error}>No has iniciado sesión.</p>
      </div>
    );
  }

  return (
    <>
      {/* Navbar */}
      <header style={styles.navbar}>
        <div style={styles.logo}>MiSistema</div>
        <nav style={styles.navLinks}>
          <Link to="/crear-venta" style={styles.navLink}>Generar venta</Link>
     
          {/* Puedes agregar más links si quieres */}
        </nav>
        <button onClick={handleLogout} style={styles.logoutButton}>
          Cerrar Sesión
        </button>
      </header>

      {/* Contenido principal */}
      <div style={{ ...styles.container, marginTop: 80 }}>
        <h1 style={styles.title}>Panel Vendedor</h1>

        <h2 style={styles.subtitle}>Ventas realizadas</h2>

        {loading ? (
          <p>Cargando ventas...</p>
        ) : ventas.length === 0 ? (
          <p>No tienes ventas registradas.</p>
        ) : (
          ventas.map((venta) => (
            <div key={venta._id} style={styles.ventaCard}>
              <p><strong>Fecha:</strong> {new Date(venta.fecha).toLocaleDateString()}</p>
              <p><strong>Cliente:</strong> {venta.id_cliente?.name || 'Cliente no encontrado'}</p>
              <p><strong>Productos:</strong></p>
              <ul>
                {venta.productos.map((p) => (
                  <li key={p.id_producto}>
                    {p.descripcion} - Cantidad: {p.cantidad} - Precio: ${p.price.toFixed(2)}
                  </li>
                ))}
              </ul>
            </div>
          ))
        )}
      </div>
    </>
  );
};

const styles = {
  navbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#007bff',
    padding: '0 20px',
    height: 60,
    color: 'white',
  },
  logo: {
    fontWeight: '700',
    fontSize: '1.5rem',
  },
  navLinks: {
    display: 'flex',
    gap: '25px',
  },
  navLink: {
    color: 'white',
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: '1rem',
    transition: 'color 0.3s ease',
  },
  logoutButton: {
    backgroundColor: '#dc3545',
    border: 'none',
    padding: '8px 14px',
    borderRadius: '4px',
    color: 'white',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  container: {
    maxWidth: 900,
    margin: '20px auto',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    padding: '0 15px',
    color: '#333',
  },
  title: {
    textAlign: 'center',
    color: '#007bff',
    marginBottom: 20,
    fontWeight: '700',
    fontSize: '2rem',
  },
  subtitle: {
    marginTop: 30,
    marginBottom: 15,
    fontSize: '1.5rem',
    borderBottom: '2px solid #007bff',
    paddingBottom: 8,
  },
  ventaCard: {
    border: '1px solid #ddd',
    borderRadius: 6,
    padding: 15,
    marginBottom: 15,
    backgroundColor: '#fafafa',
  },
  error: {
    color: 'red',
    textAlign: 'center',
  },
};

export default DashboardVendedor;
