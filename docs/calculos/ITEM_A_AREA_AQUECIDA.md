# Item A - Cálculo da Área Aquecida (A_s)

## 📋 Visão Geral

O Item A calcula a **área aquecida (A_s)** durante o processo de injeção contínua de vapor usando o modelo de **Marx & Lengenheim**. Este cálculo é fundamental para determinar a extensão da zona aquecida no reservatório após um período de injeção.

---

## 🎯 Objetivo

Calcular a área aquecida (em ft²) que será formada no reservatório após injeção contínua de vapor por um período determinado, considerando:

- Taxa de injeção de vapor (bbl/d)
- Propriedades térmicas do reservatório e camadas adjacentes
- Qualidade do vapor injetado
- Eficiência térmica do processo
- Propriedades termodinâmicas do vapor saturado

---

## 📐 Fundamentação Teórica

### Modelo de Marx & Lengenheim

O modelo de Marx & Lengenheim é baseado em um **balanço de energia** na zona de vapor. A fórmula completa para calcular a área aquecida é:

\[
A_s = \frac{H_0 \times M_1 \times h}{4 \times \alpha_2 \times M_2^2 \times (T_s - T_r)} \times G(t_d)
\]

Onde:

- **A_s**: Área aquecida (ft²)
- **H₀**: Taxa instantânea de injeção de calor (Btu/h)
- **M₁**: Capacidade calorífica volumétrica da zona de vapor (Btu/ft³·°F)
- **h**: Espessura total do reservatório (ft) - igual a z_t (espessura total), **não** z_n (espessura líquida)
- **α₂**: Difusividade térmica das camadas adjacentes (ft²/h)
- **M₂**: Capacidade calorífica volumétrica das camadas adjacentes (Btu/ft³·°F)
- **T_s**: Temperatura da zona de vapor (°F)
- **T_r**: Temperatura inicial do reservatório (°F)
- **G(t_d)**: Função de tempo adimensional (Myhill & Stegemeier)

### Função G(t_d)

A função G(t_d) é calculada usando a fórmula:

\[
G(t_d) = e^{t_d} \times \text{erfc}(\sqrt{t_d}) + 2\sqrt{\frac{t_d}{\pi}} - 1
\]

Onde **erfc** é a função erro complementar.

### Tempo Adimensional (t_d)

O tempo adimensional relaciona o tempo de injeção físico com as propriedades térmicas do reservatório e camadas adjacentes. É um parâmetro fundamental que determina a eficiência térmica do processo.

**Fórmula (conforme imagem de referência):**

\[
t_d = 4 \times \left(\frac{M_2}{M_1}\right)^2 \times \frac{\alpha_2}{h^2} \times t
\]

**Componentes da Fórmula:**

1. **4**: Constante de proporcionalidade (adimensional)
2. **(M₂/M₁)²**: Razão das capacidades caloríficas volumétricas elevada ao quadrado
   - **M₂**: Capacidade calorífica volumétrica das camadas adjacentes (Btu/ft³·°F) = ρ₂C₂
   - **M₁**: Capacidade calorífica volumétrica da zona de vapor (Btu/ft³·°F) = ρ₁C₁
   - Este termo representa a diferença de propriedades térmicas entre a zona de vapor e as camadas adjacentes
3. **α₂/h²**: Razão entre difusividade térmica e espessura ao quadrado
   - **α₂**: Difusividade térmica das camadas adjacentes (ft²/h) = K₂/(ρ₂C₂)
   - **h**: Espessura total do reservatório (ft) = z_t
   - **Importante**: Usa-se a **espessura total (z_t)** e não a espessura líquida (z_n)
   - Este termo relaciona a capacidade de difusão térmica com a geometria do reservatório
4. **t**: Tempo total de injeção (horas)

**Unidade Final**: t_d é adimensional (sem unidade)

**Interpretação Física:**
- Valores pequenos de t_d (< 0.1): Processo em estágio inicial, muita perda de calor
- Valores médios de t_d (0.1 - 10): Processo em desenvolvimento, eficiência térmica aumentando
- Valores grandes de t_d (> 10): Processo avançado, alta eficiência térmica

---

## 🔢 Cálculo de H₀ (Taxa de Calor)

