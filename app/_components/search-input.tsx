"use client";

import { SearchIcon } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

const SearchInput = () => {
  const [searchValue, setSearchValue] = useState("");
  const router = useRouter();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchValue.trim()) {
      router.push(`/barbershops?search=${encodeURIComponent(searchValue)}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <Input
        type="text"
        placeholder="Pesquise serviços ou barbearias"
        className="border-border rounded-full"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
      />
      <Button
        type="submit"
        variant="default"
        size="icon"
        className="rounded-full"
      >
        <SearchIcon />
      </Button>
    </form>
  );
};

export default SearchInput;
