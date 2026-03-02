

## Plano: Adicionar Framework do Jogo (iframe) na Página Fire Portals

### O que será feito

Adicionar um container com iframe logo abaixo do botão "LINK HACKEADO" na página do Fire Portals (`public/front/fire-portals.html`) que carrega a URL do jogo. O iframe vai preencher a largura disponível e ocupar bastante espaço vertical tanto no celular quanto no desktop, conforme as imagens de referência que você enviou.

### Mudanças Técnicas

**1. HTML - `public/front/fire-portals.html`**
- Adicionar um novo `<div class="game-framework">` com um `<iframe>` logo depois do div `.actions` (após o botão "LINK HACKEADO")
- URL do iframe: `https://superbet.bet.br/jogo/fire-portals/prg_vs20portals`
- O iframe terá `allowfullscreen`, `allow="autoplay"` e largura 100%

**2. CSS - `public/back/css/jogo.css`**
- Adicionar estilos para `.game-framework`:
  - Largura 100%, margem superior de 14px, borda arredondada de 12px
  - **Desktop:** altura de 600px
  - **Celular (max-width: 520px):** altura de 70vh (preenche a maior parte da tela como na foto de referência)
  - Borda sutil vermelha para combinar com o estilo do painel existente
- O iframe dentro: largura e altura 100%, sem bordas

**3. Somente o Fire Portals recebe o iframe** - as outras páginas de jogos ficam sem alteração por enquanto, para você testar primeiro.

