import { connectToDB } from "@/lib/mongodb";
import TelegramUser from "@/lib/models/TelegramUser";

export async function fetchTelegramUpdates() {
  try {
    const botToken = process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN;
    if (!botToken) throw new Error("TELEGRAM_BOT_TOKEN is not set");

    const TELEGRAM_API = `https://api.telegram.org/bot${botToken}`;
    const updatesResponse = await fetch(`${TELEGRAM_API}/getUpdates`);

    if (!updatesResponse.ok) {
      throw new Error(`HTTP error! Status: ${updatesResponse.status}`);
    }

    const updates = await updatesResponse.json();

    await connectToDB();

    for (const update of updates.result) {
      if (update.message?.chat?.id) {
        await TelegramUser.updateOne(
          { chat_id: update.message.chat.id },
          { chat_id: update.message.chat.id },
          { upsert: true }
        );
      }
    }
  } catch (error) {
    console.error("Failed to fetch Telegram updates:", error);
  }
}
