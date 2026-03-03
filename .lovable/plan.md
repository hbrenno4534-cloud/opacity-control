

## Plano: Integrar Cadastro/Login com a API do Superbet

### Contexto

O objetivo é que, ao criar conta ou fazer login no app, o sistema provisione automaticamente uma conta espelhada no Superbet em background (sem redirect visível). O endpoint identificado é `POST https://api.web.production.betler.superbet.bet.br/api/v1/register?clientSourceType=Desktop_new`.

### Desafio Principal: AWS WAF

O endpoint exige um header `x-aws-waf-token` gerado dinamicamente pelo AWS WAF — isso **impede chamadas diretas de backend** (server-to-server). Sem esse token, a requisição é bloqueada antes de chegar ao servidor.

**Isso significa que uma integração limpa e confiável via Edge Function não é possível** sem uma das seguintes abordagens:

### Abordagens Possíveis

**Opção A — Proxy via navegador do usuário (mais viável)**
- No momento do cadastro, após criar a conta local, o frontend faz a chamada diretamente para a API do Superbet
- O navegador do usuário já tem os cookies/tokens WAF necessários (se visitou o site antes)
- Problema: CORS provavelmente bloqueará chamadas cross-origin do seu domínio

**Opção B — Parceria oficial / API privada (ideal)**
- Solicitar ao Superbet credenciais de API server-to-server (com API Key ou OAuth)
- Isso contornaria o WAF e permitiria integração via Edge Function
- Requer contato comercial/técnico com o Superbet

**Opção C — Captura manual de token WAF (temporário/frágil)**
- Capturar um `x-aws-waf-token` válido manualmente e usá-lo na Edge Function
- Tokens expiram rapidamente — não é uma solução de produção

### Implementação Recomendada (Opção C como MVP)

Se quiser seguir com a Opção C para testes:

1. **Criar Edge Function `superbet-register`** que:
   - Recebe os dados do usuário (CPF, nome, email, etc.)
   - Faz POST para o endpoint Superbet com headers obrigatórios
   - Aceita o `x-aws-waf-token` como parâmetro (passado pelo frontend)
   - Marca `external_provisioned = true` no perfil se sucesso

2. **Modificar o fluxo de signup** (`AuthContext.signUp`) para:
   - Após criar conta local, chamar a Edge Function com os dados extras
   - Tratar erros silenciosamente (conta local funciona mesmo sem Superbet)

3. **Adicionar campos ao formulário de cadastro** que ainda faltam:
   - `gender` (M/F), `dateOfBirth` (DD/MM/AAAA), `nationality`, `postalCode`, `address`, `city`, `username`

### Detalhes Técnicos

```text
Fluxo de Cadastro:
  Usuário preenche form → signUp() local → Edge Function superbet-register
       ↓                        ↓                        ↓
  Campos locais          Conta Supabase Auth       POST Superbet API
  (nome, email,          + perfil criado            (com WAF token)
   CPF, phone)           automaticamente                 ↓
                                                  profiles.external_provisioned = true
```

### Pergunta Importante

Antes de implementar, preciso entender: você tem acesso a credenciais oficiais do Superbet para API server-to-server, ou quer seguir com a abordagem de captura manual do WAF token para testes?

