import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`🗄️  MongoDB connected: ${conn.connection.host}`);

    mongoose.connection.on('connected', () => console.log('✅ Mongoose connected'));
    mongoose.connection.on('disconnected', () => console.log('⚠️ Mongoose disconnected'));
    mongoose.connection.on('error', (err) => console.error('❌ Mongoose error:', err.message));
  } catch (error) {
    console.error(`MongoDB connection failed: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
