"use client";

import { FolderPlusIcon, Trash2Icon } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ds/badge";
import {
  ActionBar,
  EmptyState,
  ErrorState,
  LoadingState,
  PageFrame,
  PageFrameContent,
  PageFrameDescription,
  PageFrameHeader,
  PageFrameTitle,
  Toolbar,
} from "@/components/ds/admin-primitives";
import { ConfirmDialog } from "@/components/ds/confirm-dialog";
import { Stat, StatGrid } from "@/components/ds/stat-grid";
import { DataTableFrame } from "@/components/ds/data-table-frame";
import { FormActions, FormAside, FormPreviewFrame, FormSection, FormStep } from "@/components/ds/form";
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
  const [confirmOpen, setConfirmOpen] = useState(false);

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
          <SectionTitle>Admin UX</SectionTitle>
        </SectionHeader>
        <div className="grid gap-4 lg:grid-cols-2">
          <PageFrame>
            <PageFrameHeader>
              <div>
                <PageFrameTitle>PageFrame</PageFrameTitle>
                <PageFrameDescription>Container padrao para formularios, listagens e builders.</PageFrameDescription>
              </div>
              <Badge tone="success">Novo</Badge>
            </PageFrameHeader>
            <PageFrameContent className="grid gap-3">
              <ActionBar>
                <span className="text-sm font-medium">Barra de acao</span>
                <Toolbar>
                  <Button>Salvar</Button>
                  <Button variant="ghost">Cancelar</Button>
                </Toolbar>
              </ActionBar>
              <EmptyState
                title="Estado vazio"
                description="Todos os CRUDs devem ter uma mensagem util e uma acao primaria quando fizer sentido."
              />
            </PageFrameContent>
          </PageFrame>

          <PageFrame>
            <PageFrameHeader>
              <div>
                <PageFrameTitle>Formularios complexos</PageFrameTitle>
                <PageFrameDescription>Projetos, portfolio, curriculo e paginas ricas usam secoes e preview.</PageFrameDescription>
              </div>
            </PageFrameHeader>
            <PageFrameContent className="grid gap-4">
              <div className="flex flex-wrap gap-2">
                <FormStep active index={1} label="Conteudo" />
                <FormStep active index={2} label="Midia" />
                <FormStep index={3} label="Publicacao" />
              </div>
              <FormSection title="Secao de formulario" description="Agrupa campos relacionados e explica o impacto.">
                <div className="h-10 rounded-md border border-input bg-background" />
              </FormSection>
              <div className="grid gap-3 md:grid-cols-2">
                <FormAside>Aside para contexto, dicas e resumo.</FormAside>
                <FormPreviewFrame className="grid min-h-24 place-items-center text-sm text-muted-foreground">
                  Preview
                </FormPreviewFrame>
              </div>
              <FormActions className="static shadow-none">
                <Button>Acao primaria</Button>
                <span className="text-xs text-muted-foreground">Dirty state e erros aparecem aqui.</span>
              </FormActions>
            </PageFrameContent>
          </PageFrame>
        </div>
      </Section>

      <Section>
        <SectionHeader>
          <SectionTitle>Tabelas</SectionTitle>
        </SectionHeader>
        <DataTableFrame
          title="DataTableFrame"
          description="Frame padrao para busca, filtros, ordenacao, estados e acoes."
          search=""
          onSearchChange={() => undefined}
          filters={<Button variant="ghost">Filtro</Button>}
        >
          <div className="rounded-lg border border-border bg-background p-4 text-sm text-muted-foreground">
            As tabelas reais usam TanStack Table dentro deste frame.
          </div>
        </DataTableFrame>
      </Section>

      <Section>
        <SectionHeader>
          <SectionTitle>Metricas</SectionTitle>
        </SectionHeader>
        <SectionContent className="grid gap-3">
          <StatGrid>
            <Stat label="Projetos publicados" value="12" delta="+2 no mes" deltaTone="success" />
            <Stat label="Rascunhos" value="3" delta="aguardando revisao" />
            <Stat label="Versao publica" value="v4" delta="ha 6 dias" />
          </StatGrid>
          <p className="text-[13px] leading-5 text-muted-foreground">
            O numero e o protagonista e o rotulo se apaga. Cor so entra no delta quando carrega
            significado. Ver `docs/admin-visual-references.md`.
          </p>
        </SectionContent>
      </Section>

      <Section>
        <SectionHeader>
          <SectionTitle>Estados</SectionTitle>
        </SectionHeader>
        <div className="grid gap-4 lg:grid-cols-3">
          <EmptyState
            icon={FolderPlusIcon}
            title="Nenhum projeto ainda"
            description="Cadastre o primeiro projeto para ele aparecer no portfolio publico."
            action={<Button>Novo projeto</Button>}
          />
          <LoadingState label="Carregando projetos..." />
          <ErrorState
            title="Nao foi possivel carregar"
            description="A API nao respondeu. Verifique a conexao e tente novamente."
            action={
              <Button variant="outline">Tentar novamente</Button>
            }
          />
        </div>
      </Section>

      <Section>
        <SectionHeader>
          <SectionTitle>Dialogs</SectionTitle>
        </SectionHeader>
        <PageFrame>
          <PageFrameHeader>
            <div>
              <PageFrameTitle>ConfirmDialog</PageFrameTitle>
              <PageFrameDescription>
                Caminho unico para acao destrutiva. Foco preso, ESC e aria vem do Radix; a descricao
                da consequencia e obrigatoria.
              </PageFrameDescription>
            </div>
          </PageFrameHeader>
          <PageFrameContent>
            <Toolbar>
              <Button variant="destructive" onClick={() => setConfirmOpen(true)}>
                <Trash2Icon className="size-4" />
                Remover projeto
              </Button>
            </Toolbar>
            <ConfirmDialog
              open={confirmOpen}
              onOpenChange={setConfirmOpen}
              onConfirm={() => setConfirmOpen(false)}
              title="Remover projeto?"
              description="O projeto sai do portfolio publico imediatamente. Esta acao nao pode ser desfeita."
              confirmLabel="Remover"
            />
          </PageFrameContent>
        </PageFrame>
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
