const db = require('../config/db');

const getProducts = (callback) => {
  db.query('SELECT * FROM products', callback);
};

const createProduct = (name, description, price, productId, image, status, callback) => {
  db.query(
    'INSERT INTO products (name, description, price, productId, image, status) VALUES (?, ?, ?, ?, ?, ?)',
    [name, description, price, productId, image, status],
    callback
  );
};

const updateProduct = (id, name, description, price, image, callback) => {
  db.query(
    'UPDATE products SET name = ?, description = ?, price = ?, image = ? WHERE id = ?',
    [name, description, price, image, id],
    callback
  );
};

const deleteProduct = (id, callback) => {
  db.query('DELETE FROM products WHERE id = ?', [id], callback);
};

const getProductById = (id, callback) => {
  db.query('SELECT * FROM products WHERE id = ?', [id], (err, results) => {
    callback(err, results[0]);
  });
};

module.exports = {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductById,
};
