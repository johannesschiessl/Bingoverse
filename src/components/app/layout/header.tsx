import Link from "next/link";
import { LayoutGrid, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Header() {
  return (
    <header className="p-4 flex items-center justify-between">
      <Link href="/" className="flex items-center gap-2">
        <LayoutGrid className="size-8 p-1 bg-orange-100 text-orange-500 rounded-md" />
        <span className="text-xl font-bold">Eventverse</span>
      </Link>
      <Link href="/new">
        <Button variant="outline">
          <Plus className="size-4" />
          New Game
        </Button>
      </Link>
    </header>
  );
}
