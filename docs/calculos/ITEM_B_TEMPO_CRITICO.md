# Item B - Cálculo do Tempo Crítico (t_c)

## 📋 Visão Geral

O Item B calcula o **tempo crítico (t_c)** durante o processo de injeção contínua de vapor usando a correlação de **Mandl & Volek**. O tempo crítico representa o momento em que a zona de vapor atinge um estado crítico, sendo um parâmetro fundamental para determinar a eficiência e o comportamento do processo de steamflood.

---

## 🎯 Objetivo

Calcular o tempo crítico (em anos, dias e horas) que representa o momento crítico da expansão da zona de vapor, considerando:

- Propriedades térmicas do reservatório e camadas adjacentes
- Qualidade do vapor injetado (f_sd)
- Entalpia do vapor (H_s) - calculada no Item A
- Calor latente de vaporização (L_v)
- Espessura líquida do reservatório (z_n)
- Difusividade térmica das camadas adjacentes (α₂)
- Correlação de Mandl & Volek (tabela FHV-t_cD)

---

## 📐 Fundamentação Teórica

### Modelo de Mandl & Volek

O modelo de Mandl & Volek estabelece uma correlação entre o tempo crítico adimensional (t_cD) e o parâmetro FHV através da função G₁(t_cD):

\[
G_1(t_{cD}) = e^{t_{cD}} \times \text{erfc}(\sqrt{t_{cD}}) = 1 - \frac{f_{sd} \times L_v}{H_s}
\]

Onde:

- **G₁(t_cD)**: Função de Mandl & Volek
- **t_cD**: Tempo crítico adimensional
- **erfc**: Função erro complementar
- **f_sd**: Qualidade do vapor no reservatório (fração em peso, 0 a 1)
- **L_v**: Calor latente de vaporização (Btu/lb)
- **H_s**: Entalpia do vapor (Btu/lb) - calculada no Item A

### Função Erro Complementar (erfc)

A função erro complementar é definida como:

\[
\text{erfc}(x) = 1 - \text{erf}(x) = \frac{2}{\sqrt{\pi}} \int_x^{\infty} e^{-t^2} dt
\]

No código, é implementada usando uma aproximação polinomial de alta precisão.

### Parâmetro FHV

O parâmetro FHV (Fraction of Heated Volume) é calculado a partir de t_cD:

\[
\text{FHV} = \frac{\sqrt{t_{cD}}}{1 + \sqrt{t_{cD}}}
\]

Este parâmetro é usado para buscar o valor de t_cD na tabela de correlação de Mandl & Volek.

### Tempo Crítico

O tempo crítico físico é calculado a partir do tempo crítico adimensional:

\[
t_c = \frac{t_{cD} \times z_n^2}{\alpha_2}
\]

Onde:

- **t_c**: Tempo crítico (horas)
- **t_cD**: Tempo crítico adimensional (da tabela Mandl & Volek)
- **z_n**: Espessura líquida do reservatório (ft)
- **α₂**: Difusividade térmica das camadas adjacentes (ft²/h)

### Difusividade Térmica

A difusividade térmica é calculada como:

\[
\alpha_2 = \frac{K_2}{\rho_2 \times C_2}
\]

Onde:

- **K₂**: Condutividade térmica das camadas adjacentes (Btu/ft·h·°F)
- **ρ₂**: Densidade das camadas adjacentes (lb/ft³)
- **C₂**: Calor específico das camadas adjacentes (Btu/lb·°F)
- **ρ₂C₂**: Capacidade calorífica volumétrica (Btu/ft³·°F)

---

## 🔢 Cálculo Passo a Passo

### Passo 1: Calcular Difusividade Térmica (α₂)

**Entrada**: `K2`, `rho2C2` dos dados comuns

**Fórmula**:
\[
\alpha_2 = \frac{K_2}{\rho_2 C_2}
\]

