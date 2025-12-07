# Serigado IV Steamflood Analytical Assessment

## Visão Geral do Projeto

**Nome**: Serigado IV Steamflood Analytical Assessment
**Domínio**: steamfloodanalysis.com.br
**Repositório**: steamfloodanalysis

### Objetivo

Desenvolver uma aplicação web calculadora para análise analítica de injeção contínua de vapor no campo onshore **Serigado IV**. A aplicação permite inserir parâmetros do reservatório e vazões de injeção de vapor, calculando automaticamente métricas críticas de performance térmica.

### Fases do Projeto

#### MVP (Fase 1)

- Interface para inserção de valores de input
- Cálculo automático de outputs
- Visualização de resultados em formato tabular

#### Fase 2

- Detalhamento completo de todos os cálculos realizados
- Visualização passo a passo das equações aplicadas
- Histórico de cálculos e comparações

---

## Contexto Técnico

### Campo: Serigado IV

Campo onshore brasileiro onde será implementado projeto de recuperação térmica através de injeção contínua de vapor (steamflood).

### Fundamentação Teórica

O modelo implementa análise analítica baseada em:

1. **Marx & Langenheim** - Balanço de energia na zona de vapor
2. **Myhill & Stegemeier** - Eficiência térmica \(E_t = G(t_d)\)
3. **Mandl & Volek** - Definição de tempo crítico \(t_c\)
4. **Conceitos de ROV** - Razão Óleo/Vapor e ROV equivalente
5. **Balanço de energia** - Baseado na energia contida no óleo produzido

---

## Estrutura de Dados

### Sistema de Presets e Casos

O sistema suporta dois modos de operação:

1. **Preset Serigado IV**: Valores pré-definidos do caso específico que podem ser carregados com um clique
2. **Casos Customizados**: Usuário pode modificar qualquer valor para calcular outros cenários

#### Estrutura de Preset

```typescript
interface PresetMetadata {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt?: string;
  isDefault?: boolean;
}

interface Preset extends PresetMetadata {
  data: SteamAnalysisInput;
}

const SERIGADO_IV_PRESET: Preset = {
  id: "serigado-iv",
  name: "Serigado IV",
  description: "Caso de referência - Campo Serigado IV",
  createdAt: "2024-01-01",
  isDefault: true,
  data: {
    common: {
      // ... valores do Serigado IV
    },
    cases: [
      { rateBblPerDay: 565, rateTonsPerDay: 90 },
      { rateBblPerDay: 755, rateTonsPerDay: 120 },
    ],
  },
};
```

#### Funcionalidades de Presets

- **Carregar Preset**: Botão que preenche o formulário com valores do Serigado IV
- **Edição Livre**: Após carregar, todos os campos podem ser modificados
- **Salvar Caso Customizado**: Usuário pode salvar configurações modificadas (Fase 2)
- **Reset**: Voltar aos valores originais do preset carregado

### Inputs do Modelo

#### Dados Comuns do Reservatório (`CommonData`)

| Variável | Descrição                                            | Unidade     | Valor Serigado IV |
| -------- | ---------------------------------------------------- | ----------- | ----------------- |
| `Eb`     | Eficiência do gerador                                | -           | 0.90              |
| `Tb`     | Temperatura na caldeira                              | °F          | 70                |
| `Ts`     | Temperatura da zona de vapor                         | °F          | 500.0             |
| `Tr`     | Temperatura inicial do reservatório                  | °F          | 100               |
| `Ps`     | Pressão do vapor                                     | psia        | 315               |
| `K2`     | Condutividade térmica camadas adjacentes             | Btu/ft·h·°F | 1.2               |
| `rho1C1` | Capacidade calorífica volumétrica zona de vapor      | Btu/ft³·°F  | 35                |
| `rho2C2` | Capacidade calorífica volumétrica camadas adjacentes | Btu/ft³·°F  | 33                |
| `tYears` | Tempo de injeção                                     | anos        | 2.5               |
| `So`     | Saturação inicial de óleo                            | -           | 0.64              |
| `Sor`    | Saturação residual de óleo                           | -           | 0.15              |
| `gammaO` | Densidade relativa do óleo                           | -           | 0.94              |
| `phi`    | Porosidade do reservatório                           | -           | 0.24              |
| `zn`     | Espessura líquida do reservatório                    | ft          | 66                |
| `zt`     | Espessura total sujeita a aquecimento                | ft          | 86                |
| `fsd`    | Qualidade do vapor no reservatório                   | -           | 0.72              |
| `Fsb`    | Qualidade do vapor na caldeira                       | -           | 0.8               |
| `Lv`     | Calor de vaporização                                 | Btu/lb      | 713.9             |
| `rhoW`   | Densidade da água                                    | lb/ft³      | 62.4              |
| `CwTs`   | Entalpia água líquida a Ts                           | Btu/lb      | 361.91            |
| `CwTr`   | Entalpia água líquida a Tr                           | Btu/lb      | 77.94             |
| `CwTb`   | Entalpia água líquida a Tb                           | Btu/lb      | 38.00             |
| `fPVRef` | Fração de poro injetado (vazão ref)                  | -           | 0.54              |

