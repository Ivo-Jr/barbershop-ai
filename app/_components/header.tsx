"use client";

import Image from "next/image";
import { Button } from "./ui/button";
import { MenuIcon } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { SideMenu } from "./side-menu";

const Header = () => {
  return (
    <header className="flex items-center justify-between px-5 py-6">
      <Image src="/logo.svg" alt="Aparatus-logo" width={100} height={26.09} />
      <div className="flex items-center gap-2">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <MenuIcon />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="p-0">
            <SideMenu />
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

export default Header;