A taxa instantânea de injeção de calor (H₀) é o componente mais complexo do cálculo e envolve o uso da **tabela de vapor saturado**.

### Passo 1: Obter Entalpias da Tabela por Pressão

**Entrada**: Pressão do vapor (P_s) em psia

**Processo**:
1. Buscar na tabela `tabela_vapor_saturado.json` os valores de entalpia para a pressão P_s
2. Se P_s não existir exatamente na tabela, **interpolar** entre os valores maior e menor mais próximos
3. Extrair:
   - **H_L** = `entalpia.hf` (entalpia da fase líquida saturada)
   - **H_v** = `entalpia.hg` (entalpia da fase vapor saturada)

**Exemplo (Serigado IV)**:
- P_s = 315 psia
- Como 315 psia não existe exatamente na tabela, interpola entre valores próximos
- Resultado: H_L e H_v interpolados

### Passo 2: Calcular Entalpia do Vapor (H_s)

Usando a fórmula de entalpia do vapor de qualidade f_s:

\[
H_s = (1 - f_s) \times H_L + f_s \times H_v
\]

Onde:
- **f_s**: Qualidade do vapor no reservatório (fsd) - fração em peso (0 a 1)
- **H_L**: Entalpia da fase líquida (Btu/lb)
- **H_v**: Entalpia da fase vapor (Btu/lb)

**Exemplo (Serigado IV)**:
- f_s = 0.72 (72% de vapor, 28% de líquido)
- H_s = (1 - 0.72) × H_L + 0.72 × H_v

### Passo 3: Obter Entalpia do Reservatório (h_res)

**Entrada**: Temperatura do reservatório (T_r) em °F

**Processo**:
1. Buscar na tabela `tabela_vapor_saturado.json` o valor de entalpia para a temperatura T_r
2. Se T_r não existir exatamente na tabela, **interpolar** entre os valores maior e menor mais próximos
3. Extrair:
   - **h_res** = `entalpia.hf` (entalpia da fase líquida saturada @ T_r)

**Exemplo (Serigado IV)**:
- T_r = 100°F
- Como 100°F existe exatamente na tabela, não precisa interpolar
- h_res = 68.0 Btu/lb (valor exato da tabela)

### Passo 4: Calcular Entalpia Efetiva

\[
H_s - h_{res} = \text{Entalpia efetiva disponível para aquecimento}
\]

Esta subtração representa a entalpia líquida que será transferida para o reservatório, já descontando a entalpia que o fluido já possui na temperatura do reservatório.

### Passo 5: Calcular Taxa Mássica (ṁ)

\[
\dot{m} = \frac{\text{rateBblPerDay} \times 350}{24} \quad [\text{lb/h}]
\]

Onde:
- **rateBblPerDay**: Vazão de injeção de vapor (bbl/d)
- **350**: Conversão de bbl para lb (1 bbl ≈ 350 lb de água)
- **24**: Conversão de dias para horas

### Passo 6: Calcular H₀

\[
H_0 = \dot{m} \times (H_s - h_{res}) \quad [\text{Btu/h}]
\]

**Exemplo completo (Serigado IV, 565 bbl/d)**:
1. H_L = [valor interpolado da tabela @ 315 psia]
2. H_v = [valor interpolado da tabela @ 315 psia]
3. H_s = (1 - 0.72) × H_L + 0.72 × H_v
4. h_res = 68.0 Btu/lb (tabela @ 100°F)
5. H_s - h_res = [valor calculado] - 68.0
6. ṁ = (565 × 350) / 24 = 8,229.17 lb/h
7. H₀ = 8,229.17 × (H_s - h_res) Btu/h

---

## 📊 Variáveis e Fontes de Dados

### Variáveis de Entrada (CommonData)

