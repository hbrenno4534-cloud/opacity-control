

## Plano: Adicionar campo WAF Token no formulário de cadastro (modo dev/teste)

Adicionar um campo colapsável no final do formulário de cadastro para inserir manualmente o `x-aws-waf-token` e o `x-analytics-correlation-id`, visível apenas em modo desenvolvimento.

### Alterações

**`src/pages/Signup.tsx`**:
- Adicionar campos `wafToken` e `correlationId` ao estado do formulário
- Criar uma seção colapsável (usando Collapsible) com label "Modo Dev/Teste" após os campos de senha
- Mostrar apenas quando `import.meta.env.DEV` é true
- Passar os valores para `signUp()` dentro do objeto `superbetData`

**`src/contexts/AuthContext.tsx`**:
- Adicionar `wafToken` e `correlationId` à interface `SuperbetData`
- Passá-los no body da chamada à Edge Function `superbet-register`

