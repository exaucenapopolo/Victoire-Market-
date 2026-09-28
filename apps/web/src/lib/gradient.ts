/** Palette déterministe pour les visuels produits (pas d'images réelles au MVP). */
const PALETTES: Array<[string, string]> = [
  ["#FEE9D6", "#FBBF24"],
  ["#DCFCE7", "#10B981"],
  ["#E0E7FF", "#6366F1"],
  ["#FCE7F3", "#EC4899"],
  ["#FEF3C7", "#F59E0B"],
  ["#CFFAFE", "#06B6D4"],
  ["#FED7AA", "#EA580C"],
  ["#E9D5FF", "#8B5CF6"],
];

function hash(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

export function gradientFor(seed: string): [string, string] {
  return PALETTES[hash(seed) % PALETTES.length]!;
}

export function initialsFor(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join("");
}
