import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <p className="text-sm uppercase tracking-[0.16em] text-rose">404</p>
      <h1 className="mt-3 font-display text-5xl text-ink">Page not found</h1>
      <p className="mt-4 max-w-md text-muted-foreground">
        That page may have moved. Browse services or book a session instead.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button asChild>
          <Link href="/book">Book fixing</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/">Back home</Link>
        </Button>
      </div>
    </div>
  );
}
