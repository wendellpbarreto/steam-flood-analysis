# Modelo Analítico - Steamflood Serigado IV

## Visão Geral

Este documento consolida o conhecimento técnico sobre o modelo analítico de injeção contínua de vapor implementado para o campo Serigado IV.

---

## 1. Fundamentação Teórica

### 1.1. Marx & Langenheim

Modelo de balanço de energia na zona de vapor:

\[
Q\_{armazenado} = A_s \cdot z_n \cdot M_1 \cdot \Delta T
\]

onde:

- \(Q\_{armazenado}\): Energia armazenada na zona de vapor
- \(A_s\): Área aquecida
- \(z_n\): Espessura líquida do reservatório
- \(M_1 = \rho_1 C_1\): Capacidade calorífica volumétrica da zona de vapor
- \(\Delta T = T_s - T_r\): Variação de temperatura

### 1.2. Myhill & Stegemeier

Eficiência térmica global:

\[
E_t = G(t_d)
\]

onde \(G(t_d)\) é obtido de gráficos/correlações em função do tempo adimensional \(t_d\).

A eficiência térmica relaciona o calor armazenado com o calor total injetado:

\[
E*t = \frac{Q*{armazenado}}{Q\_{tot}}
\]

### 1.3. Mandl & Volek

Tempo crítico \(t_c\): tempo necessário para que a zona de vapor atinja condições críticas de expansão.

Obtido de correlações baseadas em:

- Difusividade térmica: \(\alpha_2 = \frac{K_2}{M_2}\)
- Geometria do padrão de poços
- Propriedades térmicas das camadas adjacentes

---

## 2. Fluxo de Cálculo

### Etapa 1: Preparação dos Dados

#### 1.1. Conversões de Tempo

```typescript
const tDays = tYears * 365.0;
const tHours = tDays * 24.0;
```

#### 1.2. Variação de Temperatura

```typescript
const deltaT = Ts - Tr;
```

#### 1.3. Cálculo de Entalpias

**Entalpia no reservatório:**

```typescript
const enthalpyReservoir = CwTs + fsd * Lv;
```

**Entalpia na caldeira:**

```typescript
const enthalpyBoiler = CwTb + Fsb * Lv;
```

### Etapa 2: Cálculo para Caso de Referência

O primeiro caso da lista é usado como referência para calcular a área do padrão de poços.

#### 2.1. Taxa Mássica

```typescript
const massRate_lbPerDay = rateBblPerDay * 350.0;
const massRate_lbPerHour = massRate_lbPerDay / 24.0;
```

**Nota**: 1 bbl ≈ 350 lb de água

#### 2.2. Taxa de Calor

```typescript
const heatRate_BtuPerHour = massRate_lbPerHour * enthalpyReservoir;
const totalHeat_Btu = heatRate_BtuPerHour * tHours;
```

#### 2.3. Volume de Água Fria Equivalente (CWE)

```typescript
const VCWE_bbl = rateBblPerDay * tDays;
const VCWE_ft3 = VCWE_bbl * 5.615;
```

#### 2.4. Área do Padrão de Poços

```typescript
const patternArea_ft2 = VCWE_ft3 / (fPVRef * zn * phi);
```

Esta área é **fixa** para todos os casos subsequentes.

### Etapa 3: Cálculo para Cada Caso de Vazão

#### 3.1. Massa e Calor (repetir para cada caso)

```typescript
const massRate_lbPerDay = rateBblPerDay * 350.0;
const massRate_lbPerHour = massRate_lbPerDay / 24.0;
const heatRate_BtuPerHour = massRate_lbPerHour * enthalpyReservoir;
const totalHeat_Btu = heatRate_BtuPerHour * tHours;
```

#### 3.2. Fração de Poro Injetado

```typescript
const PV_total_ft3 = patternArea_ft2 * zn * phi;
const VCWE_ft3 = rateBblPerDay * tDays * 5.615;
const poreFractionInjected = VCWE_ft3 / PV_total_ft3;
```

#### 3.3. Item (a) - Área Aquecida \(A_s\)

**Nota**: Este cálculo requer a eficiência térmica \(E_t\) que é calculada no Item (c). Para o MVP, pode ser necessário calcular os itens em ordem: primeiro (c), depois (a).

```typescript
const thermalEfficiency = calculateThermalEfficiency(...);
const storedHeat_Btu = thermalEfficiency * totalHeat_Btu;
const areaHeated_ft2 = storedHeat_Btu / (zn * rho1C1 * deltaT);
```

**Equação:**
\[
A*{s,i} = \frac{E_t \cdot Q*{tot,i}}{z_n \cdot M_1 \cdot \Delta T}
\]

