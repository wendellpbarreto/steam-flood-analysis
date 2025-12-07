# Serigado IV Steamflood Analytical Assessment

## 📋 Visão Geral

Aplicação web calculadora para análise analítica de injeção contínua de vapor no campo onshore **Serigado IV**.

**Domínio**: steamfloodanalysis.com.br
**Repositório**: steamfloodanalysis

---

## 🎯 Objetivo

Desenvolver uma SPA (Single Page Application) que permite:

### MVP (Fase 1)

- ✅ **Preset Serigado IV**: Carregar valores pré-definidos com um clique
- ✅ **Edição Livre**: Modificar qualquer valor para calcular outros cenários
- ✅ Inserção de valores de input (dados do reservatório, vazões)
- ✅ Cálculo automático de outputs (8 itens principais)
- ✅ Visualização de resultados em formato tabular

### Fase 2

- 📊 Detalhamento completo de todos os cálculos
- 📐 Visualização passo a passo das equações aplicadas
- 📈 Gráficos e comparações
- 💾 Histórico de cálculos

---

## 📚 Documentação

### Documentos Principais

1. **[PROJETO.md](./PROJETO.md)** - Visão geral do projeto

   - Objetivos e fases
   - Estrutura de dados (inputs/outputs)
   - Equações principais
   - Plano de desenvolvimento

2. **[MODELO_TECNICO.md](./MODELO_TECNICO.md)** - Detalhamento técnico

   - Fundamentação teórica
   - Fluxo de cálculo passo a passo
   - Estrutura de dados TypeScript
   - Validações e observações

3. **[calculos/](./calculos/)** - Documentação detalhada dos cálculos
   - **[README.md](./calculos/README.md)** - Diretrizes de documentação
   - **[ITEM_A_AREA_AQUECIDA.md](./calculos/ITEM_A_AREA_AQUECIDA.md)** - Documentação completa do Item A
     - Fundamentação teórica (Marx & Lengenheim)
     - Cálculo detalhado de H₀
     - Uso da tabela de vapor saturado
     - Implementação no código
     - Exemplo numérico completo
   - **[ITEM_B_TEMPO_CRITICO.md](./calculos/ITEM_B_TEMPO_CRITICO.md)** - Documentação completa do Item B
     - Fundamentação teórica (Mandl & Volek)
     - Cálculo de G₁ e busca numérica de t_cD
     - Uso da tabela FHV-t_cD
     - Implementação no código
     - Exemplo numérico completo
   - **[ITEM_C_EFICIENCIA_TERMICA.md](./calculos/ITEM_C_EFICIENCIA_TERMICA.md)** - Documentação completa do Item C
     - Fundamentação teórica (Myhill & Stegemeier)
     - Cálculo de G(t_d) e função erro complementar
     - Tempo adimensional e difusividade térmica
     - Implementação no código
     - Exemplo numérico completo

### Documentos de Referência

- **[referencia/serigadoiv_steamflood_model.md](./referencia/serigadoiv_steamflood_model.md)** - Documentação técnica original
- **[referencia/problem.md](./referencia/problem.md)** - Dados do problema Serigado IV
- **[referencia/output-example.js](./referencia/output-example.js)** - Implementação JavaScript de referência

### Recursos de Dados

- **[presets/serigado-iv.json](./presets/serigado-iv.json)** - Preset com valores do Serigado IV
- **[tabelas/vapor-saturado/](./tabelas/vapor-saturado/)** - Tabela F.3 de vapor saturado (JSON)
- **[tabelas/fhv-tcd.json](./tabelas/fhv-tcd.json)** - Correlação fhv vs tcd (tempo crítico)

---

## 🔬 Modelo Analítico

### Fundamentação

O modelo implementa análise analítica baseada em:

