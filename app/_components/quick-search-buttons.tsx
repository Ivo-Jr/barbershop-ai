"use client";

import {
  Scissors,
  Sparkles,
  Zap,
  Eye,
  Footprints,
  Wind,
  LucideIcon,
  Droplet,
  Hand,
} from "lucide-react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

interface QuickSearchButton {
  label: string;
  icon: LucideIcon;
}

const quickSearchOptions: QuickSearchButton[] = [
  { label: "Cabelo", icon: Scissors },
  { label: "Barba", icon: Sparkles },
  { label: "Acabamento", icon: Zap },
  { label: "Sobrancelha", icon: Eye },
  { label: "Pézinho", icon: Footprints },
  { label: "Progressiva", icon: Wind },
  { label: "Hidratação", icon: Droplet },
  { label: "Massagem", icon: Hand },
];

const QuickSearchButtons = () => {
  const router = useRouter();

  const handleQuickSearch = (label: string) => {
    router.push(`/barbershops?search=${encodeURIComponent(label)}`);
  };

  return (
    <>
      {quickSearchOptions.map((option) => (
        <Button
          key={option.label}
          variant="outline"
          className="flex items-center gap-2 rounded-full"
          onClick={() => handleQuickSearch(option.label)}
        >
          <option.icon size={16} />
          {option.label}
        </Button>
      ))}
    </>
  );
};

export default QuickSearchButtons;