**Exemplo (Serigado IV)**:
- K₂ = 1.2 Btu/ft·h·°F
- ρ₂C₂ = 33 Btu/ft³·°F
- α₂ = 1.2 / 33 = 0.03636 ft²/h

### Passo 2: Obter Entalpia do Vapor (H_s)

**Entrada**: `Ps`, `fsd` dos dados comuns

**Processo**:
1. Buscar na tabela `tabela_vapor_saturado.json` os valores de entalpia para a pressão P_s
2. Se P_s não existir exatamente na tabela, **interpolar** entre os valores maior e menor mais próximos
3. Extrair:
   - **H_L** = `entalpia.hf` (entalpia da fase líquida saturada)
   - **H_v** = `entalpia.hg` (entalpia da fase vapor saturada)
4. Calcular entalpia do vapor:
   \[
   H_s = (1 - f_{sd}) \times H_L + f_{sd} \times H_v
   \]

**Nota**: Este cálculo é idêntico ao realizado no Item A. O valor de H_s é reutilizado.

**Exemplo (Serigado IV)**:
- P_s = 315 psia (interpolado)
- f_sd = 0.72
- H_s = (1 - 0.72) × H_L + 0.72 × H_v

### Passo 3: Calcular G₁ (Lado Direito da Equação)

**Entrada**: `fsd`, `Lv`, `Hs` (calculado no passo anterior)

**Fórmula**:
\[
G_1 = 1 - \frac{f_{sd} \times L_v}{H_s}
\]

**Exemplo (Serigado IV)**:
- f_sd = 0.72
- L_v = 950 Btu/lb (exemplo)
- H_s = [valor calculado no passo anterior]
- G₁ = 1 - (0.72 × 950) / H_s

### Passo 4: Busca Numérica de t_cD

**Entrada**: `G1_value` (calculado no passo anterior)

**Processo**:
1. Usar método de **bissecção** (busca binária) para encontrar t_cD tal que:
   \[
   G_1(t_{cD}) = G_1^{\text{valor}}
   \]
2. Onde G₁(t_cD) é calculado como:
   \[
   G_1(t_{cD}) = e^{t_{cD}} \times \text{erfc}(\sqrt{t_{cD}})
   \]
3. **Limites da busca**:
   - Inferior: 0
   - Superior: 100
   - Tolerância: 1e-6
   - Máximo de iterações: 100

**Algoritmo de Bissecção**:
```
1. Definir lower = 0, upper = 100
2. Para cada iteração:
   a. t_cD = (lower + upper) / 2
   b. Calcular G₁(t_cD)
   c. Se |G₁(t_cD) - G₁_valor| < tolerância:
      Retornar t_cD
   d. Se G₁(t_cD) > G₁_valor:
      upper = t_cD
   e. Caso contrário:
      lower = t_cD
3. Retornar (lower + upper) / 2
```

**Exemplo (Serigado IV)**:
- G₁_valor = [valor calculado no passo anterior]
- Busca numérica encontra t_cD tal que G₁(t_cD) = G₁_valor
- Resultado: t_cD_calculado ≈ [valor encontrado]

### Passo 5: Calcular Parâmetro FHV

**Entrada**: `tcd_calculated` (encontrado no passo anterior)

**Fórmula**:
\[
\text{FHV} = \frac{\sqrt{t_{cD}}}{1 + \sqrt{t_{cD}}}
\]

**Exemplo (Serigado IV)**:
- t_cD_calculado = [valor do passo anterior]
- FHV = √t_cD / (1 + √t_cD)

### Passo 6: Buscar t_cD na Tabela Mandl & Volek

**Entrada**: `fhv` (calculado no passo anterior)

**Processo**:
1. Buscar na tabela `table-fhv-tcd.json` o valor de t_cD correspondente a FHV
2. Se FHV não existir exatamente na tabela, **interpolar** linearmente entre valores adjacentes
3. Retornar t_cD da tabela (que pode diferir ligeiramente do t_cD calculado)

