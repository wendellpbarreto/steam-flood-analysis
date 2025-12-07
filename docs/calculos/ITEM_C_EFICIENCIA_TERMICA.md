# Item C - Cálculo da Eficiência Térmica (E_t)

## 📋 Visão Geral

O Item C calcula a **eficiência térmica (E_t)** durante o processo de injeção contínua de vapor usando a correlação de **Myhill & Stegemeier**. A eficiência térmica representa a fração do calor total injetado que é efetivamente armazenado na zona de vapor, em relação ao calor perdido para as camadas adjacentes.

---

## 🎯 Objetivo

Calcular a eficiência térmica (adimensional, entre 0 e 1) que representa a eficácia do processo de injeção de vapor em armazenar calor na zona de vapor, considerando:

- Tempo de injeção (t_years)
- Propriedades térmicas do reservatório e camadas adjacentes
- Difusividade térmica das camadas adjacentes
- Espessura líquida do reservatório
- Correlação de Myhill & Stegemeier (função G(t_d))

---

## 📐 Fundamentação Teórica

### Modelo de Myhill & Stegemeier

O modelo de Myhill & Stegemeier estabelece uma correlação entre a eficiência térmica e o tempo adimensional através da função G(t_d):

\[
E_t = \frac{G(t_d)}{t_d}
\]

Onde G(t_d) é calculado como:

\[
G(t_d) = e^{t_d} \times \text{erfc}(\sqrt{t_d}) + 2\sqrt{\frac{t_d}{\pi}} - 1
\]

Onde:

- **E_t**: Eficiência térmica (adimensional, 0 a 1)
- **t_d**: Tempo adimensional
- **erfc**: Função erro complementar

### Interpretação Física

A eficiência térmica relaciona o calor armazenado com o calor total injetado:

\[
E_t = \frac{Q_{\text{armazenado}}}{Q_{\text{total}}}
\]

Onde:

- **Q_armazenado**: Calor efetivamente armazenado na zona de vapor (Btu)
- **Q_total**: Calor total injetado durante o período de injeção (Btu)

### Função Erro Complementar (erfc)

A função erro complementar é definida como:

\[
\text{erfc}(x) = 1 - \text{erf}(x) = \frac{2}{\sqrt{\pi}} \int_x^{\infty} e^{-t^2} dt
\]

No código, é implementada usando uma aproximação polinomial de alta precisão.

### Tempo Adimensional (t_d)

O tempo adimensional relaciona o tempo de injeção com as propriedades térmicas do reservatório e camadas adjacentes:

\[
t_d = 4 \times \left(\frac{M_2}{M_1}\right)^2 \times \frac{\alpha_2}{h^2} \times t
\]

Onde:

- **M₁**: Capacidade calorífica volumétrica da zona de vapor (Btu/ft³·°F) = ρ₁C₁
- **M₂**: Capacidade calorífica volumétrica das camadas adjacentes (Btu/ft³·°F) = ρ₂C₂
- **α₂**: Difusividade térmica das camadas adjacentes (ft²/h)
- **h**: Espessura líquida do reservatório (ft) = z_n
- **t**: Tempo total de injeção (horas)

### Difusividade Térmica

A difusividade térmica é calculada como:

\[
\alpha_2 = \frac{K_2}{\rho_2 \times C_2} = \frac{K_2}{M_2}
\]

Onde:

- **K₂**: Condutividade térmica das camadas adjacentes (Btu/ft·h·°F)
- **ρ₂**: Densidade das camadas adjacentes (lb/ft³)
- **C₂**: Calor específico das camadas adjacentes (Btu/lb·°F)
- **M₂**: Capacidade calorífica volumétrica (Btu/ft³·°F) = ρ₂C₂

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

### Passo 2: Converter Tempo de Injeção

**Entrada**: `tYears` dos dados comuns

**Conversões**:
\[
t_{\text{dias}} = t_{\text{anos}} \times 365
\]

