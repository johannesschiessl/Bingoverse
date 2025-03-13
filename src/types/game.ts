export interface Game {
  id: number;
  slug: string;
  name: string;
  color: string;
  icon: string;
  password?: string;
  expires_at: string;
  created_at: string;
  counter_on: boolean;
}

export interface CreateGame {
  name: string;
  slug: string;
  color: string;
  icon: string;
  password?: string;
  expires_at: string;
  counter_on: boolean;
}
