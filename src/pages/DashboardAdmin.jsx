import { Link } from 'react-router-dom';

const DashboardAdmin = () => {
  // ...
  return (
    <div>
      <h2>Panel Admin</h2>
      <nav>
        <Link to="/admin/users">Gestionar Usuarios</Link> |{' '}
        <Link to="/admin/products">Gestionar Productos</Link> |{' '}
        <Link to="/ventas">Ver Ventas</Link>
      </nav>
      {/* Aquí puedes listar ventas como antes */}
    </div>
  );
};
export default DashboardAdmin;