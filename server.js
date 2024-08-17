const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/mydatabase', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Define routes
const productsRouter = require('./routes/products');
const tokenRouter = require('./routes/token');
const purchasesRouter = require('./routes/purchases');

app.use('/api/products', productsRouter);
app.use('/api/token', tokenRouter);
app.use('/api/purchases', purchasesRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
