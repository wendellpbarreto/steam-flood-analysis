# Design System - Serigado IV Steamflood Analysis

## 🎨 Visão Geral

Design system baseado em **Tailwind CSS** e **Magic UI**, seguindo princípios de design moderno, acessibilidade e consistência visual.

---

## 🎨 Paleta de Cores

### Cores Principais

#### Primary (Azul)
- **Uso**: Ações principais, links, elementos de destaque
- **Light**: `hsl(221.2, 83.2%, 53.3%)`
- **Dark**: `hsl(217.2, 91.2%, 59.8%)`

#### Secondary (Cinza)
- **Uso**: Elementos secundários, backgrounds alternativos
- **Light**: `hsl(210, 40%, 96.1%)`
- **Dark**: `hsl(217.2, 32.6%, 17.5%)`

#### Destructive (Vermelho)
- **Uso**: Ações destrutivas, erros, alertas críticos
- **Light**: `hsl(0, 84.2%, 60.2%)`
- **Dark**: `hsl(0, 62.8%, 30.6%)`

### Cores Semânticas

- **Background**: Cor de fundo principal
- **Foreground**: Cor do texto principal
- **Muted**: Texto secundário, placeholders
- **Accent**: Destaques sutis, hovers
- **Border**: Bordas e divisores
- **Input**: Campos de entrada

---

## 📐 Tipografia

### Escala de Tamanhos

```css
text-xs    → 0.75rem  (12px)
text-sm    → 0.875rem (14px)
text-base  → 1rem     (16px)
text-lg    → 1.125rem (18px)
text-xl    → 1.25rem  (20px)
text-2xl   → 1.5rem   (24px)
text-3xl   → 1.875rem (30px)
text-4xl   → 2.25rem  (36px)
```

### Pesos de Fonte

- **Light**: 300
- **Normal**: 400
- **Medium**: 500
- **Semibold**: 600
- **Bold**: 700

### Uso Recomendado

- **Títulos H1**: `text-4xl font-bold`
- **Títulos H2**: `text-3xl font-semibold`
- **Títulos H3**: `text-2xl font-semibold`
- **Corpo**: `text-base`
- **Pequeno**: `text-sm`
- **Muito pequeno**: `text-xs`

---

## 📏 Espaçamento

### Sistema de Grid (Base: 4px)

```css
0    → 0
0.5  → 0.125rem (2px)
1    → 0.25rem  (4px)
2    → 0.5rem   (8px)
3    → 0.75rem  (12px)
4    → 1rem     (16px)
5    → 1.25rem  (20px)
6    → 1.5rem   (24px)
8    → 2rem     (32px)
10   → 2.5rem   (40px)
12   → 3rem     (48px)
16   → 4rem     (64px)
20   → 5rem     (80px)
24   → 6rem     (96px)
```

### Uso Recomendado

- **Padding interno de cards**: `p-6` (24px)
- **Espaçamento entre seções**: `space-y-6` ou `gap-6`
- **Margem de containers**: `mx-auto px-4`
- **Espaçamento de formulários**: `space-y-4`

---

## 🔲 Border Radius

### Valores

- **sm**: `calc(var(--radius) - 4px)` → ~4px
- **md**: `calc(var(--radius) - 2px)` → ~6px
- **lg**: `var(--radius)` → 8px (padrão)
- **xl**: `0.75rem` → 12px
- **2xl**: `1rem` → 16px
- **full**: `9999px` → Círculo completo

### Uso Recomendado

- **Cards**: `rounded-lg`
- **Botões**: `rounded-md`
- **Inputs**: `rounded-md`
- **Badges**: `rounded-full` ou `rounded-md`

---

## 🧩 Componentes

### Button

**Variantes**:
- `default` - Botão principal (azul)
- `secondary` - Botão secundário (cinza)
- `destructive` - Ação destrutiva (vermelho)
- `outline` - Contorno apenas
- `ghost` - Sem background
- `link` - Estilo de link