#### 3.4. Item (b) - Tempo Crítico \(t_c\)

O tempo crítico é **calculado** a partir de correlações de Mandl & Volek.

```typescript
const alpha2 = K2 / rho2C2;
const tDimensionless = calculateTDimensionless(alpha2, tYears, zn, ...);
const criticalTime_years = lookupMandlVolek(tDimensionless);
```

**Nota**: Para MVP, pode ser necessário implementar lookup/interpolação da tabela `table-fhv-tcd.json`.

#### 3.5. Item (c) - Eficiência Térmica \(E_t\)

A eficiência térmica é **calculada** a partir de correlações de Myhill & Stegemeier.

```typescript
const tDimensionless = calculateTDimensionless(...);
const thermalEfficiency = lookupMyhillStegemeier(tDimensionless);
```

**Nota**: Função \(E_t = G(t_d)\) obtida de gráficos/correlações. Para MVP, pode ser necessário implementar lookup/interpolação.

#### 3.6. Item (d) - Energia Perdida

```typescript
const storedHeat_Btu = thermalEfficiency * totalHeat_Btu;
const lostHeat_Btu = (1.0 - thermalEfficiency) * totalHeat_Btu;
```

**Equação:**
\[
Q*{perdido} = (1 - E_t) \cdot Q*{tot}
\]

#### 3.7. Item (e) - Volume de Vapor Necessário \(V_1\)

```typescript
const denominator = rhoW * (CwTs - CwTr + fsd * Lv);
const V1_ft3 = storedHeat_Btu / denominator;
const V1_bbl = V1_ft3 / 5.615;
```

**Equação:**
\[
V*{1,i} = \frac{Q*{armazenado,i}}{\rho*w \cdot \big[ C_w(T_s - T_r) + f*{sd} L_v \big]}
\]

#### 3.8. Item (f) - Razão Óleo/Vapor (ROV)

```typescript
const deltaS = So - Sor;
const Nps_ft3 = areaHeated_ft2 * zn * phi * deltaS;
const Nps_bbl = Nps_ft3 / 5.615;
const oilSteamRatio = Nps_bbl / V1_bbl;
```

**Equação:**
\[
N*{p,s} = A*{s,i} \cdot z*n \cdot \phi \cdot (S_o - S*{or})
\]

\[
F*{os} = \frac{N*{p,s}}{V\_{1,i}}
\]

#### 3.9. Item (g) - Razão Óleo-Vapor Equivalente

```typescript
const equivalentOilSteamRatio = oilSteamRatio * (1000.0 / enthalpyBoiler);
```

**Equação:**
\[
F*{ose} = F*{os} \cdot \frac{1000}{H\_{s,b}}
\]

Normaliza para vapor padrão de 1000 Btu/lb na caldeira.

#### 3.10. Item (h) - Balanço de Energia

```typescript
const ho = 13.1 + 5600.0 * gammaO;
const oilEnergy_Btu = Nps_bbl * ho;
const boilerEnergy_Btu = totalHeat_Btu / Eb;
const energyBalanceIndex = oilEnergy_Btu / boilerEnergy_Btu;
```

**Equação:**
\[
h_o = 13{,}1 + 5600 \cdot \gamma_o \quad [\text{Btu/bbl}]
\]

\[
E*{óleo} = N*{p,s} \cdot h_o
\]

\[
Q*{boiler} = \frac{Q*{tot}}{E_b}
\]

\[
E*d = \frac{E*{óleo}}{Q\_{boiler}}
\]

---

## 3. Sistema de Presets e Casos

### 3.1. Conceito

O sistema permite trabalhar com dois tipos de configurações:

1. **Preset Serigado IV**: Valores pré-definidos do caso específico
2. **Casos Customizados**: Configurações modificadas pelo usuário

### 3.2. Estrutura de Preset

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
```

### 3.3. Fluxo de Uso

1. **Carregar Preset Serigado IV**: Preenche formulário com valores padrão
2. **Modificar Valores**: Usuário pode alterar qualquer campo
3. **Calcular**: Sistema recalcula automaticamente com novos valores
4. **Salvar Caso** (Fase 2): Salvar configuração customizada

### 3.4. Valores do Preset Serigado IV

Os valores do preset estão documentados em `docs/problem.md` e devem ser implementados como constante no código:

```typescript
const SERIGADO_IV_PRESET: Preset = {
  id: "serigado-iv",
  name: "Serigado IV",
  description: "Caso de referência - Campo Serigado IV",
  isDefault: true,
  data: {
    common: {
      Eb: 0.9,
      Tb: 70,
      Ts: 500.0,
      Tr: 100,
      // ... todos os valores do problema
    },
    cases: [
      { rateBblPerDay: 565, rateTonsPerDay: 90 },
      { rateBblPerDay: 755, rateTonsPerDay: 120 },
    ],
  },
};
```

## 4. Estrutura de Dados TypeScript

### Input

```typescript
interface CommonData {
  Eb: number;
  Tb: number;
  Ts: number;
  Tr: number;
  Ps: number;
  K2: number;
  rho1C1: number;
  rho2C2: number;
  tYears: number;
  So: number;
  Sor: number;
  gammaO: number;
  phi: number;
  zn: number;
  zt: number;
  fsd: number;
  Fsb: number;
  Lv: number;
  rhoW: number;
  CwTs: number;
  CwTr: number;
  CwTb: number;
  fPVRef: number;
}