| Variável | Descrição | Unidade | Fonte | Exemplo Serigado IV |
|----------|-----------|---------|-------|---------------------|
| `Ps` | Pressão do vapor | psia | Usuário | 315 |
| `Ts` | Temperatura da zona de vapor | °F | Usuário | 500.0 |
| `Tr` | Temperatura inicial do reservatório | °F | Usuário | 100 |
| `fsd` | Qualidade do vapor no reservatório | - | Usuário | 0.72 |
| `zt` | Espessura total do reservatório | ft | Usuário | 86 |
| `zn` | Espessura líquida do reservatório | ft | Usuário | 66 (não usado no Item A) |
| `rho1C1` | Capacidade calorífica volumétrica zona vapor | Btu/ft³·°F | Usuário | 35 |
| `rho2C2` | Capacidade calorífica volumétrica camadas adjacentes | Btu/ft³·°F | Usuário | 33 |
| `K2` | Condutividade térmica camadas adjacentes | Btu/ft·h·°F | Usuário | 1.2 |
| `tYears` | Tempo de injeção | anos | Usuário | 2.5 |

### Variáveis de Entrada (SteamRateCase)

| Variável | Descrição | Unidade | Fonte | Exemplo Serigado IV |
|----------|-----------|---------|-------|---------------------|
| `rateBblPerDay` | Vazão de injeção de vapor | bbl/d | Usuário | 565 |

### Variáveis Calculadas

| Variável | Descrição | Unidade | Fórmula/Cálculo |
|----------|-----------|---------|-----------------|
| `HL_BtuPerLb` | Entalpia líquida @ P_s | Btu/lb | Tabela (interpolada se necessário) |
| `Hv_BtuPerLb` | Entalpia vapor @ P_s | Btu/lb | Tabela (interpolada se necessário) |
| `enthalpySteam_BtuPerLb` | Entalpia do vapor (H_s) | Btu/lb | (1 - fs) × HL + fs × Hv |
| `enthalpyReservoirFromTable_BtuPerLb` | Entalpia reservatório (h_res) | Btu/lb | Tabela @ T_r (interpolada se necessário) |
| `Ho_enthalpy_BtuPerLb` | Entalpia efetiva | Btu/lb | H_s - h_res |
| `massRate_lbPerHour` | Taxa mássica | lb/h | rateBblPerDay × 350 / 24 |
| `Ho_BtuPerHour` | Taxa de calor (H₀) | Btu/h | ṁ × (H_s - h_res) |
| `alpha2` | Difusividade térmica | ft²/h | K2 / rho2C2 |
| `deltaT` | Variação de temperatura | °F | Ts - Tr |
| `tDimensionless` | Tempo adimensional (t_d) | - | 4 × (M2/M1)² × (α2/h²) × t_h<br/>**Fórmula**: t_d = 4 × (M₂/M₁)² × (α₂/h²) × t<br/>**h**: Espessura total (z_t), não espessura líquida (z_n)<br/>**Interpretação**: Valores pequenos (< 0.1) indicam estágio inicial, valores grandes (> 10) indicam processo avançado |
| `thermalEfficiency` | Eficiência térmica (G(t_d)) | - | e^(td) × erfc(√td) + 2√(td/π) - 1 |
| `areaHeated_ft2` | Área aquecida (A_s) | ft² | (H₀ × M₁ × h) / (4 × α₂ × M₂² × ΔT) × G(t_d) |

---

## 🗂️ Tabela de Vapor Saturado

### Localização

**Arquivo**: `src/assets/tables/tabela_vapor_saturado.json`

### Estrutura

Cada entrada na tabela contém:

```json
{
  "temp_F": 100,
  "pressao_psia": 0.9492,
  "entalpia": {
    "hf": 68.0,      // Entalpia líquida saturada (H_L)
    "hfg": 1037.1,   // Entalpia de vaporização
    "hg": 1105.1     // Entalpia vapor saturada (H_v)
  }
}
```

### Funções de Busca

#### `getEnthalpyByPressure(psia: number)`

Busca entalpia por pressão (psia).

**Processo**:
1. Procura valor exato na tabela (tolerância: 0.0001 psia)
2. Se não encontrar, interpola linearmente entre valores adjacentes
3. Retorna: `{ hf, hfg, hg, interpolated: boolean }`

**Exemplo**:
```typescript
const result = getEnthalpyByPressure(315);
// Se 315 não existe exatamente, interpola entre valores próximos
// result.interpolated = true indica que houve interpolação
```

#### `getEnthalpyByTemperature(temp_F: number)`

Busca entalpia por temperatura (°F).

**Processo**:
1. Procura valor exato na tabela (tolerância: 0.001°F)
2. Se não encontrar, interpola linearmente entre valores adjacentes
3. Retorna: `{ hf, hfg, hg, interpolated: boolean }`

