import { Header } from "@/components";

export default function SpacesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-zinc-950">
      <Header />
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
