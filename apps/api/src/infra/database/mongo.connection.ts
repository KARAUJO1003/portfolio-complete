import mongoose from "mongoose";
import { env } from "../../config/env";

export async function connectMongo() {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  await mongoose.connect(env.mongodbUri);
  return mongoose.connection;
}
