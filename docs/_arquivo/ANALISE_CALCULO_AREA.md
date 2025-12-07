# Análise do Cálculo da Área Aquecida (Item A)

## 📋 Modo Planejador - Análise Técnica

### ✅ Verificação do Caminho Teórico

#### Caminho Esperado (conforme slides/PDF):

1. **Marx & Langenheim** - Balanço de energia:
   \[
   Q_{armazenado} = A_s \cdot z_n \cdot M_1 \cdot \Delta T
   \]

2. **Myhill & Stegemeier** - Eficiência térmica:
   \[
   E_t = \frac{Q_{armazenado}}{Q_{tot}} = G(t_d)
   \]

3. **Rearranjando** para obter área aquecida:
   \[
   A_s = \frac{E_t \cdot Q_{tot}}{z_n \cdot M_1 \cdot \Delta T}
   \]

#### ✅ Verificação da Implementação Atual

**Código em `src/lib/calculations/area.ts` (linha 61-62)**:
```typescript
const areaHeated_ft2 =
  (thermalEfficiency * totalHeat_Btu) / (common.zn * common.rho1C1 * deltaT);
```

**Análise**:
- ✅ **Fórmula correta**: `A_s = (E_t × Q_tot) / (z_n × M_1 × ΔT)`
- ✅ **E_t é calculado**: Via `calculateThermalEfficiency(common)` antes do cálculo
- ✅ **Q_tot é calculado**: `Q_tot = ṁ × H_sr × t_h`
- ✅ **z_n, M_1, ΔT**: Todos vêm dos dados comuns

### ⚠️ Pontos de Atenção

#### 1. Cálculo de E_t (Eficiência Térmica)

**Status**: ✅ Caminho correto, mas implementação é STUB

**Código atual** (`src/lib/calculations/thermal-efficiency.ts`):
- Calcula `t_dimensionless` corretamente
- Usa `lookupMyhillStegemeier(tDimensionless)`
- **PROBLEMA**: A função `lookupMyhillStegemeier` é uma aproximação linear por log, não usa tabela/gráfico real

**Fórmula de t_dimensionless**:
```typescript
const tDimensionless = (alpha2 * tDays * 24 * 3600) / znSquared;
```
onde:
- `alpha2 = K2 / rho2C2` (difusividade térmica)
- `znSquared = zn * zn`

**Necessário verificar**:
- Se a fórmula de `t_dimensionless` está correta conforme slides
- Se há tabela/gráfico de `G(t_d)` disponível para lookup real
- Se a aproximação atual está próxima dos valores esperados

#### 2. Fluxo de Cálculo

**Ordem atual**:
1. ✅ Calcula `thermalEfficiency` primeiro (via `calculateThermalEfficiency`)
2. ✅ Calcula `Q_tot` (calor total injetado)
3. ✅ Aplica fórmula: `A_s = (E_t × Q_tot) / (z_n × M_1 × ΔT)`

**Conclusão**: ✅ O fluxo está correto e segue o caminho esperado.

### 📊 Estrutura de Cálculos Intermediários

#### Cálculos que devem aparecer nos "Cálculos Intermediários":

1. **Difusividade Térmica** (α₂):
   - `alpha2 = K2 / rho2C2`
   - Usado para calcular `t_dimensionless`

2. **Tempo Adimensional** (t_d):
   - `t_d = (alpha2 × t_h) / zn²`
   - Usado para lookup de `G(t_d)`

3. **Eficiência Térmica** (E_t):
   - `E_t = G(t_d)` (via lookup Myhill & Stegemeier)
   - Usado no cálculo de `A_s`

4. **Calor Armazenado** (Q_armazenado):
   - `Q_armazenado = E_t × Q_tot`
   - Pode ser calculado para mostrar o balanço de energia

### 🔍 Próximos Passos

1. **Validar fórmula de t_dimensionless**:
   - Verificar se `t_d = (alpha2 × t_h) / zn²` está correta
   - Verificar unidades (segundos vs horas)

2. **Implementar lookup real de G(t_d)**:
   - Verificar se há tabela disponível
   - Ou implementar correlação matemática se disponível

3. **Adicionar Q_armazenado aos cálculos intermediários**:
   - Mostrar o balanço: `Q_armazenado = E_t × Q_tot`
   - Conectar com Marx & Langenheim: `Q_armazenado = A_s × z_n × M_1 × ΔT`

4. **Melhorar apresentação**:
   - Mostrar claramente o caminho: Marx & Langenheim → Myhill & Stegemeier → A_s
   - Destacar que E_t vem de G(t_d), não é entrada direta

---

## ✅ Conclusão

**O cálculo está seguindo o caminho correto** conforme descrito nos slides:
- ✅ Usa balanço de energia de Marx & Langenheim
- ✅ Usa eficiência térmica de Myhill & Stegemeier (E_t = G(t_d))
- ✅ Fórmula final correta: `A_s = (E_t × Q_tot) / (z_n × M_1 × ΔT)`

**Melhorias necessárias**:
- ⚠️ Implementar lookup real de G(t_d) ao invés de aproximação
- ⚠️ Validar fórmula de t_dimensionless
- ⚠️ Adicionar Q_armazenado aos cálculos intermediários para mostrar o balanço completo

