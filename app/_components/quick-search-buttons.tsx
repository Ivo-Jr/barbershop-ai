"use client";

import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import {
  getSearchUrl,
  QUICK_SEARCH_OPTIONS,
} from "../_constants/quick-search-buttons";

const QuickSearchButtons = () => {
  const router = useRouter();

  const handleQuickSearch = (label: string) => {
    router.push(getSearchUrl(label));
  };

  return (
    <>
      {QUICK_SEARCH_OPTIONS.map((option) => (
        <Button
          key={option.id}
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