interface SteamRateCase {
  name: string;
  rateBblPerDay: number;
}

interface SteamAnalysisInput {
  common: CommonData;
  cases: SteamRateCase[];
}
```

### Output

```typescript
interface SteamRateResult {
  name: string;
  rateBblPerDay: number;

  massRate_lbPerDay: number;
  massRate_lbPerHour: number;
  totalHeatInjected_Btu: number;

  areaPattern_ft2: number;
  areaHeated_As_ft2: number;
  poreFractionInjected: number;

  criticalTime_years: number;
  thermalEfficiency: number;

  storedHeat_Btu: number;
  lostHeat_Btu: number;

  steamVolumeRequired_V1_ft3: number;
  steamVolumeRequired_V1_bbl: number;

  oilProduced_Nps_bbl: number;
  oilSteamRatio_Fos: number;

  equivalentOilSteamRatio_Fose: number;

  oilEnergy_Btu: number;
  boilerEnergy_Btu: number;
  energyBalanceIndex: number;
}

interface SteamAnalysisOutput {
  enthalpyReservoir_BtuPerLb: number;
  enthalpyBoiler_BtuPerLb: number;
  patternArea_ft2: number;
  thermalEfficiency: number;
  criticalTime_years: number;
  cases: SteamRateResult[];
}
```

---

## 4. Constantes e Conversões

```typescript
const FT3_PER_BBL = 5.615;
const LBS_PER_BBL_WATER = 350.0;
const DAYS_PER_YEAR = 365.0;
const HOURS_PER_DAY = 24.0;
```

---

## 5. Validações Necessárias

### 5.1. Validação de Inputs

- Todos os valores numéricos devem ser positivos (exceto temperaturas que podem ser negativas)
- `So > Sor` (saturação inicial maior que residual)
- `Ts > Tr` (temperatura do vapor maior que do reservatório)
- `thermalEfficiency` entre 0 e 1
- `cases.length > 0`
- `fPVRef > 0` e `fPVRef <= 1`

### 5.2. Validação de Cálculos

- `areaHeated_As_ft2 <= areaPattern_ft2` (área aquecida não pode exceder área do padrão)
- `poreFractionInjected <= 1` (fração de poro não pode exceder 1)
- `energyBalanceIndex` positivo (energia do óleo deve ser positiva)

---

## 6. Observações Técnicas

### 6.1. Área do Padrão

A área do padrão é calculada uma única vez usando o caso de referência e permanece constante para todos os casos. Isso garante consistência na comparação entre diferentes vazões.

### 6.2. Eficiência Térmica e Tempo Crítico

Estes valores são **outputs calculados** do modelo (itens B e C):

- **Item (b) - Tempo Crítico**: Calculado via correlações de Mandl & Volek
  - Baseado em difusividade térmica (\(\alpha_2 = K_2 / M_2\))
  - Tempo adimensional \(t_d\)
  - Lookup/interpolação da tabela `table-fhv-tcd.json`

- **Item (c) - Eficiência Térmica**: Calculada via correlações de Myhill & Stegemeier
  - Função \(E_t = G(t_d)\)
  - Requer implementação de lookup/interpolação de gráficos/correlações

**Nota**: Para MVP, pode ser necessário implementar funções de cálculo ou lookup das tabelas disponíveis.

### 6.3. Unidades

O modelo usa unidades inglesas (Btu, °F, ft, psia, bbl). Manter consistência é crítico para resultados corretos.

### 6.4. Correlação de Energia do Óleo

A equação \(h_o = 13{,}1 + 5600 \cdot \gamma_o\) é uma correlação empírica tipo Zaba. Verificar se há correlação específica para o óleo do Serigado IV.

---

## 7. Referências de Implementação

- Arquivo de referência: `docs/output-example.js`
- Documentação detalhada: `docs/serigadoiv_steamflood_model.md`
- Dados do problema: `docs/problem.md`