**Exemplo (Serigado IV)**:
- FHV = [valor calculado no passo anterior]
- Busca na tabela: t_cD_from_table = [valor interpolado ou exato]

### Passo 7: Calcular Tempo Crítico Físico

**Entrada**: `tcd_from_table`, `zn`, `alpha2`

**Fórmula**:
\[
t_c = \frac{t_{cD} \times z_n^2}{\alpha_2}
\]

**Unidade**: O resultado está em **horas** (assumindo que α₂ está em ft²/h e z_n em ft).

**Conversões**:
- t_c (anos) = t_c (horas) / (365 × 24)
- t_c (dias) = t_c (horas) / 24

**Exemplo (Serigado IV)**:
- t_cD_from_table = [valor da tabela]
- z_n = 66 ft
- α₂ = 0.03636 ft²/h
- t_c = (t_cD × 66²) / 0.03636 horas
- t_c = (t_cD × 4356) / 0.03636 horas
- t_c (anos) = t_c (horas) / 8760
- t_c (dias) = t_c (horas) / 24

---

## 📊 Variáveis e Fontes de Dados

### Variáveis de Entrada (CommonData)

| Variável | Descrição | Unidade | Fonte | Exemplo Serigado IV |
|----------|-----------|---------|-------|---------------------|
| `Ps` | Pressão do vapor | psia | Usuário | 315 |
| `fsd` | Qualidade do vapor no reservatório | - | Usuário | 0.72 |
| `Lv` | Calor latente de vaporização | Btu/lb | Usuário | 950 |
| `zn` | Espessura líquida do reservatório | ft | Usuário | 66 |
| `K2` | Condutividade térmica camadas adjacentes | Btu/ft·h·°F | Usuário | 1.2 |
| `rho2C2` | Capacidade calorífica volumétrica camadas adjacentes | Btu/ft³·°F | Usuário | 33 |

### Variáveis Calculadas

| Variável | Descrição | Unidade | Fórmula/Cálculo |
|----------|-----------|---------|-----------------|
| `alpha2` | Difusividade térmica | ft²/h | K2 / rho2C2 |
| `HL_BtuPerLb` | Entalpia líquida @ P_s | Btu/lb | Tabela (interpolada se necessário) |
| `Hv_BtuPerLb` | Entalpia vapor @ P_s | Btu/lb | Tabela (interpolada se necessário) |
| `enthalpySteam_BtuPerLb` | Entalpia do vapor (H_s) | Btu/lb | (1 - fs) × HL + fs × Hv |
| `G1_value` | Valor de G₁ (lado direito) | - | 1 - (fsd × Lv) / Hs |
| `tcd_calculated` | Tempo crítico adimensional (calculado) | - | Busca numérica: G₁(t_cD) = G₁_valor |
| `fhv` | Parâmetro FHV | - | √t_cD / (1 + √t_cD) |
| `tcd_from_table` | Tempo crítico adimensional (da tabela) | - | Tabela Mandl & Volek (interpolado se necessário) |
| `criticalTime_hours` | Tempo crítico | horas | (t_cD × z_n²) / α₂ |
| `criticalTime_days` | Tempo crítico | dias | criticalTime_hours / 24 |
| `criticalTime_years` | Tempo crítico | anos | criticalTime_hours / 8760 |

---

## 🗂️ Tabela Mandl & Volek (FHV-t_cD)

### Localização

**Arquivo**: `src/assets/tables/table-fhv-tcd.json`

### Estrutura

Cada entrada na tabela contém:

```json
{
  "fhv": 0.5,
  "tcd": 0.5915
}
```

Onde:
- **fhv**: Parâmetro FHV (Fraction of Heated Volume)
- **tcd**: Tempo crítico adimensional (t_cD)

### Funções de Busca

#### `getTcdByFhv(fhv: number)`

Busca t_cD por FHV na tabela.