#### Casos de Vazão (`SteamRateCase[]`)

| Variável        | Descrição                 | Unidade | Exemplos              |
| --------------- | ------------------------- | ------- | --------------------- |
| `name`          | Rótulo do caso            | -       | "Vazão 1 (565 bbl/d)" |
| `rateBblPerDay` | Vazão de injeção de vapor | bbl/d   | 565, 755              |

---

### Outputs do Modelo

Para cada caso de vazão, são calculados os seguintes resultados:

#### (a) Área Aquecida

- `areaPattern_ft2`: Área do padrão de poços (fixa)
- `areaHeated_As_ft2`: Área aquecida \(A_s\)
- `poreFractionInjected`: Fração de poro injetado

#### (b) Tempo Crítico

- `criticalTime_years`: Tempo crítico \(t_c\) calculado a partir de correlações (Mandl & Volek)
- Baseado em: Difusividade térmica (\(\alpha_2 = K_2 / M_2\)), tempo adimensional \(t_d\), e correlações

#### (c) Eficiência Térmica

- `thermalEfficiency`: Eficiência térmica \(E_t\) calculada a partir de correlações (Myhill & Stegemeier)
- Baseado em: Função \(E_t = G(t_d)\) obtida de gráficos/correlações

#### (d) Energia Perdida

- `totalHeatInjected_Btu`: Calor total injetado
- `storedHeat_Btu`: Energia armazenada na zona de vapor
- `lostHeat_Btu`: Energia perdida para camadas adjacentes

#### (e) Volume de Vapor Necessário

- `steamVolumeRequired_V1_ft3`: Volume de vapor necessário (ft³)
- `steamVolumeRequired_V1_bbl`: Volume de vapor necessário (bbl)

#### (f) Razão Óleo/Vapor (ROV)

- `oilProduced_Nps_bbl`: Volume de óleo produzido (bbl)
- `oilSteamRatio_Fos`: Razão óleo/vapor \(F\_{os}\)

#### (g) Razão Óleo-Vapor Equivalente

- `equivalentOilSteamRatio_Fose`: ROV equivalente \(F\_{ose}\)

#### (h) Balanço de Energia

- `oilEnergy_Btu`: Energia contida no óleo
- `boilerEnergy_Btu`: Energia requerida no gerador
- `energyBalanceIndex`: Índice de balanço de energia

---

## Equações Principais

### 1. Conversões de Tempo

\[
t*d = t*{years} \cdot 365 \quad \text{(dias)}
\]

\[
t_h = t_d \cdot 24 \quad \text{(horas)}
\]

### 2. Variação de Temperatura

\[
\Delta T = T_s - T_r
\]

### 3. Entalpias do Vapor

**No reservatório:**
\[
H*{s,r} = C*{wTs} + f\_{sd} \cdot L_v \quad [\text{Btu/lb}]
\]

**Na caldeira:**
\[
H*{s,b} = C*{wTb} + F\_{sb} \cdot L_v \quad [\text{Btu/lb}]
\]

### 4. Taxa de Massa e Calor

\[
\dot m_i [\text{lb/d}] = \text{rateBblPerDay}\_i \cdot 350
\]

