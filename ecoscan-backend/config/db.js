const mongoose = require('mongoose');

const connectDB = async () => {
  // Set a 10-second timeout so it fails fast instead of hanging forever
  await mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 10000,
    connectTimeoutMS: 10000,
  });
  console.log('✅ MongoDB Connected');
};

module.exports = connectDB;