\[
t_{\text{horas}} = t_{\text{dias}} \times 24 = t_{\text{anos}} \times 365 \times 24
\]

**Exemplo (Serigado IV)**:
- t_years = 2.5 anos
- t_days = 2.5 × 365 = 912.5 dias
- t_hours = 912.5 × 24 = 21,900 horas

### Passo 3: Calcular Tempo Adimensional (t_d)

**Entrada**: `rho1C1`, `rho2C2`, `zn`, `alpha2` (calculado no passo 1), `tHours` (calculado no passo 2)

**Fórmula**:
\[
t_d = 4 \times \left(\frac{M_2}{M_1}\right)^2 \times \frac{\alpha_2}{h^2} \times t
\]

Onde:
- M₁ = ρ₁C₁
- M₂ = ρ₂C₂
- h = z_n

**Exemplo (Serigado IV)**:
- M₁ = 35 Btu/ft³·°F
- M₂ = 33 Btu/ft³·°F
- h = 66 ft
- α₂ = 0.03636 ft²/h
- t = 21,900 horas

\[
t_d = 4 \times \left(\frac{33}{35}\right)^2 \times \frac{0.03636}{66^2} \times 21,900
\]

\[
t_d = 4 \times 0.8898 \times \frac{0.03636}{4,356} \times 21,900
\]

\[
t_d = 4 \times 0.8898 \times 8.347 \times 10^{-6} \times 21,900
\]

\[
t_d \approx [valor calculado]
\]

### Passo 4: Calcular Função G(t_d)

**Entrada**: `tDimensionless` (calculado no passo 3)

**Fórmula**:
\[
G(t_d) = e^{t_d} \times \text{erfc}(\sqrt{t_d}) + 2\sqrt{\frac{t_d}{\pi}} - 1
\]

**Processo**:
1. Calcular √t_d
2. Calcular erfc(√t_d) usando aproximação polinomial
3. Calcular e^(t_d)
4. Calcular 2√(t_d/π)
5. Combinar os termos: e^(t_d) × erfc(√t_d) + 2√(t_d/π) - 1

**Exemplo (Serigado IV)**:
- t_d = [valor calculado no passo anterior]
- √t_d = [valor calculado]
- erfc(√t_d) = [valor calculado via função erfc]
- e^(t_d) = [valor calculado]
- 2√(t_d/π) = [valor calculado]
- G(t_d) = e^(t_d) × erfc(√t_d) + 2√(t_d/π) - 1

### Passo 5: Eficiência Térmica Final

**Entrada**: `GTd` (calculado no passo anterior ou reaproveitado do Item A), `tDimensionless`

**Fórmula**:
\[
E_t = \frac{G(t_d)}{t_d}
\]

**Exemplo (Serigado IV)**:
- G(t_d) = [valor calculado ou reaproveitado]
- t_d = [valor do passo 3]
- E_t = G(t_d) / t_d

---

## 📊 Variáveis e Fontes de Dados

### Variáveis de Entrada (CommonData)

| Variável | Descrição | Unidade | Fonte | Exemplo Serigado IV |
|----------|-----------|---------|-------|---------------------|
| `tYears` | Tempo de injeção | anos | Usuário | 2.5 |
| `K2` | Condutividade térmica camadas adjacentes | Btu/ft·h·°F | Usuário | 1.2 |
| `rho1C1` | Capacidade calorífica volumétrica zona vapor | Btu/ft³·°F | Usuário | 35 |
| `rho2C2` | Capacidade calorífica volumétrica camadas adjacentes | Btu/ft³·°F | Usuário | 33 |
| `zn` | Espessura líquida do reservatório | ft | Usuário | 66 |

### Variáveis Calculadas

