# Serigado IV – Steamflood Analytical Assessment

Calculadora web para análise analítica de injeção contínua de vapor (steamflood) no campo onshore **Serigado IV**. Inclui preset do caso real, interpolação de tabelas termodinâmicas e cards detalhados com fórmulas (KaTeX) para os itens A–H (área aquecida, tempo crítico, eficiência térmica, perdas, volumes e balanço energético).

---

## 🚀 Início Rápido

Requisitos: Node 18+.

Instalação (pnpm recomendado):
```bash
pnpm install
```
ou
```bash
npm install
```

Desenvolvimento:
```bash
pnpm dev
```
App em `http://localhost:5173`.

Build:
```bash
pnpm build
```

Preview:
```bash
pnpm preview
```

Testes:
```bash
pnpm test
```

---

## 🛠️ Stack

- **Vite + React + TypeScript**
- **Tailwind CSS** (tema custom inspirado na marca)
- **react-katex** para fórmulas
- **Zod** para validação
- **Vitest** para testes de cálculos

---

## 📚 Documentação

- Visão técnica e cálculos: `docs/`
  - `docs/PROJETO.md` – visão geral
  - `docs/MODELO_TECNICO.md` – fundamentação e equações
  - `docs/calculos/` – itens A–H detalhados
  - Tabelas: `docs/tabelas/` (referência) e `src/assets/tables/` (uso na aplicação)

---

## 📁 Estrutura

```
steamfloodanalysis/
├── docs/                 # Documentação técnica e cálculos
├── public/               # Assets estáticos (favicon, logo)
├── src/
│   ├── assets/           # Ícones e tabelas JSON
│   ├── components/       # UI React (cards de itens A–H, forms)
│   ├── data/             # Presets e tabelas auxiliares (fhv-tcd, vapor saturado)
│   └── lib/              # Cálculos (área, t_c, eficiência, volumes, balanço)
└── ...
```

---

## 🎯 Status

- [x] Preset Serigado IV e inputs editáveis
- [x] Itens A–H implementados e exibidos em cards (KaTeX + passos detalhados)
- [x] Interpolação de tabelas de vapor saturado e fhv–tcd
- [x] Tema custom (paleta da marca, favicon/logo no header)
- [x] Testes de cálculo e benchmarks (Vitest)
- [ ] Inclusão de outras tabelas/temperaturas (ex.: faixas adicionais no vapor saturado)
- [ ] Exportar resultados (CSV/JSON) e comparativos entre casos

---

## 📝 Licença

Projeto disponibilizado publicamente para fins técnicos/demonstrativos. Verifique requisitos de uso dos dados/tabelas antes de redistribuir.
