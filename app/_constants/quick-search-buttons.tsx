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

interface QuickSearchOption {
  id: string;
  label: string;
  icon: LucideIcon;
}

export const QUICK_SEARCH_OPTIONS: QuickSearchOption[] = [
  { id: "cabelo", label: "Cabelo", icon: Scissors },
  { id: "barba", label: "Barba", icon: Sparkles },
  { id: "acabamento", label: "Acabamento", icon: Zap },
  { id: "sobrancelha", label: "Sobrancelha", icon: Eye },
  { id: "pezinho", label: "Pézinho", icon: Footprints },
  { id: "progressiva", label: "Progressiva", icon: Wind },
  { id: "hidratação", label: "Hidratação", icon: Droplet },
  { id: "massagem", label: "Massagem", icon: Hand },
];

export const getSearchUrl = (searchTerm: string): string => {
  return `/barbershops?search=${encodeURIComponent(searchTerm)}`;
};