| Variável | Descrição | Unidade | Fórmula/Cálculo |
|----------|-----------|---------|-----------------|
| `alpha2` | Difusividade térmica | ft²/h | K2 / rho2C2 |
| `tDays` | Tempo de injeção | dias | tYears × 365 |
| `tHours` | Tempo de injeção | horas | tDays × 24 |
| `tDimensionless` | Tempo adimensional (t_d) | - | 4 × (M2/M1)² × (α2/h²) × t |
| `GTd` | Função G(t_d) | - | e^(td) × erfc(√td) + 2√(td/π) - 1 (reaproveitado do Item A) |
| `thermalEfficiency` | Eficiência térmica (E_t) | - | G(t_d) / t_d |

---

## 💻 Implementação no Código

### Arquivo Principal

**Localização**: `src/lib/calculations/thermal-efficiency.ts`

**Função Principal**: `calculateThermalEfficiency()`

### Fluxo de Cálculo

```typescript
// No Item A, G(t_d) já é calculado:
const tDimensionless = calculateTDimensionless(common, alpha2, tHours);
const GTd = calculateGTd(tDimensionless);

// No Item C, reaproveitamos G(t_d) e calculamos E_t:
// E_t = G(t_d) / t_d
const thermalEfficiency = GTd / tDimensionless;

// Ou usando a função calculateThermalEfficiency com valores já calculados:
const thermalEfficiencyResult = calculateThermalEfficiency(common, GTd, tDimensionless);
```

### Funções Auxiliares

#### `calculateTDimensionless(common, alpha2, tHours)`

**Localização**: `src/lib/calculations/thermal-efficiency.ts`

Calcula o tempo adimensional:

```typescript
export function calculateTDimensionless(
  common: CommonData,
  alpha2: number,
  tHours: number
): number {
  const M1 = common.rho1C1;
  const M2 = common.rho2C2;
  const h = common.zn;
  const hSquared = h * h;

  const tDimensionless = 4 * Math.pow(M2 / M1, 2) * (alpha2 / hSquared) * tHours;

  return tDimensionless;
}
```

#### `calculateGTd(td)`

**Localização**: `src/lib/calculations/math-utils.ts`

Calcula a função G(t_d) usando a função erro complementar:

```typescript
export function calculateGTd(td: number): number {
  if (td <= 0) {
    return 0;
  }

  const sqrtTd = Math.sqrt(td);
  const expTd = Math.exp(td);
  const erfcSqrtTd = erfc(sqrtTd);
  const sqrtTdOverPi = (2 * sqrtTd) / Math.sqrt(Math.PI);

  const result = expTd * erfcSqrtTd + sqrtTdOverPi - 1;

  return result;
}
```

#### `erfc(x)`

**Localização**: `src/lib/calculations/math-utils.ts`

Calcula a função erro complementar usando aproximação polinomial:

```typescript
export function erfc(x: number): number {
  if (x < 0) {
    return 2 - erfc(-x);
  }

  if (x === 0) {
    return 1;
  }

  if (x > 26) {
    return 0;
  }

  // Coeficientes da aproximação polinomial
  const a1 = -1.26551223;
  const a2 = 1.00002368;
  const a3 = 0.37409196;
  const a4 = 0.09678418;
  const a5 = -0.18628806;
  const a6 = 0.27886807;
  const a7 = -1.13520398;
  const a8 = 1.48851587;
  const a9 = -0.82215223;
  const a10 = 0.17087277;

  const t = 1 / (1 + 0.5 * Math.abs(x));
  const tau = t * Math.exp(
    -x * x +
      a1 +
      t * (a2 + t * (a3 + t * (a4 + t * (a5 + t * (a6 + t * (a7 + t * (a8 + t * (a9 + t * a10))))))))
  );

  if (x >= 0) {
    return tau;
  } else {
    return 2 - tau;
  }
}
```

---

## 📈 Exemplo Numérico Completo (Serigado IV)

### Dados de Entrada

```
t_years = 2.5 anos
K₂ = 1.2 Btu/ft·h·°F
M₁ = 35 Btu/ft³·°F
M₂ = 33 Btu/ft³·°F
z_n = 66 ft
```

### Cálculo Passo a Passo

#### 1. Calcular Difusividade Térmica

