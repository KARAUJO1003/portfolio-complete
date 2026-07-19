import { Page } from "@/components/ds/page";
import { ScrollProgress } from "@/components/ds/motion";
import { VisitTracker } from "@/features/portfolio/components/visit-tracker";

export function PublicShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <VisitTracker />
      <ScrollProgress />
      <Page className="max-w-none gap-0 px-0 py-0">{children}</Page>
    </div>
  );
}
