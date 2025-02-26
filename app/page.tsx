"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const participants = ["Руслан", "Герман", "Ильяс", "Коля", "Дания"];
const predefinedBets = [
  "бесплатный глоток напитка",
  "бесплатный укус бургера",
  "ВЕСЬ БУРГЕР",
];

export default function Home() {
  const router = useRouter();
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>(
    []
  );
  const [customBet, setCustomBet] = useState("");
  const [selectedBet, setSelectedBet] = useState("");

  const handleParticipantChange = (value: string) => {
    if (selectedParticipants.includes(value)) {
      setSelectedParticipants(selectedParticipants.filter((p) => p !== value));
    } else {
      setSelectedParticipants([...selectedParticipants, value]);
    }
  };

  const handleStart = () => {
    const bet = selectedBet || customBet;
    router.push(
      `/game?participants=${selectedParticipants.join(
        ","
      )}&bet=${encodeURIComponent(bet)}`
    );
  };

  return (
    <div className="min-h-screen bg-[#F2F2F2] py-8">
      <div className="container mx-auto p-8 max-w-md bg-white rounded-3xl shadow-lg">
        <h1 className="text-4xl font-bold mb-8 text-[#2D3250]">КАЗИНО ЕДЫ</h1>

        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-[#F2F2F2]">
            <label className="block text-lg font-medium mb-3 text-[#2D3250]">
              Выберите Игроков
            </label>
            <div className="grid grid-cols-2 gap-3">
              {participants.map((participant) => (
                <button
                  key={participant}
                  onClick={() => handleParticipantChange(participant)}
                  className={`p-4 rounded-xl transition-all duration-200 text-lg font-medium
                    ${
                      selectedParticipants.includes(participant)
                        ? "bg-[#2D3250] text-white shadow-md translate-y-[-2px]"
                        : "bg-white text-[#2D3250] hover:shadow-md hover:translate-y-[-2px]"
                    }
                  `}
                >
                  {participant}
                  {selectedParticipants.includes(participant) && (
                    <span className="ml-2 text-[#FF6B6B]">●</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[#F2F2F2]">
            <label className="block text-lg font-medium mb-3 text-[#2D3250]">
              Выберите Приз
            </label>
            <Select onValueChange={setSelectedBet}>
              <SelectTrigger className="bg-white border-none shadow-sm hover:shadow">
                <SelectValue placeholder="Выберите приз" />
              </SelectTrigger>
              <SelectContent>
                {predefinedBets.map((bet) => (
                  <SelectItem key={bet} value={bet}>
                    {bet}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="p-6 rounded-2xl bg-[#F2F2F2]">
            <label
              htmlFor="customBet"
              className="block text-lg font-medium mb-3 text-[#2D3250]"
            >
              Другой Приз
            </label>
            <Input
              id="customBet"
              value={customBet}
              onChange={(e) => setCustomBet(e.target.value)}
              placeholder="Напишите любой приз"
              className="bg-white border-none shadow-sm hover:shadow"
            />
          </div>

          <Button
            onClick={handleStart}
            disabled={
              selectedParticipants.length === 0 || (!selectedBet && !customBet)
            }
            className="w-full bg-[#FF6B6B] hover:bg-[#ff5252] text-white text-lg py-6 rounded-xl 
              shadow-md transition-all hover:shadow-lg disabled:opacity-50 disabled:hover:shadow-md"
          >
            Начнем 🎲
          </Button>
        </div>
      </div>
    </div>
  );
}
