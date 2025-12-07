# Checkpoint 1: Cálculo da Área Aquecida (Item A)

## 🎯 Objetivo

Implementar o cálculo do **Item A) Área Aquecida** como primeiro checkpoint do desenvolvimento.

## 📋 Pré-requisitos

- [x] Documentação organizada
- [x] Modelo técnico compreendido
- [ ] Estrutura do projeto Next.js criada
- [ ] Types TypeScript definidos
- [ ] Validação de inputs básica implementada

## 🔍 Análise do Item A

### Fórmula

\[
A_{s,i} = \frac{E_t \cdot Q_{tot,i}}{z_n \cdot M_1 \cdot \Delta T}
\]

### Dependências

**Entradas Diretas**:
- `Et` (thermalEfficiency) - Entrada do usuário
- `z_n` (zn) - Entrada do CommonData
- `M_1` (rho1C1) - Entrada do CommonData
- `ΔT` (deltaT) - Calculado de `Ts - Tr`

**Cálculos Intermediários**:
- `Q_{tot,i}` - Calor total injetado
  - Depende de: `rateBblPerDay`, `tHours`, `H_{s,r}`
- `H_{s,r}` - Entalpia no reservatório
  - Depende de: `CwTs`, `fsd`, `Lv`
- `tHours` - Tempo em horas
  - Depende de: `tYears`

### Fluxo de Cálculo

```
1. Preparação:
   tDays = tYears * 365.0
   tHours = tDays * 24.0
   deltaT = Ts - Tr

2. Entalpia no Reservatório:
   H_sr = CwTs + fsd * Lv

3. Para cada caso de vazão:
   a) Taxa mássica:
      mDot_lbPerDay = rateBblPerDay * 350.0
      mDot_lbPerHour = mDot_lbPerDay / 24.0

   b) Taxa de calor:
      QDot_BtuPerHour = mDot_lbPerHour * H_sr
      QTot_Btu = QDot_BtuPerHour * tHours

   c) Área aquecida:
      As_ft2 = (Et * QTot_Btu) / (zn * rho1C1 * deltaT)
```

## ✅ Critérios de Aceitação

### Funcionalidade

- [ ] Função `calcHeatedArea` implementada corretamente
- [ ] Função `calcSteamEnthalpy` implementada corretamente
- [ ] Função `calcTotalHeatInjected` implementada corretamente
- [ ] Todas as conversões de unidades corretas

### Validação

- [ ] Validação de inputs (valores positivos, faixas válidas)
- [ ] Validação de `Et` entre 0 e 1
- [ ] Validação de `Ts > Tr`
- [ ] Validação de `cases.length > 0`

### Testes

- [ ] Teste unitário com valores do Serigado IV
- [ ] Comparação com resultado do `output-example.js`
- [ ] Teste com múltiplas vazões
- [ ] Teste de validação de erros

### Resultado Esperado (Serigado IV - Valores de Referência)

**Valores de referência informados pelo professor** (ver `docs/VALORES_REFERENCIA_SERIGADO_IV.md`):

#### Caso 565 bbl/d:
- **Área aquecida (\(A_s\))**: `98047.4218 ft²` ⭐ VALOR ESPERADO
- **Tolerância**: `±0.1%` → `97949.4` a `98145.4 ft²`

#### Caso 755 bbl/d:
- **Área aquecida (\(A_s\))**: `131019.1212 ft²` ⭐ VALOR ESPERADO
- **Tolerância**: `±0.1%` → `130888.1` a `131150.1 ft²`

**Nota**: Estes são os valores exatos de referência para validação. O cálculo deve resultar nestes valores dentro da tolerância especificada.

**Cálculo intermediário esperado** (para referência):
```
tDays = 2.5 * 365 = 912.5 dias
tHours = 912.5 * 24 = 21900 horas
deltaT = 500 - 100 = 400°F
H_sr = 361.91 + 0.72 * 713.9 = 361.91 + 514.008 = 875.918 Btu/lb
mDot_lbPerDay = 565 * 350 = 197750 lb/d
mDot_lbPerHour = 197750 / 24 = 8247.92 lb/h
QDot_BtuPerHour = 8247.92 * 875.918 = 7225000 Btu/h (aprox)
QTot_Btu = 7225000 * 21900 = 158227500000 Btu (aprox)
E_t = 0.6689 (calculado via correlação Myhill & Stegemeier)
As_ft2 = (0.6689 * QTot_Btu) / (66 * 35 * 400)
As_ft2 = 98047.4218 ft² (valor esperado)
```

**⚠️ IMPORTANTE**: O valor atual calculado pode não estar batendo com o esperado. Verificar:
1. Cálculo da eficiência térmica (\(E_t\)) - deve ser `0.6689`, não `0.65`
2. Cálculo do calor total injetado (\(Q_{tot}\))
3. Aplicação correta da fórmula da área aquecida

## 📝 Implementação Sugerida

### Estrutura de Arquivos

```
src/lib/
├── types/
│   └── steam-analysis.ts      # Interfaces TypeScript
├── constants/
│   └── conversions.ts         # Constantes e conversões
├── calculations/
│   ├── enthalpy.ts            # calcSteamEnthalpy
│   ├── heat.ts                # calcTotalHeatInjected
│   └── area.ts                # calcHeatedArea
└── validation/
    └── schemas.ts              # Schemas Zod
```

### Código de Exemplo

```typescript
// src/lib/calculations/enthalpy.ts
export function calcSteamEnthalpy(
  CwT: number,
  f: number,
  Lv: number
): number {
  return CwT + f * Lv;
}

// src/lib/calculations/heat.ts
export function calcTotalHeatInjected(
  rateBblPerDay: number,
  tYears: number,
  enthalpyReservoir: number
): number {
  const tDays = tYears * 365.0;
  const tHours = tDays * 24.0;
  const massRate_lbPerDay = rateBblPerDay * 350.0;
  const massRate_lbPerHour = massRate_lbPerDay / 24.0;
  const heatRate_BtuPerHour = massRate_lbPerHour * enthalpyReservoir;
  return heatRate_BtuPerHour * tHours;
}

// src/lib/calculations/area.ts
export function calcHeatedArea(
  thermalEfficiency: number,
  totalHeat_Btu: number,
  zn: number,
  rho1C1: number,
  deltaT: number
): number {
  return (thermalEfficiency * totalHeat_Btu) / (zn * rho1C1 * deltaT);
}
```

## 🚀 Próximos Passos Após Checkpoint 1

1. **Checkpoint 2**: Energia Armazenada e Perdida (itens C e D)
2. **Checkpoint 3**: Volume de Vapor Necessário (item E)
3. **Checkpoint 4**: ROV e ROV Equivalente (itens F e G)
4. **Checkpoint 5**: Balanço de Energia (item H)

## 📊 Validação com Exemplo de Referência

Após implementação, comparar resultados com `referencia/output-example.js` executando:

```javascript
const input = {
  common: { /* valores do Serigado IV */ },
  thermalEfficiency: 0.65,
  criticalTimeYears: 1.8,
  cases: [
    { name: "Vazão 1 (565 bbl/d)", rateBblPerDay: 565 }
  ]
};

const output = computeSteamInjectionAnalysis(input);
console.log('Área aquecida:', output.cases[0].areaHeated_As_ft2);
```

---

**Status**: Aguardando início da implementação
**Prioridade**: Alta - Base para todos os cálculos subsequentes