\[
\dot Q*{r,i} = \dot m_i \cdot H*{s,r} \quad [\text{Btu/h}]
\]

\[
Q*{tot,i} = \dot Q*{r,i} \cdot t_h \quad [\text{Btu}]
\]

### 5. Área Aquecida \(A_s\)

\[
A*{s,i} = \frac{E_t \cdot Q*{tot,i}}{z_n \cdot M_1 \cdot \Delta T}
\]

onde \(M_1 = \rho_1 C_1\)

### 6. Volume de Vapor Necessário \(V_1\)

\[
V*{1,i} = \frac{M_1 \cdot A*{s,i} \cdot z*t \cdot \Delta T}{E_t \cdot \rho_w \cdot \big[ C_w(T_s - T_r) + f*{sd} L_v \big]}
\]

### 7. Razão Óleo/Vapor (ROV)

\[
N*{p,s} [\text{bbl}] = \frac{A*{s,i} \cdot z*n \cdot \phi \cdot (S_o - S*{or})}{5{,}615}
\]

\[
F*{os,i} = \frac{N*{p,s}[\text{bbl}]}{V\_{1,i}[\text{bbl}]}
\]

### 8. Razão Óleo-Vapor Equivalente

\[
F*{ose,i} = F*{os,i} \cdot \frac{1000}{C*w(T_s - T_b) + F*{sb} L_v}
\]

### 9. Balanço de Energia

\[
h_o = 13{,}1 + 5600 \cdot \gamma_o \quad [\text{Btu/bbl}]
\]

\[
E*{óleo,i} = N*{p,s}[\text{bbl}] \cdot h_o
\]

\[
Q*{boiler,i} = \frac{Q*{tot,i}}{E_b}
\]

\[
E*{d,i} = \frac{E*{óleo,i}}{Q\_{boiler,i}}
\]

---

## Recursos Disponíveis

### Presets e Casos

1. **Preset Serigado IV** (`docs/presets/serigado-iv.json`)
   - Valores pré-definidos do caso específico
   - Pode ser carregado com um clique
   - Todos os valores podem ser modificados após carregar
   - Formato: JSON estruturado seguindo interface `Preset`

### Tabelas e Correlações

1. **Tabela F.3 - Vapor d'Água Saturado** (`docs/tabela-valor-saturado/`)

   - Propriedades termodinâmicas do vapor saturado
   - Faixa: 32°F a 80°F (verificar se cobre Ts=500°F)
   - Formato: JSON estruturado

2. **Tabela fhv vs tcd** (`docs/table-fhv-tcd.json`)
   - Correlação para cálculo de tempo crítico
   - Formato: Array JSON com pares `{fhv, tcd}`

### Implementação de Referência

- **`docs/output-example.js`**: Implementação JavaScript completa do modelo
  - Função principal: `computeSteamInjectionAnalysis(input)`
  - Estrutura de dados bem definida
  - Cálculos validados

---

## Plano de Desenvolvimento

### MVP - Fase 1

#### Objetivos

- Interface web para inserção de inputs
- Cálculo automático de outputs
- Visualização de resultados

#### Componentes Principais

1. **Sistema de Presets/Casos**

   - **Preset Serigado IV**: Valores pré-carregados do caso específico
   - **Casos Customizados**: Permitir modificar todos os valores para outros cenários
   - **Gerenciamento de Casos**: Carregar, editar, salvar e comparar diferentes configurações
   - **Estrutura de Presets**: JSON com metadados (nome, descrição, data)

2. **Formulário de Input**

   - Seção: Dados do Reservatório (CommonData - 23 campos)
   - Seção: Casos de Vazão (múltiplas vazões - 2 campos por caso)
   - **Botão "Carregar Preset Serigado IV"**: Preenche formulário com valores padrão
   - **Campos editáveis**: Todos os valores podem ser modificados após carregar preset
   - **Nota**: Eficiência térmica e tempo crítico são calculados automaticamente (outputs)

3. **Motor de Cálculo**

   - Portar função `computeSteamInjectionAnalysis` para TypeScript
   - Validação de inputs
   - Tratamento de erros
   - **Cálculo dinâmico**: Recalcula automaticamente ao alterar qualquer valor

