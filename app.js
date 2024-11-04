const express = require('express');
const path = require('path');
const productRoutes = require('./routes/productRoutes');
const webhook = require('./api/webhook/webhook');
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', productRoutes);
app.use('/api', webhook);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