```
α₂ = K₂ / M₂ = 1.2 / 33 = 0.03636 ft²/h
```

#### 2. Converter Tempo de Injeção

```
t_dias = 2.5 × 365 = 912.5 dias
t_horas = 912.5 × 24 = 21,900 horas
```

#### 3. Calcular Tempo Adimensional

```
t_d = 4 × (M₂/M₁)² × (α₂/h²) × t

t_d = 4 × (33/35)² × (0.03636/66²) × 21,900

t_d = 4 × 0.8898 × (0.03636/4,356) × 21,900

t_d = 4 × 0.8898 × 8.347 × 10⁻⁶ × 21,900

t_d ≈ 0.651
```

#### 4. Calcular Função G(t_d)

**Nota**: Este valor é reaproveitado do Item A, onde já foi calculado.

```
√t_d = √0.651 ≈ 0.807

erfc(√t_d) = erfc(0.807) ≈ 0.240

e^(t_d) = e^0.651 ≈ 1.917

2√(t_d/π) = 2 × √(0.651/π) ≈ 2 × 0.455 ≈ 0.910

G(t_d) = e^(t_d) × erfc(√t_d) + 2√(t_d/π) - 1

G(t_d) = 1.917 × 0.240 + 0.910 - 1

G(t_d) = 0.460 + 0.910 - 1

G(t_d) = 0.370
```

#### 5. Eficiência Térmica Final

```
E_t = G(t_d) / t_d = 0.370 / 0.651 ≈ 0.568 (56.8%)
```

**Interpretação**: 56.8% do calor total injetado é efetivamente armazenado na zona de vapor, enquanto 43.2% é perdido para as camadas adjacentes.

---

## ⚠️ Pontos de Atenção

### 1. Precisão Numérica

- A função `erfc` usa aproximação polinomial de alta precisão
- Valores muito grandes de t_d podem causar problemas numéricos (overflow)
- A função `calculateGTd` retorna 0 para t_d ≤ 0
- Para t_d > 26, erfc retorna 0 (limite da aproximação)

### 2. Unidades

- **Sempre usar unidades consistentes**:
  - Tempo: horas (para cálculos internos), depois converter para dias/anos
  - Difusividade: ft²/h
  - Espessura: ft
  - Capacidade calorífica volumétrica: Btu/ft³·°F
  - Condutividade térmica: Btu/ft·h·°F

### 3. Validação de Entrada

- Todos os campos obrigatórios devem estar definidos
- Valores devem ser positivos onde aplicável
- Tempo de injeção deve ser positivo
- Espessura líquida deve ser positiva

### 4. Limites da Função

- **E_t** sempre está entre 0 e 1 (0% a 100%)
- Para t_d muito pequeno: E_t ≈ 0 (muito calor perdido)
- Para t_d muito grande: E_t → 1 (maior eficiência)
- A função G(t_d) é monotonicamente crescente com t_d

### 5. Dependências e Reaproveitamento

- **Reaproveita G(t_d) do Item A**: O valor de G(t_d) já é calculado no Item A para uso na fórmula da área aquecida. No Item C, esse valor é reaproveitado para evitar recálculo desnecessário.
- **Reaproveita t_d do Item A**: O tempo adimensional também é o mesmo usado no Item A.
- Não depende de tabelas externas
- Não requer interpolação
- É um cálculo puramente analítico

### 6. Relação com Outros Itens

- **Item A**:
  - Calcula G(t_d) que é usado na fórmula da área aquecida
  - Reaproveita G(t_d) para calcular E_t = G(t_d) / t_d
  - Usa E_t para calcular calor armazenado
- **Item D**: Usa E_t para calcular energia perdida (1 - E_t)
- **Item E**: Usa Q_armazenado = E_t × Q_total

---

## 🔍 Debugging e Validação

### Valores Esperados (Serigado IV)

Para validar o cálculo, verificar:

