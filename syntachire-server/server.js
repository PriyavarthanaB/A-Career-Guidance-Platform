const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const resumeRoutes = require('./routes/resume');
const authRoutes = require('./routes/auth');
const problemRoutes = require("./routes/problem"); 
const moduleRoutes = require("./routes/module"); 
const interviewRoutes = require('./routes/interview');
const userRoutes = require('./routes/user');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());


// Root / Health Check Route
app.get('/', (req, res) => {
  res.send('🚀 SyntacHire AI Backend is running smoothly!');
});


// Routes
app.use('/api/resume', resumeRoutes);
app.use('/api/auth', authRoutes);
app.use("/api/problems", problemRoutes);
app.use("/api/modules", moduleRoutes);
app.use('/api/interview', interviewRoutes);
app.use('/api/user', userRoutes);

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/syntac_admin')
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => console.error('❌ MongoDB Connection Error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 SyntacHire Backend running on http://localhost:${PORT}`);
});