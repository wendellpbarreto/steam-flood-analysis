# Valores de Referência - Serigado IV

## 📋 Visão Geral

Este documento contém os **valores de referência informados pelo professor** para validação dos cálculos do campo Serigado IV. Estes valores devem ser usados como **teste de regressão** para garantir que os cálculos estão corretos.

> **Tolerância recomendada**: `|erro relativo| < 1e-3` (0.1%)

---

## 📊 Tabela-Resumo (Benchmark)

| Dado                                               | Unidade     | 565 bbl/d     | 755 bbl/d     |
|----------------------------------------------------|------------:|--------------:|--------------:|
| Área aquecida \(A_s\)                            | ft²         | 98047.4218    | 131019.1212   |
| Tempo crítico                                      | dias        | 427.63        | 427.63        |
| Tempo crítico                                      | horas       | 10263.23      | 10263.23      |
| Eficiência térmica \(E_t\) (Ehs)                 | –           | 0.6689        | 0.6689        |
| Energia perdida para camadas adjacentes \(Q_I\) | Btu         | 5.84e10       | 7.81e10       |
| Volume de vapor necessário \(V_1, V_2\)          | ft³         | 3.54e06       | 4.74e06       |
| Volume deslocado \(N_p\)                         | ft³         | 7.61e05       | 1.02e06       |
| Razão óleo/vapor \(F_{os}\)                      | –           | 0.215         | 0.215         |
| Razão óleo/vapor equivalente \(F_{ose}\)         | lb/Btu      | 0.24          | 0.24          |
| Balanço total de energia \(E_d\)                 | lb/Btu      | 3.868         | 3.868         |

---

## 🎯 Valores Esperados por Item

### Item A) Área Aquecida (\(A_s\))

**Caso 565 bbl/d:**
- Valor esperado: `98047.4218 ft²`
- Tolerância: `±0.1%` → `97949.4` a `98145.4 ft²`

**Caso 755 bbl/d:**
- Valor esperado: `131019.1212 ft²`
- Tolerância: `±0.1%` → `130888.1` a `131150.1 ft²`

### Item B) Tempo Crítico (\(t_c\))

**Ambos os casos (mesmo valor):**
- Valor esperado em dias: `427.63 dias`
- Valor esperado em horas: `10263.23 horas`
- Tolerância: `±0.1%` → `427.19` a `428.07 dias` ou `10253.0` a `10273.5 horas`

**Observação**: O tempo crítico é o mesmo para todos os casos de vazão, pois depende apenas das propriedades do reservatório e das camadas adjacentes.

### Item C) Eficiência Térmica (\(E_t\))

**Ambos os casos (mesmo valor):**
- Valor esperado: `0.6689`
- Tolerância: `±0.1%` → `0.6682` a `0.6696`

### Item D) Energia Perdida (\(Q_I\))

**Caso 565 bbl/d:**
- Valor esperado: `5.84e10 Btu` = `58400000000 Btu`
- Tolerância: `±0.1%` → `58341600000` a `58458400000 Btu`

**Caso 755 bbl/d:**
- Valor esperado: `7.81e10 Btu` = `78100000000 Btu`
- Tolerância: `±0.1%` → `78021900000` a `78178100000 Btu`

### Item E) Volume de Vapor Necessário (\(V_1\))

**Caso 565 bbl/d:**
- Valor esperado: `3.54e06 ft³` = `3540000 ft³`
- Tolerância: `±0.1%` → `3536460` a `3543540 ft³`

**Caso 755 bbl/d:**
- Valor esperado: `4.74e06 ft³` = `4740000 ft³`
- Tolerância: `±0.1%` → `4735260` a `4744740 ft³`

### Item F) Volume Deslocado (\(N_p\)) e Razão Óleo/Vapor (\(F_{os}\))

**Caso 565 bbl/d:**
- Volume deslocado esperado: `7.61e05 ft³` = `761000 ft³`
- ROV esperado: `0.215`
- Tolerância: `±0.1%`

