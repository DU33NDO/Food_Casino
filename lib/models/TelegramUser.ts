import mongoose, { Schema, model } from "mongoose";

const TelegramUserSchema = new Schema({
  chat_id: { type: Number, required: true, unique: true },
});

const TelegramUser =
  mongoose.models.TelegramUser || model("TelegramUser", TelegramUserSchema);

export default TelegramUser;
