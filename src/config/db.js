import mongoose from "mongoose";

export const connectDB = async (mongoURL, dbName) => {
    try {
        await mongoose.connect(mongoURL, {dbName:dbName})
        console.log("MongoDB Connectado");
    } catch (error) {
        console.log(`Error al conectarse con la DB :(`)
    }
}