"use client";

import Image from "next/image";
import { Button } from "./ui/button";
import { MenuIcon, MessageCircle } from "lucide-react";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "./ui/sheet";
import { SideMenu } from "./side-menu";
import Link from "next/link";

const Header = () => {
  return (
    <header className="flex items-center justify-between px-5 py-6">
      <Link href="/">
        <Image src="/logo.svg" alt="Aparatus-logo" width={100} height={26.09} />
      </Link>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" asChild>
          <Link href="/chat">
            <MessageCircle className="size-4" />
          </Link>
        </Button>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <MenuIcon />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="p-0">
            <SheetTitle className="sr-only">Menu de navegação</SheetTitle>
            <SideMenu />
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

export default Header;
