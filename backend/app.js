const express = require('express');
const dotenv = require('dotenv');
const countryRoutes = require('./src/routes/countryRoutes');
const cors = require('cors');

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000', // Replace with your frontend URL
}));
// Routes
app.use('/api/countries', countryRoutes);



const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
