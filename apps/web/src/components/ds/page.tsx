import { cn } from "@/lib/utils";

export function Page({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <main className={cn("mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8", className)} {...props} />;
}

export function PageHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <header className={cn("flex flex-col gap-2", className)} {...props} />;
}

export function PageTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h1 className={cn("text-3xl font-semibold tracking-normal", className)} {...props} />;
}

export function PageDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("max-w-2xl text-sm leading-6 text-muted-foreground", className)} {...props} />;
}

export function PageContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex flex-col gap-6", className)} {...props} />;
}
