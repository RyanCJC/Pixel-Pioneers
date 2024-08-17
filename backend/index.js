const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// Import routes
const productRoutes = require('./routes/products');
const tokenRoutes = require('./routes/token');
const certificateRoutes = require('./routes/smartCertificate');

// Use routes
app.use('/api/products', productRoutes);
app.use('/api/token', tokenRoutes);
app.use('/api/smart-certificate', certificateRoutes);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
