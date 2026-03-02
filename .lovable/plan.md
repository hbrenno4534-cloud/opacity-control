

## Plano: Adicionar seção "SALA DE CONTROLE"

### O que será feito

Nova seção com 3 estatísticas animadas entre a seção de winners e JOGOS POPULARES, com visual de painel de monitoramento.

### Mudanças

**1. `public/front/index.html`** (linha ~305, antes de JOGOS POPULARES)
- Inserir `<section class="control-room">` com 3 blocos:
  - **SINAIS GERADOS** (ícone `bi-broadcast`, valor ~800-2000)
  - **TAXA DE ACERTO** (ícone `bi-bullseye`, valor 91-97%)
  - **USUÁRIOS ONLINE** (ícone `bi-people-fill`, valor 200-500)

**2. `public/front/css/jogos-secretos.css`**
- Estilos `.control-room`: fundo escuro, borda dourada, grid 3 colunas
- `.control-stat`: card com ícone, número grande em Orbitron dourado com glow
- `.control-value`: text-shadow dourado, font-size grande
- Responsivo no mobile (3 colunas compactas)

**3. `public/front/js/winner.js`**
- Adicionar IIFE com IntersectionObserver para animar contagem dos 3 valores ao entrar na viewport
- Gerar valores aleatórios dentro das faixas a cada reload
- Animação ease-out de ~1.5s

