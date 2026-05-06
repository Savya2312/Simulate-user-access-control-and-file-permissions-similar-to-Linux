const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');
const seedAdmin = require('./config/seeder');

// Load env vars
dotenv.config();

// Connect to database
connectDB().then(() => {
  // Seed admin user after DB connection
  seedAdmin();
});

const app = express();

// Body parser
app.use(express.json());

// Enable CORS with specific options
app.use(cors({
  origin: '*', // For development, allow all. In production, specify frontend URL.
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Dev logging middleware
app.use(morgan('dev'));

// Custom logging for auth attempts
app.use((req, res, next) => {
  if (req.path.includes('/api/auth')) {
    console.log(`[AUTH] ${req.method} ${req.path} - ${new Date().toISOString()}`);
    if (req.body && req.body.username) {
      console.log(`[AUTH] User: ${req.body.username}`);
    }
  }
  next();
});

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/groups', require('./routes/groupRoutes'));
app.use('/api/files', require('./routes/fileRoutes'));
app.use('/api/logs', require('./routes/logRoutes'));

app.get('/', (req, res) => {
  res.send('Linux Permission Simulator API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log('----------------------------------------');
  console.log(`BACKEND SERVER INITIALIZED`);
  console.log(`Port: ${PORT}`);
  console.log(`Mode: ${process.env.NODE_ENV || 'development'}`);
  console.log('----------------------------------------');
});
