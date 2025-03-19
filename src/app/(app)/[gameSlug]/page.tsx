import { redirect } from "next/navigation"

type Params = Promise<{ gameSlug: string }>

export default async function GamePage({ params }: { params: Params }) {
  const gameParams = await params;
  redirect(`/${gameParams.gameSlug}/counter`);
}