**Processo**:
1. Procura valor exato na tabela (tolerância: 0.0001)
2. Se não encontrar, interpola linearmente entre valores adjacentes
3. Retorna: `{ tcd: number, interpolated: boolean }`

**Exemplo**:
```typescript
const result = getTcdByFhv(0.5);
// Se 0.5 existe exatamente, result.interpolated = false
// Caso contrário, interpola entre valores próximos
```

#### `findEntryByFhv(fhv: number)`

Função auxiliar que encontra a entrada ou intervalo para interpolação.

**Retorna**:
- `{ value, interpolated, lowerBound, upperBound? }`
- Se `interpolated = true`, fornece `lowerBound` e `upperBound` para interpolação

### Interpolação Linear

Quando um valor não existe exatamente na tabela, a interpolação é feita usando:

\[
t_{cD} = t_{cD,\text{inferior}} + \frac{\text{FHV} - \text{FHV}_{\text{inferior}}}{\text{FHV}_{\text{superior}} - \text{FHV}_{\text{inferior}}} \times (t_{cD,\text{superior}} - t_{cD,\text{inferior}})
\]

Onde:
- **FHV**: Valor procurado
- **FHV_inferior**: Valor da entrada imediatamente abaixo
- **FHV_superior**: Valor da entrada imediatamente acima
- **t_cD_inferior**: t_cD correspondente ao FHV inferior
- **t_cD_superior**: t_cD correspondente ao FHV superior

### Valores Extremos

- Se FHV ≤ menor valor da tabela: retorna t_cD do menor valor (sem interpolação)
- Se FHV ≥ maior valor da tabela: retorna t_cD do maior valor (sem interpolação)

---

## 💻 Implementação no Código

### Arquivo Principal

**Localização**: `src/lib/calculations/critical-time.ts`

**Função Principal**: `calculateCriticalTime()`

### Fluxo de Cálculo

```typescript
// 1. Calcular difusividade térmica
const alpha2 = common.K2 / common.rho2C2;

// 2. Obter entalpia do vapor (mesmo processo do Item A)
const enthalpyByPressure = getEnthalpyByPressure(common.Ps);
const HL = enthalpyByPressure.hf;
const Hv = enthalpyByPressure.hg;
const fs = common.fsd;
const Hs = calculateSteamEnthalpy(fs, HL, Hv);

// 3. Calcular G₁ (lado direito da equação)
const G1_value = 1 - (fs * common.Lv) / Hs;

// 4. Busca numérica de t_cD
const tcd_calculated = findTcdByG1(G1_value);

// 5. Calcular parâmetro FHV
const fhv = calculateFhvFromTcd(tcd_calculated);

// 6. Buscar t_cD na tabela Mandl & Volek
const tcdResult = getTcdByFhv(fhv);
const tcd_from_table = tcdResult.tcd;

// 7. Calcular tempo crítico físico
const znSquared = common.zn * common.zn;
const tCriticalHours = (tcd_from_table * znSquared) / alpha2;
const tCriticalDays = tCriticalHours / 24.0;
const tCriticalYears = tCriticalDays / 365.0;
```

### Funções Auxiliares

#### `calculateG1(tcd: number)`

**Localização**: `src/lib/calculations/math-utils.ts`

Calcula a função G₁(t_cD) usando a função erro complementar:

```typescript
export function calculateG1(tcd: number): number {
  if (tcd <= 0) return 0;

  const sqrtTcd = Math.sqrt(tcd);
  const expTcd = Math.exp(tcd);
  const erfcSqrtTcd = erfc(sqrtTcd);

  return expTcd * erfcSqrtTcd;
}
```

#### `findTcdByG1(G1_value: number)`

**Localização**: `src/lib/calculations/critical-time.ts`

Busca numérica usando método de bissecção:

