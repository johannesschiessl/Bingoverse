"use client";

import { Count } from "@/types/count";
import { PlusCircleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface CounterItemProps {
  count: Count;
  onIncrement: () => void;
}

export default function CounterItem({ count, onIncrement }: CounterItemProps) {
  return (
    <Card>
      <CardHeader className="flex justify-between items-center mb-2">
        <CardTitle>{count.name}</CardTitle>
      </CardHeader>
      <CardContent className="text-3xl font-bold text-center py-4">
        {count.count}
      </CardContent>
      <CardFooter>
        <Button onClick={onIncrement} variant="outline" className="w-full">
          <PlusCircleIcon />
          Increment
        </Button>
      </CardFooter>
    </Card>
  );
}
