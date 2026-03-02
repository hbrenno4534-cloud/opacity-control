

## Plano: Sistema de Autenticação Nativa com Provisionamento Externo Invisível

### Resumo

Criar um fluxo completo de Login/Cadastro 100% interno usando Lovable Cloud (Supabase Auth), com animação de porta-cofre giratória, painel administrativo, e provisionamento externo em background via Edge Function — sem nenhum redirecionamento visível para o usuário.

### Fase 1 — Banco de Dados e Auth (Lovable Cloud)

Tabelas a criar:

- **profiles** — `id`, `name`, `email`, `phone`, `cpf`, `external_provisioned` (bool), `created_at`, `last_login`
- **user_roles** — `id`, `user_id`, `role` (enum: admin, user)
- **deposits** — `id`, `user_id`, `amount`, `status`, `created_at`
- **push_subscriptions** — `id`, `user_id`, `endpoint`, `keys_json`, `created_at`
- **notifications** — `id`, `title`, `body`, `sent_at`, `sent_by`

RLS: usuários leem próprio perfil; admins leem tudo via `has_role()` security definer.

Trigger automático: ao criar usuário no auth, cria perfil na tabela `profiles`.

### Fase 2 — Telas de Login e Cadastro

Páginas React (`/login`, `/signup`) com tema dark (verde/preto) seguindo a estética do site.

**Cadastro:** Nome, email, telefone, CPF, senha → cria conta via Supabase Auth → trigger cria perfil → Edge Function provisiona conta externa em background (chamada server-side, invisível).

**Login:** Email + senha → autentica via Supabase → Edge Function sincroniza sessão externa em background.

**Zero redirecionamento.** O usuário nunca sai do app. Todo provisionamento externo ocorre via Edge Function server-side.

### Fase 3 — Animação Porta-Cofre (Vault Door)

Componente `VaultDoor.tsx` com animação CSS pura:

1. Porta circular com textura metálica (gradientes CSS)
2. Ao fazer login com sucesso:
   - A roda/tranca gira (rotate 360°)
   - A porta abre para o lado (rotateY 90°)
   - Fade/slide transition para a tela principal
3. Usa `perspective`, `rotateY`, `scale` e keyframes CSS
4. Duração ~2.5s, sensação de "acesso exclusivo"

### Fase 4 — Migração do Conteúdo Principal

- Converter `public/front/index.html` em componente React (`/app` ou `/`)
- `Index.tsx` deixa de redirecionar para HTML estático
- Header "CRIAR CONTA" vira "ENTRAR" / "SAIR" baseado no estado de auth
- Páginas de jogos (`public/front/*.html`) continuam como estão (acesso direto)

### Fase 5 — Painel Administrativo

Rotas protegidas `/admin/*`, acessíveis apenas para role `admin`:

- **Dashboard** (`/admin`) — Cards com total de usuários, depósitos, atividade recente
- **Usuários** (`/admin/users`) — Tabela com busca, paginação, export CSV
- **Depósitos** (`/admin/deposits`) — Tabela com filtros por data, valores, status
- **Notificações** (`/admin/notifications`) — Formulário para envio de push notifications

### Fase 6 — Push Notifications

- Service Worker para Web Push API
- Edge Function `send-push` para enviar notificações
- Tabela `push_subscriptions` para armazenar endpoints
- Prompt de permissão após primeiro login
- Envio manual ou em massa via painel admin

### Estrutura de Arquivos (novos)

```text
src/
  contexts/AuthContext.tsx
  pages/
    Login.tsx
    Signup.tsx
    MainApp.tsx
    admin/
      Dashboard.tsx
      Users.tsx
      Deposits.tsx
      Notifications.tsx
      AdminLayout.tsx
  components/
    VaultDoor.tsx
    ProtectedRoute.tsx
    AdminRoute.tsx
supabase/
  functions/
    provision-external/index.ts
    send-push/index.ts
```

### Detalhes Técnicos

- **Provisionamento externo**: Edge Function `provision-external` faz POST server-side para a API do parceiro (Superbet) usando credenciais armazenadas como secrets. O frontend nunca toca na URL externa.
- **Sincronização de sessão**: Ao login, Edge Function valida/sincroniza sessão externa e retorna status ao app.
- **VAPID keys**: Necessárias como secrets para Web Push (serão solicitadas na implementação).
- **Ordem de implementação**: BD → Auth pages + animação → Migração conteúdo → Admin → Push.

