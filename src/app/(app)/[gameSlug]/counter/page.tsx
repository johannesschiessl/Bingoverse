import { getGameWithSlug } from "@/actions/game/get";
import { getCountsWithGameId } from "@/actions/counts/get";
import CounterClient from "@/components/app/counter/counter-client";

export default async function CounterPage({
  params,
}: {
  params: { gameSlug: string };
}) {
  const game = await getGameWithSlug(params.gameSlug);

  if (!game.counter_on) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center p-8 rounded-lg border">
          <h2 className="text-2xl font-semibold mb-2">Counter Disabled</h2>
          <p className="text-muted-foreground">
            The counter feature is not enabled for this game.
          </p>
        </div>
      </div>
    );
  }

  const counts = await getCountsWithGameId(game.id);

  return <CounterClient game={game} initialCounts={counts} />;
}
