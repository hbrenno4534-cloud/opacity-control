

## Plano: Criar usuário admin

A infraestrutura de admin já está completa (AuthContext, AdminRoute, painel `/admin/*`, tabela `user_roles`, função `has_role`). Só preciso:

1. **Criar o usuário** `admin@acess.com` com senha `admin1806#` via Supabase Auth (auto-confirm habilitado para este usuário)
2. **Promover a admin** — inserir role `admin` na tabela `user_roles` para o novo usuário

O trigger `handle_new_user` já cria automaticamente o perfil e a role `user`. Após o signup, basta adicionar a role `admin` via SQL.

### Implementação

- Criar uma Edge Function temporária `create-admin` que:
  - Usa o Service Role Key para criar o usuário via `supabase.auth.admin.createUser` (com `email_confirm: true`)
  - Insere a role `admin` na tabela `user_roles`
- Chamar a function uma vez, depois removê-la

Alternativa mais simples: criar o usuário manualmente fazendo signup pelo app e depois inserir a role admin via SQL (INSERT na tabela `user_roles`).

### Abordagem recomendada (mais rápida)

1. Registrar `admin@acess.com` / `admin1806#` pelo formulário `/signup` do app
2. Executar SQL para promover a admin:
```sql
INSERT INTO user_roles (user_id, role)
VALUES (
  (SELECT id FROM auth.users WHERE email = 'admin@acess.com'),
  'admin'
)
ON CONFLICT (user_id, role) DO NOTHING;
```

Vou implementar via Edge Function para fazer tudo automaticamente em um passo.