**Tamanhos**:
- `sm` - Pequeno
- `default` - Padrão
- `lg` - Grande
- `icon` - Quadrado para ícones

**Exemplo**:
```tsx
<Button variant="default" size="default">
  Calcular
</Button>
```

### Card

**Estrutura**:
- `Card` - Container principal
- `CardHeader` - Cabeçalho
- `CardTitle` - Título
- `CardDescription` - Descrição
- `CardContent` - Conteúdo
- `CardFooter` - Rodapé

**Exemplo**:
```tsx
<Card>
  <CardHeader>
    <CardTitle>Área Aquecida</CardTitle>
    <CardDescription>Item A) do cálculo</CardDescription>
  </CardHeader>
  <CardContent>
    {/* Conteúdo */}
  </CardContent>
</Card>
```

### Input

**Características**:
- Border sutil
- Focus ring visível
- Placeholder estilizado
- Estados disabled

**Exemplo**:
```tsx
<Input
  type="number"
  placeholder="Digite um valor"
  value={value}
  onChange={(e) => setValue(e.target.value)}
/>
```

### Label

**Uso**: Associado a inputs e formulários

**Exemplo**:
```tsx
<Label htmlFor="temperature">
  Temperatura do Vapor (°F)
</Label>
<Input id="temperature" type="number" />
```

---

## 🎭 Estados e Interações

### Hover

- **Botões**: Escurecimento de 10% (`hover:bg-primary/90`)
- **Links**: Underline (`hover:underline`)
- **Cards**: Elevação sutil (shadow)

### Focus

- **Ring**: Anel de 2px com cor primary
- **Offset**: 2px de offset do elemento
- **Visível**: Apenas em interações via teclado

### Disabled

- **Opacity**: 50%
- **Cursor**: `not-allowed`
- **Pointer Events**: Desabilitados

---

## 📱 Responsividade

### Breakpoints Tailwind

```css
sm:  640px   → Mobile landscape
md:  768px   → Tablet
lg:  1024px  → Desktop
xl:  1280px  → Large desktop
2xl: 1536px  → Extra large
```

### Estratégia Mobile-First

- **Base**: Estilos para mobile
- **Breakpoints**: Adicionar estilos maiores com prefixos `md:`, `lg:`, etc.

**Exemplo**:
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Conteúdo */}
</div>
```

---

## ♿ Acessibilidade

### Contraste

- **Texto normal**: Mínimo 4.5:1
- **Texto grande**: Mínimo 3:1
- **Componentes interativos**: Mínimo 3:1

### Navegação por Teclado

- **Tab**: Navegação entre elementos interativos
- **Enter/Space**: Ativação de botões
- **Escape**: Fechamento de modais
- **Focus visible**: Sempre visível

### ARIA Labels

- Sempre fornecer labels descritivos
- Usar `aria-label` quando necessário
- Associar labels a inputs com `htmlFor`

---

## 🎯 Padrões de Uso

### Formulários

```tsx
<div className="space-y-4">
  <div className="space-y-2">
    <Label htmlFor="field">Campo</Label>
    <Input id="field" type="text" />
  </div>
</div>
```

### Cards de Resultado

```tsx
<Card>
  <CardHeader>
    <CardTitle>Resultado</CardTitle>
    <CardDescription>Descrição do cálculo</CardDescription>
  </CardHeader>
  <CardContent>
    <div className="text-2xl font-bold">{value}</div>
  </CardContent>
</Card>
```

### Layout de Página

```tsx
<div className="min-h-screen bg-background">
  <div className="container mx-auto px-4 py-8">
    {/* Conteúdo */}
  </div>
</div>
```

---

## 🔄 Dark Mode

O design system suporta dark mode através de variáveis CSS. Para ativar:

```tsx
<html className="dark">
  {/* Conteúdo */}
</html>
```

As cores são automaticamente ajustadas através das variáveis CSS definidas em `src/index.css`.

---

**Última atualização**: Design system inicial definido

