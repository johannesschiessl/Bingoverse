import { getGameWithSlug } from "@/actions/game/get";
import { getSquaresWithGameId } from "@/actions/squares/get";
import { BingoBoard } from "@/components/app/game/bingo-board";

type Params = Promise<{ gameSlug: string }>;

export default async function GamePage({ params }: { params: Params }) {
  const gameParams = await params;
  const game = await getGameWithSlug(gameParams.gameSlug);
  const squares = await getSquaresWithGameId(game.id);

  console.log("Game:", game);
  console.log("Retrieved squares:", squares);

  const squaresToUse =
    squares.length > 0
      ? squares
      : Array(24)
          .fill(0)
          .map((_, i) => ({
            id: i,
            content: `Fallback square ${i + 1}`,
            game_id: game.id,
          }));

  return (
    <div className="container mx-auto py-6">
      <BingoBoard gameTitle={game.name} squares={squaresToUse} />
    </div>
  );
}
