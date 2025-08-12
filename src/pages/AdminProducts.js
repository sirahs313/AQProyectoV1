// src/pages/AdminProducts.js
import React, { useEffect, useState, useCallback } from 'react';

const AdminProducts = () => {
  const token = localStorage.getItem('token');
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ descripcion: '', price: '', stock: '' });
  const [editId, setEditId] = useState(null);
  const [mensaje, setMensaje] = useState('');

  const fetchProducts = useCallback(() => {
    fetch('http://localhost:8000/api/articles', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(setProducts)
      .catch(console.error);
  }, [token]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    const url = editId
      ? `http://localhost:8000/api/articles/${editId}`
      : 'http://localhost:8000/api/articles';
    const method = editId ? 'PUT' : 'POST';

    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(form),
    })
      .then(res => res.json())
      .then(data => {
        setMensaje(data.message || 'Operación realizada');
        setForm({ descripcion: '', price: '', stock: '' });
        setEditId(null);
        fetchProducts();
      })
      .catch(() => setMensaje('Error en la operación'));
  };

  const handleEdit = product => {
    setEditId(product.id);
    setForm({ descripcion: product.descripcion, price: product.price, stock: product.stock });
  };

  const handleDelete = id => {
    if (!window.confirm('¿Eliminar producto?')) return;
    fetch(`http://localhost:8000/api/articles/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setMensaje(data.message);
        fetchProducts();
      })
      .catch(() => setMensaje('Error al eliminar'));
  };

  return (
    <div>
      <h2>Administrar Productos</h2>
      <form onSubmit={handleSubmit}>
        <input name="descripcion" placeholder="Descripción" value={form.descripcion} onChange={handleChange} required />
        <input name="price" type="number" step="0.01" placeholder="Precio" value={form.price} onChange={handleChange} required />
        <input name="stock" type="number" placeholder="Stock" value={form.stock} onChange={handleChange} required />
        <button type="submit">{editId ? 'Actualizar' : 'Crear'}</button>
      </form>
      {mensaje && <p>{mensaje}</p>}

      <h3>Productos</h3>
      <ul>
        {products.map(p => (
          <li key={p.id}>
            {p.descripcion} - ${p.price} - Stock: {p.stock}
            <button onClick={() => handleEdit(p)}>Editar</button>
            <button onClick={() => handleDelete(p.id)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminProducts;
