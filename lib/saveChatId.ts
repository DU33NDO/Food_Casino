import TelegramUser from "@/lib/models/TelegramUser";
import { connectToDB } from "@/lib/mongodb";

export async function saveChatId(chatId: number) {
  await connectToDB();
  await TelegramUser.updateOne(
    { chat_id: chatId },
    { chat_id: chatId },
    { upsert: true }
  );
}
