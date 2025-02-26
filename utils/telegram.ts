// export async function sendGameResults(
//   winners: string[],
//   losers: string[],
//   bet: string
// ) {
//   try {
//     const botToken = process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN;
//     if (!botToken) {
//       throw new Error("TELEGRAM_BOT_TOKEN is not set");
//     }

//     const TELEGRAM_API = `https://api.telegram.org/bot${botToken}`;

//     const updatesResponse = await fetch(`${TELEGRAM_API}/getUpdates`);

//     if (!updatesResponse.ok) {
//       throw new Error(`HTTP error! status: ${updatesResponse.status}`);
//     }

//     const updates = await updatesResponse.json();

//     const chatIds = [
//       ...new Set(
//         updates.result
//           .map((update: any) => update.message?.chat.id)
//           .filter(Boolean)
//       ),
//     ];

//     const currentDate = new Date().toLocaleString("ru-RU", {
//       timeZone: "Europe/Moscow",
//       dateStyle: "medium",
//       timeStyle: "short",
//     });

//     const message = `
// 🎰 РЕЗУЛЬТАТЫ КАЗИКА ПО ЕДЕ 🎰
// ━━━━━━━━━━━━━━━━━━━━━

// 🏆 ПОБЕДИТЕЛ${winners.length > 1 ? "И" : "Ь"}: ${winners
//       .map((w) => w.toUpperCase())
//       .join(", ")}

// 😢 ЛУЗЕРЫ: ${losers.join(", ")}

// 🎁 ПРИЗ: ${bet}

// 🕒 ${currentDate}
// ━━━━━━━━━━━━━━━━━━━━━
// `;

//     const sendPromises = chatIds.map((chatId) =>
//       fetch(`${TELEGRAM_API}/sendMessage`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           chat_id: chatId,
//           text: message,
//           parse_mode: "HTML",
//         }),
//       })
//     );

//     await Promise.all(sendPromises);
//     return true;
//   } catch (error) {
//     console.error("Failed to send Telegram notification:", error);
//     return false;
//   }
// }
