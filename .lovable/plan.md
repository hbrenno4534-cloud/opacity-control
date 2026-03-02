

## Plano: Partículas com imagens de notas de dólar subindo

Em vez de texto "$", vou usar uma imagem real de nota de dólar como partícula flutuante.

### Passos

1. **Gerar uma imagem PNG de nota de dólar** (fundo transparente, estilo cartoon/flat) usando a API de geração de imagens, e salvar em `public/front/images/dollar.png` e `public/back/images/dollar.png`.

2. **Modificar `star.js` (front e back)** — Criar elementos `<img>` em vez de `<div>`:
   - `src` apontando para a imagem do dólar
   - Tamanho aleatório entre 20px e 45px
   - Rotação aleatória para variar visual
   - Manter animação de subida existente

3. **Ajustar CSS (front e back `jogos-secretos.css`)** — Na classe `.star`:
   - Remover `border-radius`, `background`
   - Manter `position: absolute`, animação de subida
   - Adicionar `object-fit: contain`

### Arquivos modificados
- `public/front/images/dollar.png` (novo)
- `public/back/images/dollar.png` (novo)
- `public/front/js/star.js`
- `public/back/js/star.js`
- `public/front/css/jogos-secretos.css`
- `public/back/css/jogos-secretos.css`