**Exemplo**:
```typescript
const result = getEnthalpyByTemperature(100);
// Como 100°F existe exatamente, result.interpolated = false
// result.hf = 68.0 Btu/lb
```

### Interpolação Linear

Quando um valor não existe exatamente na tabela, a interpolação é feita usando:

\[
\text{valor} = \text{valor}_{inferior} + \frac{x - x_{inferior}}{x_{superior} - x_{inferior}} \times (\text{valor}_{superior} - \text{valor}_{inferior})
\]

Onde:
- **x**: Valor procurado (pressão ou temperatura)
- **valor_inferior**: Valor da entrada imediatamente abaixo
- **valor_superior**: Valor da entrada imediatamente acima

---

## 💻 Implementação no Código

### Arquivo Principal

**Localização**: `src/lib/calculations/area.ts`

**Função Principal**: `calculateAreaHeated()`

### Fluxo de Cálculo

```typescript
// 1. Validação de campos obrigatórios
const requiredFieldsForItemA = {
  tYears, Ts, Tr, zt, rho1C1, Ps, fsd, K2, rho2C2
  // Nota: Usa-se zt (espessura total), não zn (espessura líquida)
};

// 2. Conversões de tempo
const tDays = common.tYears * 365.0;
const tHours = tDays * 24.0;
const deltaT = common.Ts - common.Tr;

// 3. Obter entalpias da tabela por pressão
const enthalpyByPressure = getEnthalpyByPressure(common.Ps);
const HL = enthalpyByPressure.hf;
const Hv = enthalpyByPressure.hg;

// 4. Calcular entalpia do vapor
const fs = common.fsd;
const enthalpySteam = calculateSteamEnthalpy(fs, HL, Hv);
// H_s = (1 - fs) × HL + fs × Hv

// 5. Obter entalpia do reservatório por temperatura
const enthalpyReservoirFromTable = getEnthalpyByTemperature(common.Tr);
const hres = enthalpyReservoirFromTable.hf;

// 6. Calcular entalpia efetiva e H₀
const Ho_enthalpy = enthalpySteam - hres;
const massRate_lbPerDay = rateBblPerDay * 350.0;
const massRate_lbPerHour = massRate_lbPerDay / 24.0;
const Ho_BtuPerHour = massRate_lbPerHour * Ho_enthalpy;

// 7. Calcular propriedades térmicas
const alpha2 = common.K2 / common.rho2C2;
const M1 = common.rho1C1;
const M2 = common.rho2C2;
// IMPORTANTE: Usar espessura total (zt) e não espessura líquida (zn)
const h = common.zt;

// 8. Calcular tempo adimensional e G(t_d)
const tDimensionless = calculateTDimensionless(common, alpha2, tHours);
const GTd = calculateGTd(tDimensionless);

// 9. Calcular área aquecida
const numerator = Ho_BtuPerHour * M1 * h;
const denominator = 4 * alpha2 * M2 * M2 * deltaT;
const areaHeated_ft2 = (numerator / denominator) * GTd;
```

### Funções Auxiliares

#### `calculateSteamEnthalpy(fs, HL, Hv)`

**Localização**: `src/data/tables/saturated-steam.ts`

```typescript
export function calculateSteamEnthalpy(
  fs: number,
  HL: number,
  Hv: number
): number {
  return (1 - fs) * HL + fs * Hv;
}
```

#### `calculateGTd(td)`

**Localização**: `src/lib/calculations/math-utils.ts`

Calcula a função G(t_d) usando a função erro complementar:

```typescript
export function calculateGTd(td: number): number {
  if (td <= 0) return 0;

  const sqrtTd = Math.sqrt(td);
  const expTd = Math.exp(td);
  const erfcSqrtTd = erfc(sqrtTd);
  const sqrtTdOverPi = 2 * sqrtTd / Math.sqrt(Math.PI);

  return expTd * erfcSqrtTd + sqrtTdOverPi - 1;
}
```

#### `calculateTDimensionless(common, alpha2, tHours)`

**Localização**: `src/lib/calculations/thermal-efficiency.ts`

**Implementação Completa:**

