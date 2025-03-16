"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Square } from "@/types/square";
import { RefreshCcw } from "lucide-react";
const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

interface BingoBoardProps {
  gameTitle: string;
  squares: Square[];
}

export function BingoBoard({ gameTitle, squares = [] }: BingoBoardProps) {
  const generateBoard = useCallback(() => {
    const squareContents = squares.map(
      (square) => square.text || "Unknown event",
    );

    const shuffledContents = shuffleArray(squareContents);
    const paddedContents = [...shuffledContents];

    while (paddedContents.length < 24) {
      paddedContents.push("Empty cell");
    }

    const board = [
      ...paddedContents.slice(0, 12),
      "FREE SPACE",
      ...paddedContents.slice(12, 24),
    ];

    return board;
  }, [squares]);

  const [board, setBoard] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCells, setSelectedCells] = useState<boolean[]>(
    Array(25).fill(false),
  );
  const [hasWon, setHasWon] = useState(false);
  const [winningCells, setWinningCells] = useState<number[]>([]);
  const [markedCount, setMarkedCount] = useState(1);

  useEffect(() => {
    setLoading(true);
    console.log("Squares from database:", squares);

    const newBoard = generateBoard();
    console.log("Generated board:", newBoard);

    setBoard(newBoard);

    const initialSelectedCells = Array(25).fill(false);
    initialSelectedCells[12] = true;
    setSelectedCells(initialSelectedCells);
    setMarkedCount(1);
    setHasWon(false);
    setWinningCells([]);
    setLoading(false);
  }, [generateBoard]);

  const toggleCell = (index: number) => {
    if (index === 12) return;
    if (board[index] === "" || board[index] === "Empty cell") return;

    const newSelectedCells = [...selectedCells];
    newSelectedCells[index] = !newSelectedCells[index];
    setSelectedCells(newSelectedCells);

    setMarkedCount(newSelectedCells.filter(Boolean).length);
    checkWin(newSelectedCells);
  };

  const checkWin = (cells: boolean[]) => {
    for (let i = 0; i < 5; i++) {
      if (
        cells[i * 5] &&
        cells[i * 5 + 1] &&
        cells[i * 5 + 2] &&
        cells[i * 5 + 3] &&
        cells[i * 5 + 4]
      ) {
        setHasWon(true);
        setWinningCells([i * 5, i * 5 + 1, i * 5 + 2, i * 5 + 3, i * 5 + 4]);
        return;
      }
    }

    for (let i = 0; i < 5; i++) {
      if (
        cells[i] &&
        cells[i + 5] &&
        cells[i + 10] &&
        cells[i + 15] &&
        cells[i + 20]
      ) {
        setHasWon(true);
        setWinningCells([i, i + 5, i + 10, i + 15, i + 20]);
        return;
      }
    }

    if (cells[0] && cells[6] && cells[12] && cells[18] && cells[24]) {
      setHasWon(true);
      setWinningCells([0, 6, 12, 18, 24]);
      return;
    }

    if (cells[4] && cells[8] && cells[12] && cells[16] && cells[20]) {
      setHasWon(true);
      setWinningCells([4, 8, 12, 16, 20]);
      return;
    }

    setHasWon(false);
    setWinningCells([]);
  };

  const resetBoard = () => {
    setBoard(generateBoard());
    const newSelectedCells = Array(25).fill(false);
    newSelectedCells[12] = true;
    setSelectedCells(newSelectedCells);
    setHasWon(false);
    setWinningCells([]);
    setMarkedCount(1);
  };

  return (
    <div className="flex flex-col items-center gap-6 max-w-3xl mx-auto p-4">
      <div className="flex justify-between items-center w-full">
        <h1 className="text-2xl font-bold">{gameTitle}</h1>
        <Button onClick={resetBoard} variant="outline">
          <RefreshCcw /> Shuffle Board
        </Button>
      </div>

      <div className="w-full flex justify-between items-center">
        <div className="text-sm font-medium">
          Marked: <span className="font-bold">{markedCount}/25</span>
        </div>
        <div className="text-sm font-medium">
          To win: <span className="font-bold">5 in a row</span>
        </div>
      </div>

      {hasWon && (
        <div className="bg-green-100 dark:bg-green-900 p-4 rounded-lg w-full text-center">
          <h2 className="text-xl font-bold text-green-800 dark:text-green-200">
            BINGO! You won!
          </h2>
        </div>
      )}

      {loading ? (
        <div className="w-full h-96 flex items-center justify-center">
          <p>Loading bingo board...</p>
        </div>
      ) : board.length === 0 ? (
        <div className="w-full h-96 flex items-center justify-center">
          <p>No bingo data available. Please try again.</p>
        </div>
      ) : (
        <div className="grid grid-cols-5 gap-2 w-full">
          {board.map((content, index) => (
            <Card
              key={index}
              className={cn(
                "aspect-square flex items-center justify-center p-1 cursor-pointer transition-all overflow-hidden",
                content === "" || content === "Empty cell"
                  ? "opacity-50 cursor-not-allowed"
                  : "",
                selectedCells[index]
                  ? "bg-orange-100 ring-2 ring-orange-500 text-orange-800"
                  : "",
                winningCells.includes(index)
                  ? "bg-green-200 dark:bg-green-800 text-green-800 ring-2 ring-green-500"
                  : "",
                content === "FREE SPACE"
                  ? "bg-neutral-100 ring-neutral-500 text-neutral-800"
                  : "",
                "hover:shadow-md transform hover:-translate-y-1 transition-transform duration-200",
              )}
              onClick={() => toggleCell(index)}
            >
              <CardContent className="p-2 h-full w-full flex items-center justify-center">
                <p className="text-center text-xs sm:text-sm font-medium">
                  {content}
                </p>
                {selectedCells[index] &&
                  content !== "" &&
                  content !== "Empty cell" && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-full h-full bg-primary/10 rounded-md flex items-center justify-center"></div>
                    </div>
                  )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="flex flex-col items-center mt-4 w-full">
        <p className="text-sm text-muted-foreground mb-2">
          Click on a square when something happens!
        </p>
        <p className="text-xs text-muted-foreground italic">
          Complete 5 in a row (horizontally, vertically, or diagonally) to win.
        </p>
      </div>
    </div>
  );
}