```typescript
function findTcdByG1(G1_value: number): number {
  if (G1_value <= 0) return 0;
  if (G1_value >= 1) return 100;

  let lower = 0;
  let upper = 100;
  const tolerance = 1e-6;
  const maxIterations = 100;

  for (let i = 0; i < maxIterations; i++) {
    const tcd = (lower + upper) / 2;
    const G1_calculated = calculateG1(tcd);
    const diff = G1_calculated - G1_value;

    if (Math.abs(diff) < tolerance) {
      return tcd;
    }

    if (diff > 0) {
      upper = tcd;
    } else {
      lower = tcd;
    }
  }

  return (lower + upper) / 2;
}
```

#### `calculateFhvFromTcd(tcd: number)`

**Localização**: `src/lib/calculations/critical-time.ts`

Calcula FHV a partir de t_cD:

```typescript
function calculateFhvFromTcd(tcd: number): number {
  const sqrtTcd = Math.sqrt(tcd);
  return sqrtTcd / (1 + sqrtTcd);
}
```

#### `getTcdByFhv(fhv: number)`

**Localização**: `src/data/tables/fhv-tcd.ts`

Busca t_cD na tabela Mandl & Volek:

```typescript
export function getTcdByFhv(fhv: number): {
  tcd: number;
  interpolated: boolean;
} {
  const result = findEntryByFhv(fhv);

  if (!result.interpolated || !result.upperBound) {
    return {
      tcd: result.lowerBound!.tcd,
      interpolated: false,
    };
  }

  const lower = result.lowerBound!;
  const upper = result.upperBound;
  const ratio = (fhv - lower.fhv) / (upper.fhv - lower.fhv);

  return {
    tcd: lower.tcd + ratio * (upper.tcd - lower.tcd),
    interpolated: true,
  };
}
```

---

## 📈 Exemplo Numérico Completo (Serigado IV)

### Dados de Entrada

```
P_s = 315 psia
f_sd = 0.72
L_v = 950 Btu/lb
z_n = 66 ft
K₂ = 1.2 Btu/ft·h·°F
ρ₂C₂ = 33 Btu/ft³·°F
```

### Cálculo Passo a Passo

#### 1. Calcular Difusividade Térmica

```
α₂ = K₂ / (ρ₂C₂) = 1.2 / 33 = 0.03636 ft²/h
```

#### 2. Obter Entalpia do Vapor

**Por Pressão (P_s = 315 psia)**:
- Como 315 psia não existe exatamente, interpola entre valores próximos
- Resultado interpolado:
  - H_L ≈ [valor interpolado] Btu/lb
  - H_v ≈ [valor interpolado] Btu/lb

**Calcular H_s**:
```
H_s = (1 - 0.72) × H_L + 0.72 × H_v
H_s = 0.28 × H_L + 0.72 × H_v
```

#### 3. Calcular G₁

```
G₁ = 1 - (f_sd × L_v) / H_s
G₁ = 1 - (0.72 × 950) / H_s
G₁ = 1 - 684 / H_s
```

#### 4. Busca Numérica de t_cD

```
Encontrar t_cD tal que:
G₁(t_cD) = e^(t_cD) × erfc(√t_cD) = G₁_valor

Usando bissecção:
- lower = 0
- upper = 100
- Tolerância = 1e-6

Após iterações, encontra:
t_cD_calculado ≈ [valor encontrado]
```

#### 5. Calcular Parâmetro FHV

```
FHV = √t_cD_calculado / (1 + √t_cD_calculado)
```

#### 6. Buscar t_cD na Tabela

```
Para FHV = [valor calculado]:
- Busca na tabela table-fhv-tcd.json
- Se não existe exatamente, interpola entre valores adjacentes
- Resultado: t_cD_from_table = [valor da tabela]
```

#### 7. Calcular Tempo Crítico Físico

```
t_c (horas) = (t_cD_from_table × z_n²) / α₂
t_c (horas) = (t_cD_from_table × 66²) / 0.03636
t_c (horas) = (t_cD_from_table × 4356) / 0.03636

t_c (dias) = t_c (horas) / 24
t_c (anos) = t_c (horas) / 8760
```

