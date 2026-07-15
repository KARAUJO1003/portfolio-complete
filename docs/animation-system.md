# Animation System

## Objetivo

Criar animacoes modernas e premium para o portfolio/admin sem espalhar configuracoes soltas pelas telas.

## Bibliotecas

- `motion`: base atual para Motion for React.
- Futuro opcional: GSAP ScrollTrigger para cenas mais avancadas do portfolio publico.

## Referencias Antes De Alterar Telas

Quando criar ou modificar uma tela no front, verificar se ha padroes relevantes em:

- Coss Particles;
- Animate UI;
- Kibo UI;
- beUI;
- Impeccable.

Nem todo bloco externo deve ser copiado. A regra e usar como referencia visual/composicional e adaptar para `components/ds`.

## Componentizacao

Animacoes reutilizaveis devem ficar em:

```txt
apps/web/src/components/ds/motion.tsx
```

Padroes esperados:

- `MotionReveal`;
- `MotionStagger`;
- `MotionItem`;
- `ScrollProgress`;
- variants nomeadas.

## Portfolio

Pode usar:

- reveal por viewport;
- stagger em grids;
- hover lift em cards;
- progress bar de scroll;
- parallax sutil;
- futuramente GSAP ScrollTrigger para secoes especiais.

## Admin

Pode usar:

- feedback de estado;
- transicao de cards e paineis;
- drawers/modais;
- tables com entrada sutil;
- evitar efeitos decorativos fortes.
