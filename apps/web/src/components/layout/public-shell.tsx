import { Page } from "@/components/ds/page";
import { ScrollProgress } from "@/components/ds/motion";

export function PublicShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <ScrollProgress />
      <Page className="max-w-5xl gap-0 py-0">{children}</Page>
    </div>
  );
}
