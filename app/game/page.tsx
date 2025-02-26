"use client";

import { useSearchParams } from "next/navigation";
import { SlotMachine } from "@/components/slot-machine";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
// import { sendGameResults } from "@/utils/telegram";

export default function GamePage() {
  const searchParams = useSearchParams();
  const participants = searchParams.get("participants")?.split(",") || [];
  const bet = searchParams.get("bet") || "";

  const [currentParticipant, setCurrentParticipant] = useState(0);
  const [results, setResults] = useState<{ [key: string]: string[] }>({});
  const [gameOver, setGameOver] = useState(false);

  async function handleSendResults(
    winners: string[],
    losers: string[],
    bet: string
  ) {
    const response = await fetch("/api/send-results", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ winners, losers, bet }),
    });
    const result = await response.json();
    console.log(result);
  }

  const handleSpin = async (result: string[]) => {
    setResults({ ...results, [participants[currentParticipant]]: result });

    if (currentParticipant < participants.length - 1) {
      setCurrentParticipant(currentParticipant + 1);
    } else {
      setGameOver(true);

      const winners = determineWinner();
      const losers = participants.filter((p) => !winners.includes(p));
      await handleSendResults(winners, losers, bet);
    }
  };

  const determineWinner = () => {
    let maxScore = -1;
    let winners: string[] = [];

    Object.entries(results).forEach(([participant, result]) => {
      const score = result.filter(
        (symbol, index) => result.indexOf(symbol) === index
      ).length;
      if (score > maxScore) {
        maxScore = score;
        winners = [participant];
      } else if (score === maxScore) {
        winners.push(participant);
      }
    });

    return winners;
  };

  return (
    <div className="min-h-screen bg-[#F2F2F2] flex justify-center items-center p-4">
      <div className="container mx-auto p-6 sm:p-8 max-w-lg bg-white rounded-3xl shadow-lg text-center">
        <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-[#2D3250]">
          Казино Германа
        </h1>
        <p className="text-lg sm:text-xl mb-6 font-medium text-[#2D3250]/80">
          Приз: {bet}
        </p>

        {!gameOver ? (
          <>
            <p className="text-xl sm:text-2xl mb-6 font-medium text-[#2D3250] animate-pulse">
              Крутит - {participants[currentParticipant]}
            </p>
            <SlotMachine
              onSpin={handleSpin}
              onAutoWin={() => setGameOver(true)}
            />
          </>
        ) : (
          <div className="p-6 rounded-2xl bg-[#F2F2F2]">
            <h2 className="text-2xl font-bold mb-4 text-[#2D3250]">
              Game Over!
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2 text-[#2D3250]">
                  Результаты:
                </h3>
                {Object.entries(results).map(([participant, result]) => (
                  <p
                    key={participant}
                    className="py-3 px-4 bg-white rounded-lg shadow-sm text-lg mb-4"
                  >
                    <span className="font-medium">{participant}:</span>{" "}
                    {result.join(" ")}
                  </p>
                ))}
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2 text-[#2D3250]">
                  Победитель:
                </h3>
                <p className="text-2xl font-bold text-[#FF6B6B]">
                  {determineWinner().join(", ")}
                </p>
              </div>
              <Button
                onClick={() => (window.location.href = "/")}
                className="w-full bg-[#FF6B6B] hover:bg-[#ff5252] text-white text-lg py-4 mt-6 rounded-xl"
              >
                Снова? 🎮
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
