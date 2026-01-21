import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const testConnection = async () => {
    console.log('1. Reading configuration...');
    const uri = process.env.MONGODB_URI;

    if (!uri) {
        console.error('❌ Error: MONGODB_URI is undefined in .env');
        process.exit(1);
    }

    // Mask password for logging
    const maskedUri = uri.replace(/:([^:@]+)@/, ':****@');
    console.log(`2. Attempting to connect to: ${maskedUri}`);

    try {
        const conn = await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 5000
        });
        console.log('✅ SUCCESS: Connected to MongoDB!');
        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.log('\n❌ CONNECTION FAILED');
        console.log(`Error: ${error.message}`);

        if (error.name === 'MongooseServerSelectionError') {
            console.log('\n🔍 DIAGNOSIS: IP Address Blocked');
            console.log('   Go to MongoDB Atlas > Network Access > Add IP Address > Allow All (0.0.0.0/0)');
        } else if (error.code === 8000) {
            console.log('\n🔍 DIAGNOSIS: Bad Authentication');
            console.log('   Check generic password or username.');
        }
        process.exit(1);
    }
};

testConnection();
