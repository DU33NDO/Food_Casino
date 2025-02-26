import mongoose from "mongoose";
import { fetchTelegramUpdates } from "@/lib/fetchTelegramUpdates";

const MONGODB_URI = process.env.NEXT_PUBLIC_MONGODB_URI;

export async function connectToDB() {
  if (mongoose.connection.readyState >= 1) return;
  await mongoose.connect(MONGODB_URI as string);

  fetchTelegramUpdates();
}
