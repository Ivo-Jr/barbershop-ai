"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Home, CalendarDays, LogOut, LogIn } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import { SheetClose, SheetTitle } from "./ui/sheet";

const categories = [
  "Cabelo",
  "Barba",
  "Acabamento",
  "Sombrancelha",
  "Massagem",
  "Hidratação",
];

export function SideMenu() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const handleLogin = () => {
    authClient.signIn.social({
      provider: "google",
    });
  };

  const handleLogout = async () => {
    await authClient.signOut();
    router.refresh();
  };

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  const getUserInitials = (name: string | null | undefined) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (isPending) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground text-sm">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col gap-6 py-6">
      {/* Header */}
      <div className="flex items-center justify-between px-5">
        <SheetTitle className="text-lg font-bold">Menu</SheetTitle>
      </div>

      <Separator />

      {/* User Section */}
      {session ? (
        <div className="flex items-center gap-3 px-5">
          <Avatar className="size-12">
            <AvatarImage src={session.user.image || undefined} />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {getUserInitials(session.user.name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <p className="text-base font-semibold">{session.user.name}</p>
            <p className="text-muted-foreground text-xs">
              {session.user.email}
            </p>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between px-5">
          <div className="flex flex-col">
            <p className="text-base font-semibold">Olá. Faça seu login!</p>
          </div>
          <Button onClick={handleLogin} className="gap-3" size="sm">
            Login
            <LogIn className="size-4" />
          </Button>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex flex-col">
        <SheetClose asChild>
          <Button
            variant="ghost"
            className="justify-start gap-3 rounded-full px-5 py-3"
            onClick={() => handleNavigation("/")}
          >
            <Home className="size-4" />
            <span className="text-sm font-medium">Início</span>
          </Button>
        </SheetClose>
        <SheetClose asChild>
          <Button
            variant="ghost"
            className="justify-start gap-3 rounded-full px-5 py-3"
            onClick={() => handleNavigation("/bookings")}
          >
            <CalendarDays className="size-4" />
            <span className="text-sm font-medium">Agendamentos</span>
          </Button>
        </SheetClose>
      </div>

      <Separator />

      {/* Categories */}
      <div className="flex flex-col gap-1">
        {categories.map((category) => (
          <Button
            key={category}
            variant="ghost"
            className="h-10 justify-start rounded-full px-5 py-3"
            disabled
          >
            <span className="text-sm font-medium">{category}</span>
          </Button>
        ))}
      </div>

      <Separator />

      {/* Logout Button - Only show if logged in */}
      {session && (
        <SheetClose asChild>
          <Button
            variant="ghost"
            className="justify-start gap-3 rounded-full px-5 py-3"
            onClick={handleLogout}
          >
            <LogOut className="size-4" />
            <span className="text-muted-foreground text-sm font-medium">
              Sair da conta
            </span>
          </Button>
        </SheetClose>
      )}
    </div>
  );
}
