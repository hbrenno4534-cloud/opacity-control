

## Plano: Reformular seção "JOGOS PROIBIDOS" → "JOGOS POPULARES"

### Resumo das mudanças

1. **Renomear** "JOGOS PROIBIDOS" para "JOGOS POPULARES" com texto branco
2. **Layout vertical** em grid (2 colunas no celular, 3-4 no desktop) em vez de slider horizontal
3. **Cards acessíveis** — cada jogo leva para sua página de hackeamento (mesma tela do Anubis, usando o banner do Anubis mas com nome correto do slot)
4. **Novo design dos cards** inspirado em La Casa de Papel

---

### Ideia de Design: "Dossiê Dourado"

Inspirado nos dossiês e planos de assalto do filme, com a paleta dourada/ouro que já existe no site:

- **Cards com fundo escuro** (quase preto) com borda dourada sutil e gradiente metálico
- **Overlay estilo "carimbo confidencial"** — um selo diagonal no canto dizendo "POPULAR" ou "HOT" em dourado
- **Efeito de papel envelhecido** — background com textura sutil, sombra interna
- **Hover/tap:** brilho dourado na borda (glow effect)
- **Layout:** grid vertical, cards menores e compactos — thumbnail do jogo + nome + botão "ACESSAR" dourado
- **Sem** o scan-progress/radar dos jogos secretos — visual mais limpo

```text
┌─────────────┐  ┌─────────────┐
│  [img slot]  │  │  [img slot]  │
│             │  │             │
│  Slot Name  │  │  Slot Name  │
│  [ACESSAR]  │  │  [ACESSAR]  │
└─────────────┘  └─────────────┘
┌─────────────┐  ┌─────────────┐
│  [img slot]  │  │  [img slot]  │
│  ...        │  │  ...        │
└─────────────┘  └─────────────┘
```

### Mudanças Técnicas

**1. `public/front/index.html`**
- Trocar título "JOGOS PROIBIDOS" → "JOGOS POPULARES"
- Remover slider horizontal (viewport + track + controles prev/next)
- Substituir por grid vertical com os 3 jogos atuais (Bloody Dawn, Rage of Perun, Spell Master)
- Cada card: thumbnail + nome + link para página de hackeamento dedicada (ex: `bloody-dawn.html`)
- Remover o cadeado "BLOQUEADO" e o botão "DESBLOQUEAR"
- Nova classe `popular-card` em vez de `forbidden-card`

**2. `public/front/css/jogos-secretos.css`**
- Substituir estilos `.forbidden-*` por `.popular-games` e `.popular-card`
- Grid: `display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px`
- Desktop (>768px): `grid-template-columns: repeat(3, 1fr)` ou `repeat(4, 1fr)`
- Card: fundo escuro, borda dourada (`rgba(181, 128, 14, 0.4)`), cantos arredondados
- Botão "ACESSAR" dourado (gradiente gold já existente no site)
- Título da seção: `color: white`

**3. Criar páginas de hackeamento** para cada jogo popular
- Criar `bloody-dawn.html`, `rage-of-perun.html`, `spell-master.html`
- Copiar estrutura do `anubis-wrath.html` (mesma tela de hackeamento)
- Usar o banner do Anubis (`images/anubis-wrath.webp`) na tela de carregamento
- Alterar o `<h1>` e `data-game` para o nome correto de cada slot

**4. `public/front/js/slider.js`**
- Remover o bloco IIFE do forbidden slider (linhas 231-306) já que não terá mais slider

