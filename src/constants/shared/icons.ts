import {
  Gamepad2,
  PuzzleIcon,
  Trophy,
  Dice1,
  Layers,
  Star,
  Target,
  Crown,
  Gift,
  Rocket,
  Heart,
  Gem,
  LucideIcon,
} from "lucide-react";

export const gameIconOptions: {
  value: string;
  label: string;
  icon: LucideIcon;
}[] = [
  { value: "GAMEPAD", label: "Game Controller", icon: Gamepad2 },
  { value: "PUZZLE", label: "Puzzle", icon: PuzzleIcon },
  { value: "TROPHY", label: "Trophy", icon: Trophy },
  { value: "DICE", label: "Dice", icon: Dice1 },
  { value: "LAYERS", label: "Layers", icon: Layers },
  { value: "STAR", label: "Star", icon: Star },
  { value: "TARGET", label: "Target", icon: Target },
  { value: "CROWN", label: "Crown", icon: Crown },
  { value: "GIFT", label: "Gift", icon: Gift },
  { value: "ROCKET", label: "Rocket", icon: Rocket },
  { value: "HEART", label: "Heart", icon: Heart },
  { value: "GEM", label: "Gem", icon: Gem },
];
