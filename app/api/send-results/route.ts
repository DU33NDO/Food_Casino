import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import TelegramUser from "@/lib/models/TelegramUser";

export async function POST(req: Request) {
  try {
    const { winners, losers, bet } = await req.json();
    if (!winners || !losers || !bet) {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    if (!botToken) {
      throw new Error("TELEGRAM_BOT_TOKEN is not set");
    }

    await connectToDB();
    const users = await TelegramUser.find().lean();
    const chatIds = users.map((user) => user.chat_id);

    const TELEGRAM_API = `https://api.telegram.org/bot${botToken}`;

    const sendMessage = async (chatId: string) => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2000);

        const response = await fetch(`${TELEGRAM_API}/sendMessage`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            chat_id: chatId,
            text: message,
            parse_mode: "HTML",
          }),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        return true;
      } catch (error) {
        console.error(`Failed to send message to chat ${chatId}:`, error);
        return false;
      }
    };

    const currentDate = new Date().toLocaleString("ru-RU", {
      timeZone: "Asia/Almaty",
      dateStyle: "medium",
      timeStyle: "short",
    });

    const message = `
🎰 РЕЗУЛЬТАТЫ КАЗИКА ПО ЕДЕ 🎰
━━━━━━━━━━━━━━━━━━━━━

🏆 ПОБЕДИТЕЛ${winners.length > 1 ? "И" : "Ь"}: ${winners
      .map((w: string) => w.toUpperCase())
      .join(", ")}

😢 ЛУЗЕРЫ: ${losers.join(", ")}

🎁 ПРИЗ: ${bet}

🕒 ${currentDate}
━━━━━━━━━━━━━━━━━━━━━
`;

    const batchSize = 3;
    const results = [];

    for (let i = 0; i < chatIds.length; i += batchSize) {
      const batch = chatIds.slice(i, i + batchSize);
      const batchResults = await Promise.all(batch.map(sendMessage));
      results.push(...batchResults);
    }

    const successCount = results.filter(Boolean).length;

    if (successCount === 0) {
      return NextResponse.json(
        { error: "Failed to send all messages" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      sentCount: successCount,
      totalCount: chatIds.length,
    });
  } catch (error) {
    console.error("Failed to send Telegram notifications:", error);
    return NextResponse.json(
      { error: "Failed to send messages" },
      { status: 500 }
    );
  }
}
