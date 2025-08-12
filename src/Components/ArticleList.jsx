import React, { useEffect, useState } from 'react';

const ArticleList = () => {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8000/api/articles')
      .then(res => res.json())
      .then(data => setArticles(data))
      .catch(console.error);
  }, []);

  return (
    <div>
      <h2>Lista de Productos</h2>
      <ul>
        {articles.map(a => (
          <li key={a.id || a._id}>
            {a.descripcion} - ${a.price} - Stock: {a.stock}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ArticleList;
