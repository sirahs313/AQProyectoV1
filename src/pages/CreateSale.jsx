import React, { useEffect, useState } from 'react';

const CreateSale = ({ token }) => {
  const [productos, setProductos] = useState([]);  // lista productos para seleccionar
  const [clientes, setClientes] = useState([]);    // lista clientes para seleccionar
  const [selectedCliente, setSelectedCliente] = useState('');
  const [productosVenta, setProductosVenta] = useState([]); // array { id_producto, cantidad }

  const [mensaje, setMensaje] = useState('');

  // Cargar productos y clientes desde API al montar componente
useEffect(() => {
  // Cargar productos (desde backend SQL)
  fetch('http://localhost:8000/api/articles')
    .then(res => res.json())
    .then(data => {
      // Aquí valida si data es un array, si no, trata de buscar el array dentro de data
      if (Array.isArray(data)) {
        setProductos(data);
      } else if (data && Array.isArray(data.products)) {
        setProductos(data.products);
      } else {
        setProductos([]);
        console.error('API productos no devolvió un array:', data);
      }
    })
    .catch(console.error);

  // Cargar clientes (desde backend Mongo)
  fetch('http://localhost:8000/api/users/clientes', {
    headers: { Authorization: `Bearer ${token}` }
  })
    .then(res => res.json())
    .then(data => {
      // Igual valida clientes
      if (Array.isArray(data)) {
        setClientes(data);
      } else if (data && Array.isArray(data.users)) {
        setClientes(data.users);
      } else {
        setClientes([]);
        console.error('API clientes no devolvió un array:', data);
      }
    })
    .catch(console.error);
}, [token]);

  // Agregar producto a la venta
  const agregarProducto = (id_producto) => {
    if (!id_producto) return;
    // Evitar agregar duplicados
    if (productosVenta.find(p => p.id_producto === id_producto)) return;

    setProductosVenta([...productosVenta, { id_producto, cantidad: 1 }]);
  };

  // Cambiar cantidad de un producto en la venta
  const cambiarCantidad = (id_producto, cantidad) => {
    if (cantidad < 1) return;
    setProductosVenta(productosVenta.map(p => p.id_producto === id_producto ? { ...p, cantidad } : p));
  };

  // Quitar producto de la venta
  const quitarProducto = (id_producto) => {
    setProductosVenta(productosVenta.filter(p => p.id_producto !== id_producto));
  };

  // Enviar venta al backend
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedCliente) {
      setMensaje('Selecciona un cliente');
      return;
    }
    if (productosVenta.length === 0) {
      setMensaje('Agrega al menos un producto');
      return;
    }

    try {
      const res = await fetch('http://localhost:8000/api/ventas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          productos: productosVenta,
          id_cliente: selectedCliente
        })
      });

      if (res.ok) {
        setMensaje('Venta creada con éxito');
        setSelectedCliente('');
        setProductosVenta([]);
      } else {
        const errorData = await res.json();
        setMensaje('Error: ' + (errorData.error || 'No se pudo crear la venta'));
      }
    } catch (error) {
      setMensaje('Error al conectar con el servidor');
    }
  };

  return (
    <div>
      <h2>Crear Venta</h2>
      <form onSubmit={handleSubmit}>
        <label>Cliente:</label>
        <select
          value={selectedCliente}
          onChange={e => setSelectedCliente(e.target.value)}
          required
        >
          <option value="">-- Selecciona un cliente --</option>
          {clientes.map(c => (
            <option key={c._id} value={c._id}>{c.name}</option>
          ))}
        </select>

        <h3>Productos</h3>
        <select
          onChange={e => {
            agregarProducto(Number(e.target.value));
            e.target.value = '';
          }}
          defaultValue=""
        >
          <option value="" disabled>-- Agregar producto --</option>
          {productos.map(p => (
            <option key={p.id} value={p.id}>{p.descripcion} (${p.price})</option>
          ))}
        </select>

        <ul>
          {productosVenta.map(pv => {
            const prod = productos.find(p => p.id === pv.id_producto);
            return (
              <li key={pv.id_producto}>
                {prod ? prod.descripcion : 'Producto no encontrado'} - 
                Cantidad: 
                <input
                  type="number"
                  min="1"
                  value={pv.cantidad}
                  onChange={e => cambiarCantidad(pv.id_producto, Number(e.target.value))}
                  style={{ width: '50px', marginLeft: '5px' }}
                />
                <button type="button" onClick={() => quitarProducto(pv.id_producto)} style={{ marginLeft: '10px' }}>
                  Quitar
                </button>
              </li>
            );
          })}
        </ul>

        <button type="submit">Crear Venta</button>
      </form>

      {mensaje && <p>{mensaje}</p>}
    </div>
  );
};

export default CreateSale;