```typescript
export function calculateTDimensionless(
  common: CommonData,
  alpha2: number,
  tHours: number
): number {
  // M₁: Capacidade calorífica volumétrica da zona de vapor
  const M1 = common.rho1C1;

  // M₂: Capacidade calorífica volumétrica das camadas adjacentes
  const M2 = common.rho2C2;

  // h: Espessura total do reservatório (ft) = z_t
  // IMPORTANTE: Usa-se z_t (espessura total) e não z_n (espessura líquida)
  const h = common.zt;

  // h²: Espessura ao quadrado (para uso na fórmula)
  const hSquared = h * h;

  // Fórmula completa: t_d = 4 × (M₂/M₁)² × (α₂/h²) × t
  const tDimensionless = 4 * Math.pow(M2 / M1, 2) * (alpha2 / hSquared) * tHours;

  return tDimensionless;
}
```

**Passo a Passo do Cálculo:**

1. **Obter M₁ e M₂**: Valores diretos de `common.rho1C1` e `common.rho2C2`
2. **Obter h**: Valor de `common.zt` (espessura total), **não** `common.zn` (espessura líquida)
3. **Calcular h²**: `h * h`
4. **Calcular (M₂/M₁)²**: Razão elevada ao quadrado usando `Math.pow()`
5. **Calcular α₂/h²**: Razão entre difusividade térmica (já calculada) e h²
6. **Multiplicar por 4**: Constante de proporcionalidade
7. **Multiplicar por t**: Tempo em horas

**Nota**: A função recebe `alpha2` já calculado como parâmetro para evitar recálculo, pois este valor também é usado em outros cálculos.

---

## 📈 Exemplo Numérico Completo (Serigado IV)

### Dados de Entrada

```
P_s = 315 psia
T_s = 500°F
T_r = 100°F
f_s = 0.72
z_t = 86 ft (espessura total - usado no cálculo)
z_n = 66 ft (espessura líquida - não usado no Item A)
M₁ = 35 Btu/ft³·°F
M₂ = 33 Btu/ft³·°F
K₂ = 1.2 Btu/ft·h·°F
t_years = 2.5 anos
rateBblPerDay = 565 bbl/d
```

### Cálculo Passo a Passo

#### 1. Obter Entalpias da Tabela

**Por Pressão (P_s = 315 psia)**:
- Como 315 psia não existe exatamente, interpola entre valores próximos
- Resultado interpolado:
  - H_L ≈ [valor interpolado] Btu/lb
  - H_v ≈ [valor interpolado] Btu/lb

**Por Temperatura (T_r = 100°F)**:
- 100°F existe exatamente na tabela
- h_res = 68.0 Btu/lb (sem interpolação)

#### 2. Calcular H_s

```
H_s = (1 - 0.72) × H_L + 0.72 × H_v
H_s = 0.28 × H_L + 0.72 × H_v
```

#### 3. Calcular Entalpia Efetiva

```
H_s - h_res = H_s - 68.0 Btu/lb
```

#### 4. Calcular Taxa Mássica

```
ṁ = (565 × 350) / 24 = 8,229.17 lb/h
```

#### 5. Calcular H₀

```
H₀ = 8,229.17 × (H_s - 68.0) Btu/h
```

#### 6. Calcular Propriedades Térmicas

```
α₂ = K₂ / M₂ = 1.2 / 33 = 0.03636 ft²/h
ΔT = T_s - T_r = 500 - 100 = 400°F
```

#### 7. Calcular Tempo Adimensional (t_d)

**Dados necessários:**
- M₁ = 35 Btu/ft³·°F
- M₂ = 33 Btu/ft³·°F
- α₂ = 0.03636 ft²/h (calculado anteriormente)
- h = z_t = 86 ft (**espessura total**, não espessura líquida)
- t = 2.5 anos = 21,900 horas

**Cálculo passo a passo:**

1. **Calcular h²:**
   ```
   h² = 86² = 7,396 ft²
   ```

2. **Calcular razão M₂/M₁:**
   ```
   M₂/M₁ = 33/35 = 0.942857
   ```

3. **Elevar ao quadrado:**
   ```
   (M₂/M₁)² = 0.942857² = 0.888979
   ```