1. **Marx & Langenheim** - Balanço de energia na zona de vapor
2. **Myhill & Stegemeier** - Eficiência térmica \(E_t = G(t_d)\)
3. **Mandl & Volek** - Tempo crítico \(t_c\)
4. **Conceitos de ROV** - Razão Óleo/Vapor e equivalente
5. **Balanço de energia** - Baseado na energia do óleo produzido

### Cálculos Realizados

Para cada vazão de injeção, são calculados:

- **(a)** Área aquecida \(A_s\)
- **(b)** Tempo crítico \(t_c\)
- **(c)** Eficiência térmica \(E_t\)
- **(d)** Energia perdida para camadas adjacentes
- **(e)** Volume de vapor necessário para aquecer a rocha
- **(f)** Razão óleo/vapor (ROV)
- **(g)** Razão óleo-vapor equivalente
- **(h)** Balanço total de energia

---

## 📊 Dados do Problema (Serigado IV)

### Parâmetros do Reservatório

| Parâmetro                               | Valor  | Unidade     |
| --------------------------------------- | ------ | ----------- |
| Eficiência do gerador (Eb)              | 0.90   | -           |
| Temperatura do gerador (Tb)             | 70     | °F          |
| Temperatura do vapor (Ts)               | 500.0  | °F          |
| Temperatura do reservatório (Tr)        | 100    | °F          |
| Pressão do vapor (Ps)                   | 315    | psia        |
| Condutividade camadas adjacentes (K2)   | 1.2    | Btu/ft·h·°F |
| Capacidade calorífica zona vapor (ρ1C1) | 35     | Btu/ft³·°F  |
| Capacidade calorífica camadas (ρ2C2)    | 33     | Btu/ft³·°F  |
| Tempo de injeção (t)                    | 2.5    | anos        |
| Saturação inicial de óleo (So)          | 0.64   | -           |
| Saturação residual de óleo (Sor)        | 0.15   | -           |
| Densidade relativa do óleo (γo)         | 0.94   | -           |
| Porosidade (φ)                          | 0.24   | -           |
| Espessura líquida (zn)                  | 66     | ft          |
| Espessura total (zt)                    | 86     | ft          |
| Qualidade vapor reservatório (fsd)      | 0.72   | -           |
| Qualidade vapor gerador (Fsb)           | 0.8    | -           |
| Calor de vaporização (Lv)               | 713.9  | Btu/lb      |
| Densidade da água (ρw)                  | 62.4   | lb/ft³      |
| Entalpia água a Ts (CwTs)               | 361.91 | Btu/lb      |
| Entalpia água a Tr (CwTr)               | 77.94  | Btu/lb      |
| Entalpia água a Tb (CwTb)               | 38.00  | Btu/lb      |
| Fração de poro injetado (fPVRef)        | 0.54   | -           |

### Casos de Vazão

- **Vazão 1**: 565 bbl/d (90 t/dia)
- **Vazão 2**: 755 bbl/d (120 t/dia)

### Outputs Calculados

- **Item (b) - Tempo crítico (tc)**: Calculado via correlações de Mandl & Volek
- **Item (c) - Eficiência térmica (Et)**: Calculada via correlações de Myhill & Stegemeier

---

## 🎛️ Sistema de Presets e Casos

### Funcionalidade Principal

O sistema suporta dois modos de operação:

1. **Preset Serigado IV**: Valores pré-definidos do caso específico

   - Carregar com um clique através de botão "Carregar Preset Serigado IV"
   - Preenche automaticamente todos os campos do formulário
   - Valores validados do problema original

2. **Casos Customizados**: Modificação livre de valores
   - Após carregar preset, todos os campos podem ser editados
   - Permite calcular outros cenários além do Serigado IV
   - Cálculo automático ao modificar qualquer valor

### Estrutura de Preset

```typescript
interface Preset {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  isDefault?: boolean;
  data: SteamAnalysisInput;
}
```

### Arquivo de Preset

O preset Serigado IV está disponível em: **[presets/serigado-iv.json](./presets/serigado-iv.json)**

