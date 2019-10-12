import mongoose from 'mongoose';

const connectDatabase = async () => {
  const connectionString = process.env.NODE_ENV === 'development'
    ? process.env.DB_STRING_DEVELOPMENT : process.env.DB_STRING_TEST;
  try {
    const connected = await mongoose.connect(connectionString,
      { useNewUrlParser: true, useUnifiedTopology: true });
    if (connected) {
      console.info('connection has been established');
    }
  } catch (error) {
    console.info(error);
  }
};

export default connectDatabase();
