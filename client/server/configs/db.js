import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    let mongoURI = process.env.MONGODB_URI_DIRECT || process.env.MONGODB_URI || 'mongodb://localhost:27017/prince-cinema';

    // If the direct URI came with query params but no database, insert it before the query string
    if (!mongoURI.includes('/prince-cinema') && mongoURI.includes('?')) {
      mongoURI = mongoURI.replace('?', '/prince-cinema?');
    }

    console.log('Connecting to MongoDB...');
    console.log('Using direct URI:', !!process.env.MONGODB_URI_DIRECT);
    console.log('URI format:', mongoURI.includes('mongodb+srv') ? 'SRV' : 'Standard');

    mongoose.connection.on('connected', () => {
      console.log('\n✓✓✓ Database connected successfully ✓✓✓\n');
    });

    mongoose.connection.on('error', (err) => {
      console.log('✗ Database error:', err.message);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('Database disconnected');
    });

    // await mongoose.connect(mongoURI, {
    //   maxPoolSize: 10,
    //   minPoolSize: 5,
    //   retryWrites: true,
    //   w: 'majority',
    //   serverSelectionTimeoutMS: 10000,
    //   socketTimeoutMS: 45000,
    //   family: 4,
    // });
    await mongoose.connect(mongoURI);
    console.log("MongoDB Connected Successfully");
  } catch (error) {
    console.log('\n✗ Connection failed:', error.message);
    console.log('\nTROUBLESHOOTING:');
    console.log('1. Verify IP is whitelisted (use 0.0.0.0/0 for testing)');
    console.log('2. Check password has no special characters');
    console.log('3. Disable VPN if active');
    console.log('4. Ensure port 27017 not blocked\n');
    console.log('Retrying in 5 seconds...\n');
    setTimeout(() => connectDB(), 5000);
  }
};

export default connectDB;

