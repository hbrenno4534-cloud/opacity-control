

## Plano: Criar paginas individuais para cada jogo

### Situacao atual
- A pagina principal (`public/front/index.html`) tem links para `anubis-wrath.html`, `fire-portals.html`, `wild-bandito.html`, `ways-of-the-qilin.html`, `gods-of-war.html` - todos relativos a pasta `public/front/`
- Apenas o Anubis Wrath tem pagina funcional (`public/back/index.html`)
- Os outros 4 links levam a pagina 404
- O script `signal.js` ja resolve o nome do jogo dinamicamente pelo atributo `data-game`
- Banners individuais nao existem localmente (apenas `banner-anubis-wrath.webp`). As imagens thumbnail de cada jogo existem em `public/front/images/`

### O que sera feito

**1. Criar 4 paginas HTML de jogos em `public/front/`**

Cada pagina segue o mesmo template do Anubis (`public/back/index.html`), com as seguintes diferencas por jogo:

| Arquivo | Titulo | data-game | Banner (imagem thumbnail) |
|---------|--------|-----------|---------------------------|
| `fire-portals.html` | FIRE PORTALS | fireportals | `images/fire-portals.webp` |
| `wild-bandito.html` | WILD BANDITO | wildbandito | `images/wild-bandito.webp` |
| `ways-of-the-qilin.html` | WAYS OF THE QILIN | waysoftheqilin | `images/ways-of-the-qilin.webp` |
| `gods-of-war.html` | GODS OF WAR | godsofwar | `images/gods-of-war.webp` |

**2. Criar `anubis-wrath.html` em `public/front/`**

Atualmente o link aponta para `anubis-wrath.html` na pasta front, mas a pagina so existe em `public/back/`. Sera criada tambem em `public/front/` usando `images/anubis-wrath.webp` como banner.

**3. Ajustes em cada pagina**
- Logo com link para `index.html` (volta ao inicio)
- Logo no tamanho grande (160px) como ja definido no CSS
- CSS referenciando `css/jogos-secretos.css` e `../back/css/jogo.css`
- Scripts referenciando `../back/js/signal.js`, `../back/js/star.js`, etc.
- Botao "CRIAR CONTA" com o mesmo link de afiliado
- Menu inferior com link Home e VIP
- `data-auto-run="true"` e `data-hide-status-text="true"` para iniciar automaticamente

### Detalhes tecnicos
- As paginas usarao as imagens thumbnail (`public/front/images/`) como banner, ja que banners dedicados nao existem para os outros jogos
- O `signal.js` ja suporta todos os jogos pelo mapa interno (`fireportals`, `wildbandito`, `waysoftheqilin`, `godsofwar`)
- CSS e JS serao referenciados da pasta `back` com caminho relativo `../back/`

