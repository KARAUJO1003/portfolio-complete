"use client";

import { Badge } from "@/components/ds/badge";
import { MotionHoverCard, MotionItem, MotionReveal, MotionStagger } from "@/components/ds/motion";
import { PageDescription, PageHeader, PageTitle } from "@/components/ds/page";
import { Section, SectionContent, SectionHeader, SectionTitle } from "@/components/ds/section";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const colorTokens = [
  { name: "background", className: "bg-background", text: "text-foreground" },
  { name: "background-subtle", className: "bg-background-subtle", text: "text-foreground" },
  { name: "surface", className: "bg-surface", text: "text-foreground" },
  { name: "surface-raised", className: "bg-surface-raised", text: "text-foreground" },
  { name: "surface-muted", className: "bg-surface-muted", text: "text-foreground" },
  { name: "primary", className: "bg-primary", text: "text-primary-foreground" },
  { name: "primary-tint", className: "bg-primary-tint", text: "text-foreground" },
  { name: "secondary", className: "bg-secondary", text: "text-secondary-foreground" },
];

const motionPatterns = [
  "fade-up",
  "fade-in",
  "scale-in",
  "slide-left",
  "slide-right",
  "stagger",
  "hover-lift",
  "scroll-progress",
];

export function DesignSystemFeature() {
  return (
    <>
      <MotionReveal>
        <PageHeader className="rounded-2xl border border-border bg-card p-6">
          <p className="text-xs font-medium uppercase text-primary-accent">Design System</p>
          <PageTitle className="mt-3 max-w-3xl text-4xl">
            Base visual minimalista, moderna e premium.
          </PageTitle>
          <PageDescription className="mt-4">
            Esta tela sera a vitrine interna para tokens, tipografia, componentes, grids, layouts,
            states e motion patterns do projeto.
          </PageDescription>
        </PageHeader>
      </MotionReveal>

      <Section>
        <SectionHeader>
          <SectionTitle>Tokens de cor</SectionTitle>
        </SectionHeader>
        <MotionStagger className="grid gap-3 md:grid-cols-4">
          {colorTokens.map((token) => (
            <MotionItem key={token.name}>
              <MotionHoverCard>
                <div className={`rounded-xl border border-border p-4 ${token.className} ${token.text}`}>
                  <div className="h-16 rounded-lg border border-white/10 bg-white/5" />
                  <p className="mt-4 text-sm font-medium">--{token.name}</p>
                  <p className="mt-1 text-xs opacity-70">token semantico</p>
                </div>
              </MotionHoverCard>
            </MotionItem>
          ))}
        </MotionStagger>
      </Section>

      <Section>
        <SectionHeader>
          <SectionTitle>Componentes base</SectionTitle>
        </SectionHeader>
        <div className="grid gap-4 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Badges</CardTitle>
              <CardDescription>Status e metadados compactos.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              <Badge>Default</Badge>
              <Badge tone="success">Publicado</Badge>
              <Badge tone="muted">Rascunho</Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Botoes</CardTitle>
              <CardDescription>Acoes claras, sem excesso visual.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              <Button>Primario</Button>
              <Button variant="ghost">Ghost</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cards</CardTitle>
              <CardDescription>Superficies para conteudo editavel.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-6 text-muted-foreground">
                Cards devem ser objetivos no admin e mais editoriais no portfolio publico.
              </p>
            </CardContent>
          </Card>
        </div>
      </Section>

      <Section>
        <SectionHeader>
          <SectionTitle>Motion patterns</SectionTitle>
        </SectionHeader>
        <SectionContent>
          <MotionStagger className="grid gap-3 md:grid-cols-4">
            {motionPatterns.map((pattern) => (
              <MotionItem key={pattern}>
                <div className="rounded-xl border border-border bg-card p-4">
                  <p className="text-sm font-medium">{pattern}</p>
                  <p className="mt-2 text-xs leading-5 text-muted-foreground">
                    Pattern reutilizavel para telas do portfolio/admin.
                  </p>
                </div>
              </MotionItem>
            ))}
          </MotionStagger>
        </SectionContent>
      </Section>
    </>
  );
}