### Funcionalidades por Fase

**MVP (Fase 1)**:

- ✅ Carregar preset Serigado IV
- ✅ Editar todos os valores livremente
- ✅ Calcular com valores modificados

**Fase 2**:

- 📝 Salvar casos customizados
- 📊 Comparar múltiplos casos
- 📚 Biblioteca expandida de presets

---

## 🚀 Status Atual

### ✅ Concluído

1. ✅ **Documentação organizada** - Estrutura completa e atualizada
2. ✅ **Stack tecnológico definido** - Vite + React + TypeScript + Tailwind CSS
3. ✅ **Estrutura do projeto criada** - Arquitetura implementada
4. ✅ **Sistema de inputs completo** - 23 campos comuns + 2 por caso
5. ✅ **Preset Serigado IV** - Carregamento automático
6. ✅ **Item A implementado** - Área Aquecida com fórmula completa de Marx & Lengenheim
7. ✅ **Item B implementado** - Tempo Crítico com correlação de Mandl & Volek
8. ✅ **Item C implementado** - Eficiência Térmica com correlação de Myhill & Stegemeier
9. ✅ **Tabela de vapor saturado** - Integrada com busca e interpolação
10. ✅ **Tabela FHV-t_cD** - Integrada com busca e interpolação
11. ✅ **Documentação completa** - Itens A, B e C totalmente documentados
12. ✅ **Estrutura de documentação** - Pasta `calculos/` com diretrizes e templates

### 🚧 Em Desenvolvimento

- **Itens D-H**: Implementar cálculos e visualizações dos demais itens

### 📋 Próximos Passos

1. ⏳ Implementar Itens D-H (Energia Perdida, Volume de Vapor, ROV, etc.)
2. ⏳ Validar cálculos com valores de referência
3. ⏳ Documentar Itens D-H seguindo as diretrizes estabelecidas
4. ⏳ Implementar gráficos e comparações (Fase 2)

### Estrutura do Projeto (Sugerida)

```
steamfloodanalysis/
├── docs/                    # Documentação
├── src/
│   ├── app/                # Next.js App Router
│   ├── components/         # Componentes React
│   ├── lib/                # Lógica de negócio
│   │   ├── calculations/   # Funções de cálculo
│   │   ├── types/          # TypeScript types
│   │   └── validation/     # Validações Zod
│   └── data/               # Dados estáticos (tabelas)
├── public/                 # Assets estáticos
└── package.json
```

---

## ⚠️ Observações Importantes

### Inconsistências Identificadas

1. **`problem.md`**: Variáveis de espessura usam mesmo nome (`zt` para ambos)

   - Correto: `zn = 66 ft` (líquida), `zt = 86 ft` (total)

2. **Tabela de vapor saturado**: Cobre apenas 32°F a 80°F

   - Valores de entalpia já fornecidos no problema
   - Para Fase 2, considerar expansão ou biblioteca termodinâmica

3. **Valores de correlação**: `Et` e `tc` precisam ser obtidos de gráficos
   - MVP: Entrada manual
   - Fase 2: Implementar lookup/interpolação

> **Nota**: Documentos históricos e análises antigas foram arquivados em `docs/_arquivo/` para manter a documentação atual e organizada.

---

## 📖 Referências

- Marx & Langenheim - Balanço de energia
- Myhill & Stegemeier - Eficiência térmica
- Mandl & Volek - Tempo crítico
- Documentação técnica: `docs/serigadoiv_steamflood_model.md`
- Implementação de referência: `docs/output-example.js`

---

## 📝 Status do Projeto

- [x] Análise e organização da documentação
- [x] Consolidação do conhecimento técnico
- [x] Identificação de inconsistências
- [ ] Validação de dados do problema
- [ ] Estruturação do projeto Next.js
- [ ] Implementação do MVP
- [ ] Implementação da Fase 2

---

**Última atualização**: Organização inicial da documentação concluída
