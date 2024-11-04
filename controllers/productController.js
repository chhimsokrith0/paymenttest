// controllers/productController.js
const productModel = require('../models/productModel');
const { createPayment } = require('../actions');

// Get all products
const getProducts = (req, res) => {
  productModel.getProducts((err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch products' });
    }
    res.json(results);
  });
};

// Create a new product
// Create a new product
const createProduct = (req, res) => {
  const { name, description, price, productId } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : null;
  const status = 'PENDING'; // Default status

  productModel.createProduct(name, description, price, productId, image, status, (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to create product' });
    }
    res.status(201).json({ message: 'Product created successfully', productId: result.insertId });
  });
};


// Update an existing product
const updateProduct = (req, res) => {
  const { id } = req.params;
  const { name, description, price } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : req.body.image;

  productModel.updateProduct(id, name, description, price, image, (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to update product' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ message: 'Product updated successfully' });
  });
};

// Delete a product
const deleteProduct = (req, res) => {
  const { id } = req.params;

  productModel.deleteProduct(id, (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to delete product' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully!' });
  });
};

const handlePayment = (req, res) => {
  const { id } = req.body;

  productModel.getProductById(id, async (err, product) => {
    if (err) {
      console.error("Database error while fetching product:", err);
      return res.status(500).json({ error: 'Database error' });
    }

    if (!product) {
      console.warn("Product not found for ID:", id);
      return res.status(404).json({ error: 'Product not found' });
    }

    try {
      const paymentResult = await createPayment(product);

      if (paymentResult.url) {
        res.json({ url: paymentResult.url });
      } else {
        console.error("Failed to initiate payment:", paymentResult.error);
        res.status(500).json({ error: paymentResult.error || 'Payment creation failed' });
      }
    } catch (error) {
      console.error("Server error during payment creation:", error);
      res.status(500).json({ error: 'Server error during payment creation' });
    }
  });
};


module.exports = {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  handlePayment,
};