4. **Calcular razão α₂/h²:**
   ```
   α₂/h² = 0.03636 / 7,396 = 4.916 × 10⁻⁶ h⁻¹
   ```

5. **Aplicar fórmula completa:**
   ```
   t_d = 4 × (M₂/M₁)² × (α₂/h²) × t
   t_d = 4 × 0.888979 × 4.916 × 10⁻⁶ × 21,900
   t_d = 4 × 0.888979 × 0.1076
   t_d = 4 × 0.0957
   t_d = 0.383
   ```

**Resultado**: t_d = 0.383 (adimensional)

**Verificação**:
- Valor está dentro da faixa esperada (0.1 < t_d < 10)
- Indica processo em desenvolvimento com eficiência térmica moderada
- **Nota importante**: Usa-se z_t = 86 ft, não z_n = 66 ft

#### 8. Calcular G(t_d)

```
G(t_d) = e^(t_d) × erfc(√t_d) + 2√(t_d/π) - 1
```

#### 9. Calcular Área Aquecida

```
A_s = (H₀ × M₁ × h) / (4 × α₂ × M₂² × ΔT) × G(t_d)

A_s = (H₀ × 35 × 86) / (4 × 0.03636 × 33² × 400) × G(t_d)
A_s = (H₀ × 3,010) / (4 × 0.03636 × 1,089 × 400) × G(t_d)
A_s = (H₀ × 3,010) / 63,360 × G(t_d)
```

**Nota importante**: O valor de **h** na fórmula é a **espessura total (z_t = 86 ft)**, não a espessura líquida (z_n = 66 ft).

---

## ✅ Validação do Cálculo de t_d

### Verificação da Fórmula

A fórmula implementada foi verificada e corresponde exatamente à fórmula de referência:

**Fórmula de Referência:**
\[
t_d = 4 \times \left(\frac{M_2}{M_1}\right)^2 \times \frac{\alpha_2}{h^2} \times t
\]

**Implementação:**
```typescript
const tDimensionless = 4 * Math.pow(M2 / M1, 2) * (alpha2 / hSquared) * tHours;
```

**Mapeamento:**
- ✅ `M2` = `common.rho2C2` (M₂)
- ✅ `M1` = `common.rho1C1` (M₁)
- ✅ `alpha2` = `K2 / rho2C2` (α₂)
- ✅ `hSquared` = `h * h` onde `h = common.zt` (h = z_t - **espessura total**)
- ✅ `tHours` = `t` (tempo em horas)

**Importante**: O valor de **h** usado é a **espessura total (z_t)**, não a espessura líquida (z_n).

### Valores Esperados

Para o preset Serigado IV:
- **z_t** = 86 ft (espessura total)
- **z_n** = 66 ft (espessura líquida - não usada no Item A)
- **t_d esperado**: ~0.383 (adimensional) - usando z_t = 86 ft
- **Faixa válida**: 0.1 < t_d < 10 (para processos típicos)
- **Interpretação**: Processo em desenvolvimento, eficiência térmica moderada

### Verificação de Consistência

- ✅ Todas as variáveis têm unidades consistentes
- ✅ Resultado é adimensional (sem unidade)
- ✅ Fórmula corresponde à referência bibliográfica
- ✅ Usa espessura total (z_t) conforme especificado
- ✅ Cálculo é realizado uma vez e reaproveitado (Item C)

---

## ⚠️ Pontos de Atenção

### 1. Interpolação

- **Sempre verificar** se houve interpolação através do campo `interpolationUsed`
- Quando há interpolação, os valores são aproximados e podem ter pequenas diferenças
- Para valores exatos na tabela (ex: 100°F), não há interpolação

### 2. Unidades

- **Sempre usar unidades consistentes**:
  - Temperatura: °F
  - Pressão: psia
  - Entalpia: Btu/lb
  - Taxa mássica: lb/h
  - Taxa de calor: Btu/h
  - Área: ft²
  - Tempo: horas (para cálculos internos)
  - Espessura: ft (usar **z_t** - espessura total, não z_n)

### 2.1. Espessura Total vs Espessura Líquida

- **No Item A**: Usa-se **z_t** (espessura total = 86 ft) em:
  - Cálculo de t_d: `h = z_t`
  - Cálculo da área aquecida: `h = z_t` na fórmula `H₀ × M₁ × h`
