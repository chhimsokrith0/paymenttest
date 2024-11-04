const express = require('express');
const checkitout = require('../../services/checkitout');
const db = require('../../config/db');
const router = express.Router();

router.post('/webhook', async (req, res) => {
  console.log('Request Headers:', req.headers);
  console.log('Webhook payload:', req.body);

  
  if (!req.body || typeof req.body !== 'object') {
    return res.status(400).json({ message: 'Invalid JSON payload' });
  }

  const { checkoutId } = req.body;
  if (!checkoutId) {
    return res.status(400).json({ message: 'Invalid checkoutId' });
  }

  try {
    const { error, data } = await checkitout.findOne(checkoutId);

    if (error) {
      return res.status(500).json(error);
    }

    const isPaid = data.transactions.some((t) => t.status === 'SUCCESS');

    if (!isPaid) {
      return res.status(400).json({ message: 'No successful transaction' });
    }

    const productId = parseInt(data.additionalInfo.id, 10);
    if (isNaN(productId) || !productId) {
      console.error('Invalid product ID:', data.additionalInfo.id);
      return res.status(400).json({ message: 'Invalid product ID' });
    }

    const updateQuery = 'UPDATE products SET status = ? WHERE id = ?';
    db.query(updateQuery, ['SUCCESS', productId], (err) => {
      if (err) {
        console.error('Database update error:', err);
        return res.status(500).json({ message: 'Failed to update product status' });
      }

      return res.status(200).json({ message: 'SUCCESS' });
    });
  } catch (error) {
    console.error('Error in webhook:', error);
    return res.status(500).json({ message: 'Server error', error });
  }
});

module.exports = router;
