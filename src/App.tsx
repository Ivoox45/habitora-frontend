import { Button } from "@/components/ui/button";

export default function App() {
  return (
    <main className="flex items-center justify-center min-h-screen bg-zinc-950">
      <Button
        variant="default"
        size="lg"
        className="px-10 py-6 text-lg font-medium rounded-full shadow-md hover:scale-105 transition-transform"
      >
        Empezar ahora
      </Button>
    </main>
  );
}