- **z_n** (espessura líquida = 66 ft) não é usado no Item A
- Esta distinção é importante para resultados corretos

### 3. Validação de Entrada

- Todos os campos obrigatórios devem estar definidos
- Valores devem ser positivos onde aplicável
- Qualidade do vapor (fsd) deve estar entre 0 e 1

### 4. Precisão Numérica

- A função `erfc` usa aproximação polinomial
- Valores muito grandes de t_d podem causar problemas numéricos
- A função `calculateGTd` retorna 0 para t_d ≤ 0

### 5. Dependências

- O cálculo depende da eficiência térmica (Item C)
- A eficiência térmica é calculada via `calculateThermalEfficiency()`
- O tempo crítico (Item B) também é calculado, mas não é usado diretamente no Item A

---

## 🔍 Debugging e Validação

### Valores Esperados (Serigado IV, 565 bbl/d)

Para validar o cálculo, verificar:

1. **h_res**: Deve ser exatamente 68.0 Btu/lb (sem interpolação)
2. **H₀**: Deve ser positivo e razoável (ordem de grandeza: 10⁶-10⁷ Btu/h)
3. **t_d**: Deve ser positivo
4. **G(t_d)**: Deve estar entre 0 e 1 (geralmente 0.3-0.8)
5. **A_s**: Deve ser positiva e razoável (ordem de grandeza: 10⁴-10⁶ ft²)

### Logs Úteis

Para debug, adicionar logs nos pontos críticos:

```typescript
console.log('HL:', HL, 'Hv:', Hv, 'interpolated:', enthalpyByPressure.interpolated);
console.log('H_s:', enthalpySteam, 'h_res:', hres);
console.log('H₀:', Ho_BtuPerHour, 't_d:', tDimensionless, 'G(t_d):', GTd);
console.log('A_s:', areaHeated_ft2);
```

---

## 📚 Referências

1. **Marx & Lengenheim**: Modelo de balanço de energia para zona de vapor
2. **Myhill & Stegemeier**: Correlação de eficiência térmica G(t_d)
3. **Tabela de Vapor Saturado**: ASME Steam Tables ou equivalente
4. **Função Erro Complementar**: Implementação numérica padrão

---

## 🔄 Modificações Futuras

### Possíveis Melhorias

1. **Cache de valores da tabela**: Para evitar múltiplas buscas
2. **Interpolação mais sofisticada**: Spline em vez de linear
3. **Validação de limites**: Verificar se valores estão dentro dos limites da tabela
4. **Métricas de precisão**: Calcular e exibir incerteza devido à interpolação
5. **Exportação de cálculos**: Gerar relatório detalhado em PDF/Excel

### Pontos de Extensão

- **Linha 74-76** (`area.ts`): Modificar busca de entalpia por pressão
- **Linha 81-82** (`area.ts`): Modificar busca de entalpia por temperatura
- **Linha 79** (`area.ts`): Modificar fórmula de entalpia do vapor
- **Linha 95-96** (`area.ts`): Modificar cálculo de G(t_d) ou t_d
- **Linha 98-100** (`area.ts`): Modificar fórmula final de área aquecida

---

## 📝 Notas de Implementação

### Decisões de Design

1. **Separação de responsabilidades**:
   - `saturated-steam.ts`: Busca e interpolação na tabela
   - `area.ts`: Cálculo da área aquecida
   - `math-utils.ts`: Funções matemáticas (erfc, G(t_d))
   - `thermal-efficiency.ts`: Cálculo de eficiência térmica

2. **Tratamento de interpolação**:
   - Flag `interpolated` indica quando houve interpolação
   - Tolerâncias pequenas (0.0001 psia, 0.001°F) para detectar valores exatos
   - Interpolação linear simples e eficiente

3. **Estrutura de dados**:
   - `AreaCalculationResult` contém todos os valores intermediários
   - Facilita debugging e exibição detalhada
   - Permite validação passo a passo

### Compatibilidade

- **TypeScript**: Tipagem completa para segurança
- **React**: Componentes separados para exibição
- **Build**: Compila sem erros com TypeScript strict mode

---

**Última atualização**: 2024
**Versão**: 1.0
**Autor**: Sistema de Análise de Steamflood

