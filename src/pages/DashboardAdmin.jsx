import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ReporteVentas from './ReporteVentas';  // Ajusta la ruta según tu proyecto

const DashboardAdmin = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div style={styles.pageContainer}>
      {/* Navbar */}
      <header style={styles.navbar}>
        <div style={styles.logo}>MiSistema</div>
        <nav style={styles.navLinks}>
          <Link to="/dashboard-admin" style={styles.navLink}>Inicio</Link>  {/* este va al dashboard */}
          <Link to="/admin/users" style={styles.navLink}>Usuarios</Link>
          <Link to="/admin/products" style={styles.navLink}>Productos</Link>
          <Link to="/ventas" style={styles.navLink}>Ventas</Link>
    
        </nav>
        <button onClick={handleLogout} style={styles.logoutButton}>
          Cerrar Sesión
        </button>
      </header>

      {/* Main content */}
      <main style={styles.mainContent}>
        <h1 style={styles.title}>Panel de Administración</h1>
        <section style={styles.welcomeSection}>
          <h2>Bienvenido al panel de administración</h2>
          <p>
            Desde aquí puedes gestionar usuarios, productos, consultar ventas y reportes. Usa la
            barra de navegación para acceder a las diferentes secciones.
          </p>
        </section>

        {/* Aquí mostramos el reporte completo abajo */}
        <ReporteVentas />
      </main>
    </div>
  );
};

const styles = {
  pageContainer: {
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    minHeight: '100vh',
    backgroundColor: '#f8f9fa',
  },
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
  mainContent: {
    maxWidth: 960,
    margin: '40px auto',
    padding: '0 20px',
    backgroundColor: 'white',
    borderRadius: 8,
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  },
  title: {
    textAlign: 'center',
    color: '#007bff',
    marginBottom: 30,
  },
  welcomeSection: {
    fontSize: '1.1rem',
    color: '#333',
    lineHeight: 1.6,
  },
};

export default DashboardAdmin;
