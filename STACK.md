# Stack Tecnológica e Design System

## 🛠️ Stack Principal

### Core

- **Vite** (v5.3.1) - Build tool e dev server
- **React** (v18.3.1) - Biblioteca UI
- **TypeScript** (v5.5.3) - Tipagem estática
- **Tailwind CSS** (v3.4.4) - Framework CSS utility-first

### Validação

- **Zod** (v3.23.8) - Validação de schemas TypeScript-first

### UI Components

- **Magic UI** - Componentes pré-construídos baseados em Tailwind CSS
  - Componentes acessíveis e customizáveis
  - Animações e transições suaves
  - Design system consistente

---

## 📁 Estrutura do Projeto

```
steamfloodanalysis/
├── docs/                        # Documentação do projeto
├── src/
│   ├── components/             # Componentes React
│   │   └── ui/                 # Componentes UI base (Magic UI)
│   ├── lib/                    # Lógica de negócio
│   │   ├── types/              # TypeScript types/interfaces
│   │   ├── constants/          # Constantes e conversões
│   │   ├── calculations/       # Funções de cálculo
│   │   └── validation/         # Schemas Zod
│   ├── data/                   # Dados estáticos
│   │   └── presets/            # Presets JSON
│   ├── hooks/                  # Custom React hooks
│   ├── App.tsx                 # Componente principal
│   ├── main.tsx                # Entry point
│   └── index.css               # Estilos globais
├── public/                     # Assets estáticos
├── index.html                  # HTML template
├── vite.config.ts              # Configuração Vite
├── tsconfig.json               # Configuração TypeScript
├── tailwind.config.js          # Configuração Tailwind
└── package.json                # Dependências
```

---

## 🎨 Design System

### Cores (HSL Variables)

O projeto usa variáveis CSS HSL para cores, permitindo fácil customização e suporte a dark mode.

#### Light Mode (Padrão)

- **Background**: Branco (`0 0% 100%`)
- **Foreground**: Preto escuro (`222.2 84% 4.9%`)
- **Primary**: Azul (`221.2 83.2% 53.3%`)
- **Secondary**: Cinza claro (`210 40% 96.1%`)
- **Muted**: Cinza claro (`210 40% 96.1%`)
- **Accent**: Cinza claro (`210 40% 96.1%`)
- **Destructive**: Vermelho (`0 84.2% 60.2%`)

#### Dark Mode

- **Background**: Preto escuro (`222.2 84% 4.9%`)
- **Foreground**: Branco (`210 40% 98%`)
- **Primary**: Azul claro (`217.2 91.2% 59.8%`)
- **Secondary**: Cinza escuro (`217.2 32.6% 17.5%`)
- **Muted**: Cinza escuro (`217.2 32.6% 17.5%`)
- **Accent**: Cinza escuro (`217.2 32.6% 17.5%`)
- **Destructive**: Vermelho escuro (`0 62.8% 30.6%`)

### Tipografia

- **Font Family**: System fonts (inherit do sistema)
- **Font Sizes**: Escala Tailwind padrão
- **Line Heights**: Automáticos do Tailwind

### Espaçamento

- **Base Unit**: 4px (0.25rem)
- **Scale**: Tailwind padrão (0.25rem, 0.5rem, 1rem, etc.)

### Border Radius

- **Default**: `0.5rem` (8px)
- **Variants**:
  - `lg`: `var(--radius)`
  - `md`: `calc(var(--radius) - 2px)`
  - `sm`: `calc(var(--radius) - 4px)`

---

## 🧩 Componentes Magic UI

### Componentes Disponíveis

Magic UI fornece componentes pré-construídos que serão adicionados conforme necessário:

- **Button** - Botões com variantes
- **Input** - Campos de entrada
- **Card** - Containers de conteúdo
- **Label** - Labels para formulários
- **Select** - Dropdowns
- **Table** - Tabelas de dados
- **Badge** - Badges e tags
- **Alert** - Alertas e notificações
- **Dialog** - Modais e diálogos
- **Tabs** - Abas e navegação

### Uso de Componentes

Os componentes serão criados em `src/components/ui/` seguindo o padrão Magic UI:

```tsx
import { Button } from '@/components/ui/button'

function MyComponent() {
  return <Button variant="default">Clique aqui</Button>
}
```

---

## 🔧 Configurações

### Vite

- **Plugin React**: `@vitejs/plugin-react`
- **Alias**: `@` aponta para `./src`
- **Build**: TypeScript + Vite build

### TypeScript

- **Target**: ES2020
- **Module**: ESNext
- **JSX**: React JSX
- **Strict Mode**: Habilitado
- **Path Aliases**: `@/*` → `./src/*`

### Tailwind CSS

- **Content**: `./index.html` e `./src/**/*.{js,ts,jsx,tsx}`
- **Theme**: Extendido com variáveis CSS customizadas
- **Plugins**: Nenhum adicional por enquanto

---

## 📦 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev          # Inicia servidor de desenvolvimento

# Build
npm run build        # Compila para produção

# Linting
npm run lint         # Executa ESLint

# Preview
npm run preview      # Preview do build de produção
```

---

## 🚀 Próximos Passos

1. **Instalar dependências**: `npm install`
2. **Adicionar componentes Magic UI**: Conforme necessário
3. **Implementar tipos TypeScript**: Em `src/lib/types/`
4. **Criar schemas de validação**: Em `src/lib/validation/`
5. **Implementar cálculos**: Em `src/lib/calculations/`
6. **Criar componentes de UI**: Em `src/components/ui/`

---

## 📚 Referências

- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [Zod Documentation](https://zod.dev/)
- [Magic UI](https://magicui.design/)

---

**Última atualização**: Setup inicial concluído

