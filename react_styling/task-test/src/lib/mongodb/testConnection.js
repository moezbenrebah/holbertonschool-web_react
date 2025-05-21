import mongoose from 'mongoose';

const MONGODB_URI = "mongodb+srv://gharsallighaith31:draX8PrSA01T0pfm@cluster0.r338m.mongodb.net/Holberton_Social_Media?retryWrites=true&w=majority";

const testConnection = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    
    console.log("✅ Connexion réussie à MongoDB !");
    mongoose.connection.close();
  } catch (error) {
    console.error("❌ Erreur de connexion :", error);
  }
};

testConnection();
