import mongoose from 'mongoose';
import { DB_NAME } from '../utils/constants.js';

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}`)
    console.log(connectionInstance.connection.host);
    

    
    console.log('Database connected successfully');
  } catch (error) {
    console.log(error);
    
    process.exit(1);
  }
};

export default connectDB;