1. **α₂**: Deve ser positivo e razoável (ordem de grandeza: 0.01-0.1 ft²/h)
2. **t_d**: Deve ser positivo (geralmente entre 0.1 e 10)
3. **E_t**: Deve estar entre 0 e 1 (geralmente entre 0.2 e 0.8)
4. **Consistência**: E_t deve aumentar com o tempo de injeção

### Logs Úteis

Para debug, adicionar logs nos pontos críticos:

```typescript
console.log('alpha2:', alpha2);
console.log('tHours:', tHours);
console.log('tDimensionless:', tDimensionless);
console.log('thermalEfficiency:', thermalEfficiency);
console.log('storedHeat:', thermalEfficiency * totalHeat_Btu);
```

### Validação de Consistência

- Verificar se E_t aumenta quando t_years aumenta
- Verificar se E_t diminui quando α₂ aumenta (mais perdas)
- Verificar se E_t diminui quando h diminui (menor espessura)

---

## 📚 Referências

1. **Myhill & Stegemeier**: Correlação de eficiência térmica G(t_d) para processos de steamflood
2. **Função Erro Complementar**: Implementação numérica padrão (aproximação polinomial)
3. **Marx & Lengenheim**: Modelo de balanço de energia (relacionado ao Item A)

---

## 🔄 Modificações Futuras

### Possíveis Melhorias

1. **Validação de limites**: Verificar se t_d está dentro de limites razoáveis
2. **Métricas de precisão**: Calcular e exibir incerteza devido à aproximação numérica
3. **Exportação de cálculos**: Gerar relatório detalhado em PDF/Excel
4. **Visualização gráfica**: Plotar função G(t_d) e mostrar ponto calculado
5. **Análise de sensibilidade**: Mostrar como E_t varia com diferentes parâmetros

### Pontos de Extensão

- **Linha 12-13** (`thermal-efficiency.ts`): Modificar conversões de tempo
- **Linha 14** (`thermal-efficiency.ts`): Modificar cálculo de α₂
- **Linha 16** (`thermal-efficiency.ts`): Modificar cálculo de t_d
- **Linha 17** (`thermal-efficiency.ts`): Modificar cálculo de E_t (usar outra correlação)
- **Linha 36** (`thermal-efficiency.ts`): Modificar fórmula de t_d

### Melhorias na Função erfc

- Implementar versão mais precisa para valores muito grandes
- Adicionar validação de limites antes do cálculo
- Implementar cache para valores calculados frequentemente

---

## 📝 Notas de Implementação

### Decisões de Design

1. **Separação de responsabilidades**:
   - `thermal-efficiency.ts`: Cálculo da eficiência térmica
   - `math-utils.ts`: Funções matemáticas (erfc, G(t_d))
   - `calculateTDimensionless`: Função auxiliar reutilizável

2. **Reutilização de código**:
   - `calculateTDimensionless` é usado tanto no Item A quanto no Item C
   - `calculateGTd` é usado no Item A e Item C
   - `erfc` é usado em múltiplos cálculos

3. **Estrutura de dados**:
   - `ThermalEfficiencyResult` contém valores intermediários
   - Facilita debugging e exibição detalhada
   - Permite validação passo a passo

4. **Cálculo analítico**:
   - Não requer tabelas externas
   - Não requer interpolação
   - Cálculo direto e rápido

### Compatibilidade

- **TypeScript**: Tipagem completa para segurança
- **React**: Componentes separados para exibição (`ThermalEfficiencyDetail.tsx`)
- **Build**: Compila sem erros com TypeScript strict mode

### Relação com Item A

- **Item A calcula G(t_d)** primeiro para usar na fórmula da área aquecida
- **Item C reaproveita G(t_d)** do Item A para calcular E_t = G(t_d) / t_d
- Ambos usam o mesmo t_d (tempo adimensional)
- Evita recálculo desnecessário de G(t_d)
- A eficiência térmica é calculada após G(t_d) estar disponível

---

**Última atualização**: 2024
**Versão**: 1.0
**Autor**: Sistema de Análise de Steamflood

