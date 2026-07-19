"use client";

import { ChevronDownIcon, FolderPlusIcon, LogOutIcon, SettingsIcon, Trash2Icon, UserIcon } from "lucide-react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Menu, MenuGroup, MenuItem, MenuPopup, MenuSeparator, MenuTrigger } from "@/components/ui/menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

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
          <PageTitle className="mt-3 max-w-3xl text-3xl">
            Base visual minimalista, moderna e premium.
          </PageTitle>
          <PageDescription className="mt-4">
            Esta tela será a vitrine interna para tokens, tipografia, componentes, grids, layouts,
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
                  <p className="mt-1 text-xs opacity-70">token semântico</p>
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
              <Badge tone="warning">Atenção</Badge>
              <Badge tone="danger">Erro</Badge>
              <Badge dot tone="success">On Time</Badge>
              <Badge dot tone="warning">Delayed</Badge>
              <Badge dot tone="danger">Cancelled</Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Botões</CardTitle>
              <CardDescription>Ações claras, sem excesso visual.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              <Button>Primário</Button>
              <Button variant="secondary">Secundário</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="destructive">Destrutivo</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cards</CardTitle>
              <CardDescription>Superfícies para conteúdo editável.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-6 text-muted-foreground">
                Cards devem ser objetivos no admin e mais editoriais no portfolio público.
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
                <PageFrameDescription>Container padrão para formulários, listagens e builders.</PageFrameDescription>
              </div>
              <Badge tone="success">Novo</Badge>
            </PageFrameHeader>
            <PageFrameContent className="grid gap-3">
              <ActionBar>
                <span className="text-sm font-medium">Barra de ação</span>
                <Toolbar>
                  <Button>Salvar</Button>
                  <Button variant="ghost">Cancelar</Button>
                </Toolbar>
              </ActionBar>
              <EmptyState
                title="Estado vazio"
                description="Todos os CRUDs devem ter uma mensagem útil e uma ação primária quando fizer sentido."
              />
            </PageFrameContent>
          </PageFrame>

          <PageFrame>
            <PageFrameHeader>
              <div>
                <PageFrameTitle>Formulários complexos</PageFrameTitle>
                <PageFrameDescription>
                  Projetos, Skills, Trajetória, Páginas, Seções e Usuários vivem em `Drawer` bottom;
                  a ação principal fica no header do drawer (toolbar), não mais num rodapé flutuante.
                  `FormSection` não usa mais card (fundo/borda) - só título, descrição e um divisor fino
                  entre seções. Ver `docs/admin-visual-references.md`.
                </PageFrameDescription>
              </div>
            </PageFrameHeader>
            <PageFrameContent className="grid gap-4">
              <div className="flex flex-wrap gap-2">
                <FormStep active index={1} label="Conteúdo" />
                <FormStep active index={2} label="Mídia" />
                <FormStep index={3} label="Publicação" />
              </div>
              <FormSection title="Seção de formulário" description="Agrupa campos relacionados e explica o impacto.">
                <div className="h-7 rounded-md border border-input bg-input/20" />
              </FormSection>
              <div className="grid gap-3 md:grid-cols-2">
                <FormAside>Aside para contexto, dicas e resumo (Projetos usa; Skills/Páginas/Seções/Usuários não precisam).</FormAside>
                <FormPreviewFrame className="grid min-h-24 place-items-center text-sm text-muted-foreground">
                  Preview
                </FormPreviewFrame>
              </div>
              <FormActions className="static shadow-none">
                <span className="text-xs text-muted-foreground">
                  `FormActions` agora só aparece no rodapé em forms inline sem Drawer (Perfil, Minha conta); mostra só o erro de validação quando falha.
                </span>
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
          description="Frame padrão para busca, filtros, ordenação, estados e ações."
          search=""
          onSearchChange={() => undefined}
          filters={<Button variant="ghost">Filtro</Button>}
        >
          <Table variant="card">
            <TableHeader>
              <TableRow>
                <TableHead className="w-px">
                  <Checkbox aria-label="Selecionar todos" />
                </TableHead>
                <TableHead>Projeto</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>
                  <Checkbox aria-label="Selecionar linha" />
                </TableCell>
                <TableCell className="font-medium">Portfolio Admin</TableCell>
                <TableCell>
                  <Badge dot tone="success">
                    Publicado
                  </Badge>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Checkbox aria-label="Selecionar linha" />
                </TableCell>
                <TableCell className="font-medium">Currículo Builder</TableCell>
                <TableCell>
                  <Badge dot tone="warning">
                    Rascunho
                  </Badge>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </DataTableFrame>
        <p className="text-[13px] leading-5 text-muted-foreground">
          `Table`/`Checkbox` adaptados do particle `p-table-8` (Coss/Base UI). A busca/filtro do
          `DataTableFrame` fica sempre fora do frame, como um irmão acima (não um filho). Todos os
          CRUDs administrativos (Projetos, Skills, Trajetória, Páginas, Seções, Usuários) já usam
          `DataTableFrame` com TanStack Table de verdade.
        </p>
      </Section>

      <Section>
        <SectionHeader>
          <SectionTitle>Metricas</SectionTitle>
        </SectionHeader>
        <SectionContent className="grid gap-3">
          <StatGrid>
            <Stat label="Projetos publicados" value="12" delta="+2 no mes" deltaTone="success" />
            <Stat label="Rascunhos" value="3" delta="aguardando revisão" />
            <Stat label="Versão pública" value="v4" delta="há 6 dias" />
          </StatGrid>
          <p className="text-[13px] leading-5 text-muted-foreground">
            O número é o protagonista e o rótulo se apaga. Cor só entra no delta quando carrega
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
            description="Cadastre o primeiro projeto para ele aparecer no portfolio público."
            action={<Button>Novo projeto</Button>}
          />
          <LoadingState label="Carregando projetos..." />
          <ErrorState
            title="Não foi possível carregar"
            description="A API não respondeu. Verifique a conexão e tente novamente."
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
                Caminho único para ação destrutiva. Foco preso, ESC e aria vêm do Base UI; a descrição
                da consequência é obrigatória.
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
              description="O projeto sai do portfolio público imediatamente. Esta ação não pode ser desfeita."
              confirmLabel="Remover"
            />
          </PageFrameContent>
        </PageFrame>
      </Section>

      <Section>
        <SectionHeader>
          <SectionTitle>Menu</SectionTitle>
        </SectionHeader>
        <PageFrame>
          <PageFrameHeader>
            <div>
              <PageFrameTitle>Menu</PageFrameTitle>
              <PageFrameDescription>
                Base UI Menu (`components/ui/menu.tsx`, adaptado do `@coss/menu`). Usado no `UserMenu`
                (avatar com Minha conta/Site público/tema/Sair) e na nav principal (mega-menu por
                grupo, hover com `openOnHover`). Popup usa `bg-card`/`border-border` (o projeto não
                tem tokens `--popover`/`--accent`); item destacado usa `bg-muted`.
              </PageFrameDescription>
            </div>
          </PageFrameHeader>
          <PageFrameContent>
            <Menu>
              <MenuTrigger className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface-raised px-2.5 py-1.5 text-xs font-medium hover:bg-muted">
                Conta
                <ChevronDownIcon className="size-3.5" />
              </MenuTrigger>
              <MenuPopup align="start">
                <MenuGroup>
                  <MenuItem>
                    <UserIcon />
                    Minha conta
                  </MenuItem>
                  <MenuItem>
                    <SettingsIcon />
                    Preferências
                  </MenuItem>
                </MenuGroup>
                <MenuSeparator />
                <MenuItem variant="destructive">
                  <LogOutIcon />
                  Sair
                </MenuItem>
              </MenuPopup>
            </Menu>
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
                    Pattern reutilizável para telas do portfolio/admin.
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
