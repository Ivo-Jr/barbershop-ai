"use client";

import { Smartphone } from "lucide-react";
import { Button } from "./ui/button";

interface PhoneItemProps {
  phone: string;
}

const PhoneItem = ({ phone }: PhoneItemProps) => {
  const handleCopyPhone = async () => {
    try {
      await navigator.clipboard.writeText(phone);
    } catch (err) {
      console.error("Failed to copy phone number:", err);
    }
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2.5">
        <Smartphone className="size-6" />
        <p className="text-foreground text-sm">{phone}</p>
      </div>
      <Button
        variant="outline"
        className="h-auto rounded-full px-4 py-2 text-sm"
        onClick={handleCopyPhone}
      >
        Copiar
      </Button>
    </div>
  );
};

export default PhoneItem;
