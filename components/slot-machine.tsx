"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";

const symbols = ["🍔", "🥤", "🍟", "🌭", "🍕", "😈"];

export function SlotMachine({
  onSpin,
  onAutoWin,
}: {
  onSpin: (result: string[]) => void;
  onAutoWin: () => void;
}) {
  const [reels, setReels] = useState(["❓", "❓", "❓"]);
  const [spinning, setSpinning] = useState(false);
  const [spinInterval, setSpinInterval] = useState<NodeJS.Timeout | null>(null);

  const stopSpin = useCallback(() => {
    if (spinInterval) {
      clearInterval(spinInterval);
    }
    setSpinning(false);
    const result = reels.map(
      () => symbols[Math.floor(Math.random() * symbols.length)]
    );
    setReels(result);

    if (result.every((symbol) => symbol === "😈")) {
      onAutoWin();
    } else {
      onSpin(result);
    }
  }, [reels, spinInterval, onSpin, onAutoWin]);

  const spin = () => {
    setSpinning(true);
    const interval = setInterval(() => {
      setReels(
        reels.map(() => symbols[Math.floor(Math.random() * symbols.length)])
      );
    }, 100);
    setSpinInterval(interval);
  };

  useEffect(() => {
    return () => {
      if (spinInterval) {
        clearInterval(spinInterval);
      }
    };
  }, [spinInterval]);

  return (
    <div className="text-center p-8 md:p-10 bg-white rounded-2xl shadow-lg">
      <div className="text-7xl md:text-8xl mb-8 font-mono bg-[#F2F2F2] p-6 md:p-8 rounded-xl flex justify-between gap-4 md:gap-8">
        {reels.map((symbol, index) => (
          <span
            key={index}
            className="flex-1 flex items-center justify-center min-w-[80px] bg-white rounded-lg shadow-sm py-6 md:py-8"
          >
            {symbol}
          </span>
        ))}
      </div>
      <div className="space-y-4 md:space-y-0 md:space-x-4 flex flex-col md:flex-row justify-center">
        <Button
          onClick={spin}
          disabled={spinning}
          className="bg-[#2D3250] hover:bg-[#232842] px-8 py-6 text-lg rounded-xl 
            shadow-md transition-all hover:shadow-lg disabled:opacity-50 mb-8"
        >
          {spinning ? "Крутимся... 🎰" : "Крутить 🎲"}
        </Button>
        <Button
          onClick={stopSpin}
          disabled={!spinning}
          className="bg-[#FF6B6B] hover:bg-[#ff5252] px-8 py-6 text-lg rounded-xl 
            shadow-md transition-all hover:shadow-lg disabled:opacity-50"
        >
          Остановить ✋
        </Button>
      </div>
    </div>
  );
}
