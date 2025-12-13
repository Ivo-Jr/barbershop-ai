import Header from "./_components/header";
import SearchInput from "./_components/search-input";
import Image from "next/image";
import banner from "@/public/banner.png";

export default function Home() {
  return (
    <div>
      <Header />
      <div className="space-y-4 px-5">
        <SearchInput />
        <Image
          src={banner}
          alt="Banner Aparatus"
          sizes="100vw"
          className="h-auto w-full"
        />
      </div>
    </div>
  );
}
