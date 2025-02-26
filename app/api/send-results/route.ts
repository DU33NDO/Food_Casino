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

    const botToken = process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN;
    if (!botToken) {
      throw new Error("TELEGRAM_BOT_TOKEN is not set");
    }

    await connectToDB();
    const users = await TelegramUser.find().lean();
    const chatIds = users.map((user) => user.chat_id);

    const TELEGRAM_API = `https://api.telegram.org/bot${botToken}`;

    const currentDate = new Date().toLocaleString("ru-RU", {
      timeZone: "Europe/Moscow",
      dateStyle: "medium",
      timeStyle: "short",
    });

    const message = `
🎰 РЕЗУЛЬТАТЫ КАЗИКА ПО ЕДЕ 🎰
━━━━━━━━━━━━━━━━━━━━━

🏆 ПОБЕДИТЕЛ${winners.length > 1 ? "И" : "Ь"}: ${winners
      .map((w: any) => w.toUpperCase())
      .join(", ")}

😢 ЛУЗЕРЫ: ${losers.join(", ")}

🎁 ПРИЗ: ${bet}

🕒 ${currentDate}
━━━━━━━━━━━━━━━━━━━━━
`;

    const sendPromises = chatIds.map((chatId) =>
      fetch(`${TELEGRAM_API}/sendMessage`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: "HTML",
        }),
      })
    );

    await Promise.all(sendPromises);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to send Telegram notification:", error);
    return NextResponse.json(
      { error: "Failed to send messages" },
      { status: 500 }
    );
  }
}
