import { Outlet, ScrollRestoration } from "react-router-dom";
import { TopBar } from "./TopBar";
import { BottomNav } from "./BottomNav";

export function AppShell() {
  return (
    <div className="min-h-[100dvh] flex flex-col">
      <a href="#content" className="skip-link">Aller au contenu</a>
      <TopBar />
      <main id="content" className="flex-1 pb-[calc(var(--bottomnav-h)+var(--safe-bottom)+16px)] md:pb-16">
        <Outlet />
      </main>
      <BottomNav />
      <ScrollRestoration />
    </div>
  );
}
