# 🚀 Mídia Kit Oficial - Jessica Rosa

Mídia Kit digital, interativo e de alto padrão desenvolvido com **React 19**, **TypeScript**, **Vite**, **Tailwind CSS**, **Framer Motion** e suporte nativo ao **Supabase** para gerenciamento de dados em nuvem.

---

## 📋 Sumário
- [Recursos](#-recursos)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Como Executar Localmente](#-como-executar-localmente)
- [Configuração do Banco de Dados no Supabase](#-configuração-do-banco-de-dados-no-supabase)
- [Publicando no GitHub](#-publicando-no-github)
- [Deploy Automático na Vercel](#-deploy-automático-na-vercel)
- [Variáveis de Ambiente](#-variáveis-de-ambiente)

---

## ✨ Recursos

- 🎨 **Interface Premium Bento Grid**: Design dinâmico com suporte a Dark/Light Mode.
- 📊 **Métricas e Demografia**: Visualização interativa dos dados de engajamento e público.
- 💼 **Gestão de Parcerias**: Painel Admin protegido para cadastro e remoção de campanhas.
- 🗄️ **Supabase Integration**: Sincronização em tempo real com PostgreSQL e fallback automático para `localStorage`.
- ⚡ **Desempenho Extremo**: Desenvolvido com Vite e otimizado para deploy serverless.

---

## 📁 Estrutura do Projeto

```text
midiakit/
├── src/
│   ├── components/       # Componentes de UI (Header, Metrics, AdminDashboard, etc.)
│   ├── context/          # Contexto global de tema (ThemeContext)
│   ├── data/             # Dados iniciais de fallback (influencerData)
│   ├── lib/              # Cliente Supabase e conectores de dados (supabaseClient)
│   ├── types.ts          # Definições de Tipos TypeScript
│   └── App.tsx           # Componente principal
├── supabase/
│   └── schema.sql        # Script de banco de dados SQL (Tabelas, RLS e Índices)
├── .env.example          # Exemplo de variáveis de ambiente
├── .gitignore            # Arquivos ignorados pelo Git
├── vercel.json           # Configuração de rotas SPA na Vercel
├── package.json          # Dependências e scripts
└── vite.config.ts        # Configuração do Vite
```

---

## 💻 Como Executar Localmente

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/SEU-USUARIO/midia-kit-jessica-rosa.git
   cd midia-kit-jessica-rosa
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Configure as Variáveis de Ambiente (opcional):**
   Crie um arquivo `.env` na raiz do projeto com base no `.env.example`:
   ```env
   VITE_SUPABASE_URL=https://seu-projeto.supabase.co
   VITE_SUPABASE_ANON_KEY=sua-chave-anon-aqui
   ```

4. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```
   Acesse no navegador: `http://localhost:3000`

5. **Gere o build de produção:**
   ```bash
   npm run build
   ```

---

## 🗄️ Configuração do Banco de Dados no Supabase

O sistema possui integração nativa com o **Supabase**:

### Passo 1: Criar o Projeto no Supabase
1. Acesse [supabase.com](https://supabase.com) e faça login.
2. Clique em **New Project** e escolha a região desejada.

### Passo 2: Executar a Estrutura SQL
1. No painel lateral do Supabase, abra o **SQL Editor**.
2. Cole o conteúdo do arquivo [`supabase/schema.sql`](./supabase/schema.sql).
3. Clique em **Run** para criar a tabela `partnerships`, os índices e as políticas de segurança (RLS).

### Passo 3: Obter as Chaves de API
1. Acesse **Project Settings** > **API**.
2. Copie a **Project URL** e a chave **anon / public**.

---

## 🐙 Publicando no GitHub

Para publicar o projeto de forma limpa e profissional no GitHub:

1. **Inicialize o repositório Git:**
   ```bash
   git init
   ```

2. **Adicione os arquivos ao commit:**
   ```bash
   git add .
   git commit -m "feat: projeto midia kit jessica rosa finalizado para deploy"
   ```

3. **Crie um repositório no GitHub** (no site github.com/new).

4. **Conecte e envie para o GitHub:**
   ```bash
   git remote add origin https://github.com/SEU-USUARIO/midia-kit-jessica-rosa.git
   git branch -M main
   git push -u origin main
   ```

---

## 📐 Deploy Automático na Vercel

1. Acesse a [Vercel](https://vercel.com) e clique em **Add New Project**.
2. Importe o repositório `midia-kit-jessica-rosa` do seu GitHub.
3. A Vercel identificará automaticamente as configurações do **Vite**:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Na seção **Environment Variables**, adicione:
   - `VITE_SUPABASE_URL`: Sua URL do Supabase.
   - `VITE_SUPABASE_ANON_KEY`: Sua chave `anon` do Supabase.
5. Clique em **Deploy**. O projeto estará online em poucos segundos.

---

## 🔑 Variáveis de Ambiente

| Variável | Descrição | Obrigatório |
| :--- | :--- | :--- |
| `VITE_SUPABASE_URL` | Endpoint HTTP do seu projeto Supabase | Não (Fallback para Modo Local/Admin Modal) |
| `VITE_SUPABASE_ANON_KEY` | Chave pública `anon` de acesso ao Supabase | Não (Fallback para Modo Local/Admin Modal) |

---

## 🛠️ Tecnologias Utilizadas

- **React 19** & **TypeScript**
- **Vite 6**
- **Tailwind CSS 4**
- **Motion (Framer Motion)**
- **Lucide React**
- **Supabase JS**
- **Recharts**
