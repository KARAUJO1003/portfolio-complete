---
name: ds-components
description: Use ao criar ou refatorar componentes reutilizaveis em apps/web/src/components/ds ou wrappers de apps/web/src/components/ui.
---

# DS Components

## Regras

- `components/ui` e camada base shadcn.
- Nao coloque customizacao de produto em `components/ui`.
- Crie wrappers em `components/ds`.
- Preserve `className`, `children`, handlers e props nativas.
- Use `React.ComponentProps<typeof BaseComponent>` para wrappers.
- Use composition pattern em vez de muitos boolean props.

## Exemplo

```tsx
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type DsButtonProps = React.ComponentProps<typeof Button> & {
  emphasis?: "default" | "quiet";
};

export function DsButton({ className, emphasis = "default", ...props }: DsButtonProps) {
  return (
    <Button
      className={cn(emphasis === "quiet" && "opacity-80", className)}
      {...props}
    />
  );
}
```

