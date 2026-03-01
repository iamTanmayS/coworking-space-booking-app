import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.DATABASE_URL as string);
        console.log(`[Chat Database] MongoDB Connected: ${conn.connection.host}`);
    } catch (error: any) {
        console.error(`[Chat Database] Error: ${error.message}`);
        process.exit(1);
    }
};

export default connectDB;
