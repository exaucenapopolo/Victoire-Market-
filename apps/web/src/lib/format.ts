export function formatFCFA(amount: number): string {
  return `${Math.round(amount).toLocaleString("fr-FR")} FCFA`;
}

export function formatFCFAShort(amount: number): string {
  if (amount >= 1_000_000) return `${(amount / 1_000_000).toFixed(1)} M FCFA`;
  if (amount >= 10_000) return `${Math.round(amount / 1000)} k FCFA`;
  return `${amount.toLocaleString("fr-FR")} FCFA`;
}

const RT = new Intl.RelativeTimeFormat("fr-FR", { numeric: "auto" });

export function timeAgo(iso: string): string {
  const diff = (new Date(iso).getTime() - Date.now()) / 1000;
  const ranges: Array<[Intl.RelativeTimeFormatUnit, number]> = [
    ["second", 60],
    ["minute", 60],
    ["hour", 24],
    ["day", 7],
    ["week", 4.34],
    ["month", 12],
    ["year", Number.POSITIVE_INFINITY],
  ];
  let v = diff;
  for (const [unit, span] of ranges) {
    if (Math.abs(v) < span) return RT.format(Math.round(v), unit);
    v /= span;
  }
  return "";
}

export function orderReference(): string {
  const d = new Date();
  const ymd = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
  const rnd = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `VIC-${ymd}-${rnd}`;
}

export function pluralize(n: number, singular: string, plural = `${singular}s`): string {
  return `${n} ${n > 1 ? plural : singular}`;
}
