const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const jobRoutes = require('./routes/jobs');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: 'http://localhost:3000' })); // Allow requests from the React client
app.use(express.json()); // Parse incoming JSON request bodies

// Routes
app.use('/api/auth', authRoutes); // /api/auth/register and /api/auth/login
app.use('/api/jobs', jobRoutes);  // /api/jobs (get, add, update, delete)

// Health check — visit http://localhost:5000 to confirm the server is running
app.get('/', (req, res) => {
  res.json({ message: 'Job Tracker API is running.' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
