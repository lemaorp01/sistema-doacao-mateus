# Tutorial de Instalação - Campanha do Mateus

Este documento fornece instruções passo a passo para instalar e executar o site da campanha do Mateus em seu ambiente local.

## Requisitos Prévios

Antes de começar, certifique-se de ter instalado:

1. **Node.js** (versão 18 ou superior) - [Download Node.js](https://nodejs.org/)
2. **Bun** (gerenciador de pacotes rápido) - [Instalar Bun](https://bun.sh/docs/installation)

## Passo 1: Extrair os arquivos

Extraia o conteúdo do arquivo zip que você baixou para uma pasta de sua escolha.

```bash
unzip mateus-campaign.zip -d mateus-campaign
cd mateus-campaign
```

## Passo 2: Instalar dependências

Use o Bun para instalar todas as dependências do projeto:

```bash
bun install
```

## Passo 3: Iniciar o servidor de desenvolvimento

Para iniciar o servidor de desenvolvimento e visualizar o site:

```bash
bun run dev
```

O site estará disponível em `http://localhost:3000` em seu navegador.

## Passo 4: Construir para produção (opcional)

Quando estiver pronto para implantar o site em produção:

```bash
bun run build
```

Os arquivos de produção serão gerados na pasta `.next`.

## Integração com Stripe (Pagamentos)

O projeto inclui integração com o Stripe para processamento de pagamentos. Para configurar:

1. Crie uma conta no [Stripe](https://stripe.com) se ainda não tiver.
2. Obtenha suas chaves de API do painel do Stripe.
3. Copie o arquivo `.env.example` para `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
4. Edite o arquivo `.env.local` e adicione suas chaves do Stripe:
   ```
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=sua_chave_publicavel
   STRIPE_SECRET_KEY=sua_chave_secreta
   ```

## Estrutura do Projeto

- `/src/app` - Páginas e componentes principais
- `/src/components` - Componentes reutilizáveis
- `/src/lib` - Utilitários e configurações

## Problemas Comuns

- **Erro "Module not found"**: Certifique-se de ter executado `bun install` corretamente.
- **Erro de porta em uso**: Caso a porta 3000 já esteja em uso, você pode modificar o script no `package.json` para usar outra porta.

## Personalizando o Conteúdo

Para modificar o conteúdo da campanha:
- Edite `/src/app/page.tsx` para alterar o texto e imagens da página principal
- Ajuste os valores de meta e arrecadação no objeto `campaignData` no mesmo arquivo

## Suporte

Se precisar de ajuda adicional, entre em contato pelo email suporte@exemplo.com.