**Caso 755 bbl/d:**
- Volume deslocado esperado: `1.02e06 ft³` = `1020000 ft³`
- ROV esperado: `0.215`
- Tolerância: `±0.1%`

### Item G) Razão Óleo/Vapor Equivalente (\(F_{ose}\))

**Ambos os casos (mesmo valor):**
- Valor esperado: `0.24 lb/Btu`
- Tolerância: `±0.1%` → `0.2398` a `0.2402 lb/Btu`

### Item H) Balanço Total de Energia (\(E_d\))

**Ambos os casos (mesmo valor):**
- Valor esperado: `3.868 lb/Btu`
- Tolerância: `±0.1%` → `3.8641` a `3.8719 lb/Btu`

---

## 🧪 Estrutura de Testes Esperada

### Objeto de Referência (TypeScript)

```typescript
interface SerigadoIVBenchmark {
  case565: {
    areaHeated_As_ft2: 98047.4218;
    criticalTime_days: 427.63;
    criticalTime_hours: 10263.23;
    thermalEfficiency: 0.6689;
    lostHeat_Btu: 5.84e10;
    steamVolumeRequired_V1_ft3: 3.54e6;
    oilProduced_Nps_ft3: 7.61e5;
    oilSteamRatio_Fos: 0.215;
    equivalentOilSteamRatio_Fose: 0.24;
    energyBalanceIndex: 3.868;
  };
  case755: {
    areaHeated_As_ft2: 131019.1212;
    criticalTime_days: 427.63;
    criticalTime_hours: 10263.23;
    thermalEfficiency: 0.6689;
    lostHeat_Btu: 7.81e10;
    steamVolumeRequired_V1_ft3: 4.74e6;
    oilProduced_Nps_ft3: 1.02e6;
    oilSteamRatio_Fos: 0.215;
    equivalentOilSteamRatio_Fose: 0.24;
    energyBalanceIndex: 3.868;
  };
}
```

---

## 📝 Notas Importantes

### Tolerância Numérica

- **Padrão**: `|erro relativo| < 1e-3` (0.1%)
- **Cálculo**: `|valor_calculado - valor_esperado| / |valor_esperado| < 1e-3`
- **Exceções**: Valores muito pequenos podem precisar de tolerância absoluta

### Conversões de Unidades

- **Tempo crítico**:
  - `1 ano = 365 dias`
  - `1 dia = 24 horas`
  - `1 hora = 3600 segundos`

- **Volume**:
  - `1 bbl = 5.615 ft³`
  - `1 ft³ = 0.1781 bbl`

### Valores Independentes de Vazão

Os seguintes valores são **os mesmos** para ambos os casos de vazão:
- Tempo crítico (dias e horas)
- Eficiência térmica
- Razão óleo/vapor equivalente
- Balanço total de energia

Isso ocorre porque estes valores dependem apenas das propriedades do reservatório, não da vazão de injeção.

---

## 🔍 Validação de Cálculos

### Checklist de Validação

- [ ] Item A: Área aquecida dentro da tolerância para ambos os casos
- [ ] Item B: Tempo crítico (dias e horas) dentro da tolerância
- [ ] Item C: Eficiência térmica dentro da tolerância
- [ ] Item D: Energia perdida dentro da tolerância para ambos os casos
- [ ] Item E: Volume de vapor necessário dentro da tolerância para ambos os casos
- [ ] Item F: Volume deslocado e ROV dentro da tolerância para ambos os casos
- [ ] Item G: ROV equivalente dentro da tolerância
- [ ] Item H: Balanço de energia dentro da tolerância

### Como Executar Validação

```bash
# Executar testes de benchmark
pnpm test serigado-iv-benchmark

# Executar todos os testes
pnpm test

# Executar testes com UI
pnpm run test:ui
```

---

## 📚 Referências

- Documentação técnica: `docs/referencia/serigadoiv_steamflood_model.md`
- Implementação de referência: `docs/referencia/output-example.js`
- Dados do problema: `docs/referencia/problem.md`

---

**Última atualização**: Valores de referência do professor para validação dos cálculos