4. **Visualização de Resultados**
   - Tabela comparativa por caso de vazão
   - Organização por itens (a) a (h)
   - Exportação de resultados (JSON/CSV)
   - **Indicador de preset**: Mostrar qual caso está sendo calculado

#### Stack Tecnológico Sugerido

- **Frontend**: Next.js 14+ (App Router), TypeScript, Tailwind CSS
- **UI Components**: Shadcn UI
- **Validação**: Zod + React Hook Form
- **Cálculos**: TypeScript puro (sem dependências externas)

### Fase 2 - Detalhamento de Cálculos

#### Objetivos

- Apresentar passo a passo de cada cálculo
- Mostrar equações aplicadas
- Exibir valores intermediários
- Histórico e comparações

#### Funcionalidades Adicionais

1. **Visualização de Cálculos**

   - Expandir/collapsar detalhes por item
   - Mostrar equações com valores substituídos
   - Highlight de valores intermediários

2. **Gráficos e Visualizações**

   - ROV vs Vazão
   - Balanço de energia
   - Área aquecida vs tempo

3. **Histórico e Comparações**
   - Salvar cenários customizados
   - Comparar múltiplos casos lado a lado
   - Exportar relatórios
   - **Biblioteca de Presets**: Expandir com outros casos de referência

---

## Observações Importantes

### Inconsistências Identificadas

1. **`problem.md` linha 15-16**:

   - Ambos usam `zt` para espessura líquida e total
   - Correto: `zn = 66 ft` (líquida), `zt = 86 ft` (total)

2. **Tabela de Vapor Saturado**:

   - Cobre apenas 32°F a 80°F
   - Necessário verificar se há tabela para Ts=500°F ou usar interpolação

3. **Valores Calculados**:
   - `thermalEfficiency` e `criticalTimeYears` são OUTPUTS calculados automaticamente
   - Item (b): Tempo crítico calculado via correlações (Mandl & Volek)
   - Item (c): Eficiência térmica calculada via correlações (Myhill & Stegemeier)
   - Considerar implementar lookup/interpolação das tabelas disponíveis para cálculo automático

### Status Atual do Projeto

#### ✅ Concluído - Sistema de Inputs
- ✅ **23 campos comuns** implementados e validados
- ✅ **2 campos por caso** com conversão automática bbl/d ↔ t/d
- ✅ **Validação completa** via Zod schemas
- ✅ **Interface de formulário** organizada em seções
- ✅ **Preset Serigado IV** carregado automaticamente
- ✅ **Estrutura de dados** corrigida (outputs removidos dos inputs)

#### ✅ Concluído - Item A (Área Aquecida)
- ✅ **Cálculo implementado** com todas as dependências
- ✅ **Componente detalhado** criado (`AreaHeatedDetail`)
- ✅ **Fórmula exibida** com explicação das variáveis
- ✅ **Cálculos intermediários** mostrados passo a passo
- ✅ **Aplicação da fórmula** com valores substituídos
- ✅ **Resultado final** destacado

#### 🚧 Em Desenvolvimento
- 🚧 **Correlações reais**: Eficiência Térmica e Tempo Crítico (stubs implementados)
- ⏳ **Itens B-H**: A implementar

### Próximos Passos

1. ✅ ~~Organizar documentação consolidada~~
2. ✅ ~~Validar dados do problema (Serigado IV)~~
3. ✅ ~~Definir estrutura do projeto~~
4. ✅ ~~Implementar sistema de inputs~~
5. ✅ ~~Implementar Item A com detalhamento~~
6. ⏳ Implementar correlações reais (Et e tc)
7. ⏳ Implementar Itens B-H
8. ⏳ Verificar cobertura das tabelas termodinâmicas (Fase 2)

---

## Referências

- Marx & Langenheim - Balanço de energia
- Myhill & Stegemeier - Eficiência térmica
- Mandl & Volek - Tempo crítico
- Documentação técnica: `docs/serigadoiv_steamflood_model.md`
- Implementação de referência: `docs/output-example.js`