---

## ⚠️ Pontos de Atenção

### 1. Busca Numérica

- **Convergência**: A busca numérica pode não convergir se G₁_valor estiver fora do intervalo [0, 1]
- **Precisão**: Tolerância de 1e-6 pode não ser suficiente para casos extremos
- **Performance**: Máximo de 100 iterações pode ser atingido em casos raros
- **Valores extremos**:
  - Se G₁_valor ≤ 0, retorna t_cD = 0
  - Se G₁_valor ≥ 1, retorna t_cD = 100

### 2. Interpolação

- **Tabela FHV-t_cD**: Sempre verificar se houve interpolação através do campo `interpolationUsed`
- **Tabela de vapor saturado**: A interpolação de H_s segue o mesmo processo do Item A
- **Precisão**: Valores interpolados são aproximados e podem ter pequenas diferenças

### 3. Unidades

- **Sempre usar unidades consistentes**:
  - Temperatura: °F
  - Pressão: psia
  - Entalpia: Btu/lb
  - Difusividade: ft²/h
  - Espessura: ft
  - Tempo: horas (para cálculos internos), depois converter para dias/anos

### 4. Validação de Entrada

- Todos os campos obrigatórios devem estar definidos
- Valores devem ser positivos onde aplicável
- Qualidade do vapor (fsd) deve estar entre 0 e 1
- G₁_valor deve estar entre 0 e 1 (caso contrário, há problema nos dados)

### 5. Precisão Numérica

- A função `erfc` usa aproximação polinomial
- Valores muito grandes de t_cD podem causar problemas numéricos
- A função `calculateG1` retorna 0 para t_cD ≤ 0
- A busca numérica pode ter pequenas diferenças devido à tolerância

### 6. Dependências

- O cálculo depende da **entalpia do vapor (H_s)** calculada no Item A
- A tabela de vapor saturado é compartilhada com o Item A
- O resultado não depende diretamente do Item C (Eficiência Térmica)

### 7. Diferença entre t_cD Calculado e t_cD da Tabela

- **t_cD_calculado**: Resultado da busca numérica (resolve G₁(t_cD) = G₁_valor)
- **t_cD_from_table**: Valor obtido da tabela Mandl & Volek usando FHV
- **Uso**: O tempo crítico físico usa **t_cD_from_table**, não t_cD_calculado
- **Razão**: A tabela representa a correlação empírica validada de Mandl & Volek

---

## 🔍 Debugging e Validação

### Valores Esperados (Serigado IV)

Para validar o cálculo, verificar:

1. **α₂**: Deve ser positivo e razoável (ordem de grandeza: 0.01-0.1 ft²/h)
2. **H_s**: Deve ser positivo e maior que h_res (do Item A)
3. **G₁_valor**: Deve estar entre 0 e 1
4. **t_cD_calculado**: Deve estar entre 0 e 100
5. **FHV**: Deve estar entre 0 e 1
6. **t_cD_from_table**: Deve estar entre 0 e valores máximos da tabela
7. **t_c**: Deve ser positivo e razoável (ordem de grandeza: dias a anos)

### Logs Úteis

Para debug, adicionar logs nos pontos críticos:

```typescript
console.log('alpha2:', alpha2);
console.log('Hs:', Hs, 'HL:', HL, 'Hv:', Hv);
console.log('G1_value:', G1_value);
console.log('tcd_calculated:', tcd_calculated);
console.log('fhv:', fhv);
console.log('tcd_from_table:', tcd_from_table, 'interpolated:', interpolationUsed);
console.log('t_c (hours):', tCriticalHours, 't_c (days):', tCriticalDays);
```

### Validação de Consistência

