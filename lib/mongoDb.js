import mongoose from "mongoose";

// ver dónde se usa connectToMongoDb
// hay que ejecutarla cuando se levanta la app
export async function connectToMongoDb() {
    const mongoDbUri = "mongodb://localhost:27017/desapp";
    await mongoose.connect(mongoDbUri, {});
}

