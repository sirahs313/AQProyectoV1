// src/pages/AdminUsers.js
import React, { useEffect, useState, useCallback } from 'react';

const AdminUsers = () => {
  const token = localStorage.getItem('token');
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'cliente' });
  const [editId, setEditId] = useState(null);
  const [mensaje, setMensaje] = useState('');

  const fetchUsers = useCallback(() => {
    fetch('http://localhost:8000/api/users', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(setUsers)
      .catch(console.error);
  }, [token]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    const url = editId
      ? `http://localhost:8000/api/users/${editId}`
      : 'http://localhost:8000/api/users';
    const method = editId ? 'PUT' : 'POST';

    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(form),
    })
      .then(res => res.json())
      .then(data => {
        setMensaje(data.message || 'Operación realizada');
        setForm({ name: '', email: '', password: '', role: 'cliente' });
        setEditId(null);
        fetchUsers();
      })
      .catch(() => setMensaje('Error en la operación'));
  };

  const handleEdit = user => {
    setEditId(user._id);
    setForm({ name: user.name, email: user.email, password: '', role: user.role });
  };

  const handleDelete = id => {
    if (!window.confirm('¿Eliminar usuario?')) return;
    fetch(`http://localhost:8000/api/users/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setMensaje(data.message);
        fetchUsers();
      })
      .catch(() => setMensaje('Error al eliminar'));
  };

  return (
    <div>
      <h2>Administrar Usuarios</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Nombre" value={form.name} onChange={handleChange} required />
        <input name="email" type="email" placeholder="Correo" value={form.email} onChange={handleChange} required />
        <input name="password" type="password" placeholder="Contraseña" value={form.password} onChange={handleChange}  />
        <select name="role" value={form.role} onChange={handleChange} required>
          <option value="cliente">Cliente</option>
          <option value="vendedor">Vendedor</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit">{editId ? 'Actualizar' : 'Crear'}</button>
      </form>
      {mensaje && <p>{mensaje}</p>}

      <h3>Usuarios</h3>
      <ul>
        {users.map(u => (
          <li key={u._id}>
            {u.name} ({u.email}) - {u.role}
            <button onClick={() => handleEdit(u)}>Editar</button>
            <button onClick={() => handleDelete(u._id)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminUsers;