- Verificar se t_cD_calculado e t_cD_from_table são próximos (diferença < 10%)
- Se a diferença for grande, pode indicar problema na busca numérica ou na tabela
- Verificar se FHV calculado está dentro dos limites da tabela (0.05 a ~0.99)

---

## 📚 Referências

1. **Mandl & Volek**: Correlação empírica para tempo crítico em processos de steamflood
2. **Função Erro Complementar**: Implementação numérica padrão (aproximação polinomial)
3. **Tabela FHV-t_cD**: Correlação de Mandl & Volek para tempo crítico adimensional
4. **Tabela de Vapor Saturado**: ASME Steam Tables ou equivalente (compartilhada com Item A)

---

## 🔄 Modificações Futuras

### Possíveis Melhorias

1. **Cache de valores**: Para evitar múltiplas buscas na tabela FHV-t_cD
2. **Interpolação mais sofisticada**: Spline em vez de linear para a tabela FHV-t_cD
3. **Validação de limites**: Verificar se FHV está dentro dos limites da tabela antes de buscar
4. **Métricas de precisão**: Calcular e exibir incerteza devido à interpolação e busca numérica
5. **Exportação de cálculos**: Gerar relatório detalhado em PDF/Excel
6. **Visualização gráfica**: Plotar função G₁(t_cD) e mostrar ponto de convergência

### Pontos de Extensão

- **Linha 22** (`critical-time.ts`): Modificar cálculo de α₂
- **Linha 24-28** (`critical-time.ts`): Modificar obtenção de H_s (reutiliza Item A)
- **Linha 30** (`critical-time.ts`): Modificar cálculo de G₁
- **Linha 32** (`critical-time.ts`): Modificar busca numérica de t_cD
- **Linha 34** (`critical-time.ts`): Modificar cálculo de FHV
- **Linha 35** (`critical-time.ts`): Modificar busca na tabela Mandl & Volek
- **Linha 39** (`critical-time.ts`): Modificar cálculo do tempo crítico físico

### Melhorias na Busca Numérica

- Implementar método de Newton-Raphson para convergência mais rápida
- Adicionar validação de convergência mais robusta
- Implementar fallback para casos de não convergência

---

## 📝 Notas de Implementação

### Decisões de Design

1. **Separação de responsabilidades**:
   - `critical-time.ts`: Cálculo do tempo crítico
   - `fhv-tcd.ts`: Busca e interpolação na tabela Mandl & Volek
   - `saturated-steam.ts`: Busca de entalpia (compartilhada com Item A)
   - `math-utils.ts`: Funções matemáticas (erfc, G₁)

2. **Reutilização de código**:
   - H_s é calculado usando as mesmas funções do Item A
   - Tabela de vapor saturado é compartilhada
   - Função `calculateSteamEnthalpy` é reutilizada

3. **Busca numérica**:
   - Método de bissecção escolhido por simplicidade e robustez
   - Tolerância de 1e-6 balanceia precisão e performance
   - Limites [0, 100] cobrem a faixa esperada de t_cD

4. **Uso de t_cD_from_table**:
   - O tempo crítico físico usa t_cD da tabela, não o calculado
   - Isso garante que a correlação empírica de Mandl & Volek seja respeitada
   - t_cD_calculado é usado apenas para calcular FHV

5. **Estrutura de dados**:
   - `CriticalTimeResult` contém todos os valores intermediários
   - Facilita debugging e exibição detalhada
   - Permite validação passo a passo

### Compatibilidade

- **TypeScript**: Tipagem completa para segurança
- **React**: Componentes separados para exibição (`CriticalTimeDetail.tsx`)
- **Build**: Compila sem erros com TypeScript strict mode

### Correções Realizadas

1. **Correção na tabela FHV-t_cD**:
   - Valor de t_cD para fhv=0.5 corrigido de 0.05915 para 0.5915
   - Identificado durante implementação do Item B

---

**Última atualização**: 2024
**Versão**: 1.0
**Autor**: Sistema de Análise de Steamflood

