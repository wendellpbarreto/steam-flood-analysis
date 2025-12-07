# Validação de Campos e Testes

## ✅ Sistema de Validação Implementado

### 1. Schemas Zod (`src/lib/validation/schemas.ts`)

Validação completa de tipos e valores:

- `commonDataSchema` - Valida todos os 24 campos do CommonData
- `steamRateCaseSchema` - Valida casos de vazão
- `presetDataSchema` - Valida estrutura completa do preset

**Validações aplicadas**:

- Números positivos onde aplicável
- Faixas válidas (0-1 para eficiências, saturações, etc.)
- Campos obrigatórios
- Tipos corretos

### 2. Mapeamento de Uso de Campos (`src/lib/validation/field-usage.ts`)

Documentação completa de quais campos são usados em cada cálculo:

#### ⚠️ Importante: Distinção entre Campos do Item A vs Modelo Completo

**Item A (Área Aquecida)** usa apenas:

- `thermalEfficiency` - Eficiência térmica Et
- `tYears` - Tempo de injeção
- `Ts` - Temperatura do vapor
- `Tr` - Temperatura do reservatório
- `zn` - Espessura líquida
- `rho1C1` - Capacidade calorífica zona vapor
- `CwTs` - Entalpia água a Ts
- `fsd` - Qualidade vapor reservatório
- `Lv` - Calor de vaporização
- `rateBblPerDay` - Vazão (do caso)

**Mas TODOS os campos do modelo são necessários** para a aplicação completa (itens A-H):

#### Campos Necessários para Outros Itens

- **Item E (Volume de Vapor)**: `rhoW`, `CwTr`
- **Item F (ROV)**: `So`, `Sor`, `phi`
- **Item G (ROV Equivalente)**: `Tb`, `Fsb`, `CwTb`
- **Item H (Balanço de Energia)**: `Eb`, `gammaO`
- **Área do padrão**: `fPVRef`
- **Item B**: `criticalTimeYears`

#### Campos Opcionais/Informativos

- `Ps` - Pressão do vapor (informativo)
- `K2` - Condutividade térmica (futuro)
- `rho2C2` - Capacidade calorífica camadas (futuro)
- `zt` - Espessura total (futuro)

### 3. Funções de Validação

#### `validateFieldsForCalculation()`

Valida campos para itens específicos (usado internamente nos cálculos):

```typescript
validateFieldsForCalculation(data: PresetData, items: ["A" | "B" | ...])
```

#### `validateAllModelFields()` ⭐ Principal

Valida que TODOS os campos do modelo completo estão presentes:

```typescript
validateAllModelFields(data: PresetData)
```

**Retorna**:

- `valid`: boolean - Se todos os campos do modelo estão presentes
- `missingFields`: string[] - Campos faltantes

**Uso**: Esta é a função usada na interface para garantir que a aplicação está completa.

### 4. Validação no Cálculo

A função `calculateAreaHeated`:

1. Valida apenas campos necessários para Item A antes de calcular
2. Lança erro se campos obrigatórios para Item A faltarem
3. Verifica valores undefined/null

**Importante**: O cálculo do Item A não precisa de todos os campos, mas a aplicação completa sim!

---

## 🧪 Testes Implementados

### Arquivo: `src/lib/calculations/area.test.ts`

#### Testes de Validação

1. **Teste de Campos Obrigatórios**

   - Verifica que todos os campos necessários para Item A estão presentes
   - Valida que preset Serigado IV tem todos os campos

2. **Teste de Cálculo**

   - Verifica cálculo correto da área aquecida
   - Valida cálculo de entalpia
   - Valida cálculo de calor total
   - Valida fórmula da área aquecida

3. **Teste de Campos Não Usados**

   - Identifica campos que não são necessários para Item A
   - Garante que campos futuros não são obrigatórios agora

4. **Teste de Campos Faltantes**
   - Detecta quando campos obrigatórios estão faltando
   - Retorna lista de campos faltantes

---

## 🎯 Uso na Interface

### Componente ValidationAlert

Exibe alerta visual na interface:

- **Verde**: Todos os campos do modelo completo estão presentes
- **Vermelho**: Campos faltantes listados

**Importante**: Valida TODOS os campos do modelo, não apenas os do Item A, pois são necessários para os cálculos futuros (itens B-H).

### Integração no App.tsx

```tsx
<ValidationAlert data={data} />
```

Mostra status de validação do modelo completo antes do formulário.

---

## 📋 Checklist de Campos

### Item A - Área Aquecida

- [x] `thermalEfficiency` - ✅ Usado
- [x] `tYears` - ✅ Usado
- [x] `Ts` - ✅ Usado
- [x] `Tr` - ✅ Usado
- [x] `zn` - ✅ Usado
- [x] `rho1C1` - ✅ Usado
- [x] `CwTs` - ✅ Usado
- [x] `fsd` - ✅ Usado
- [x] `Lv` - ✅ Usado
- [x] `rateBblPerDay` - ✅ Usado (do caso)

### Campos Não Usados em Item A (mas necessários para outros itens)

- [ ] `Eb` - Item H
- [ ] `Tb` - Item G
- [ ] `So` - Item F
- [ ] `Sor` - Item F
- [ ] `gammaO` - Item H
- [ ] `phi` - Item F
- [ ] `Fsb` - Item G
- [ ] `rhoW` - Item E
- [ ] `CwTr` - Item E
- [ ] `CwTb` - Item G
- [ ] `fPVRef` - Área do padrão

---

## 🚀 Como Executar Testes

```bash
# Executar testes
npm test

# Executar testes com UI
npm run test:ui

# Executar testes em modo watch
npm test -- --watch
```

---

## ✅ Garantias

1. **Item A valida apenas seus campos necessários** (para cálculo eficiente)
2. **Modelo completo valida TODOS os campos** (para aplicação completa)
3. **Erros claros quando campos faltam**
4. **Testes garantem que cálculos usam campos corretos**
5. **Documentação de uso de cada campo**
6. **Validação visual na interface do modelo completo**

## 📋 Resumo Importante

### Item A (Área Aquecida)

- ✅ Usa apenas 9 campos específicos
- ✅ Validação específica antes do cálculo
- ✅ Cálculo funciona independente de outros campos

### Modelo Completo (A-H)

- ✅ Requer TODOS os 24 campos do CommonData + 2 correlações
- ✅ Validação completa na interface
- ✅ Garante que aplicação está pronta para todos os cálculos futuros

### Por que validar todos os campos?

Mesmo que o Item A não use todos os campos, eles são necessários para:

- Itens futuros (B, C, D, E, F, G, H)
- Cálculos completos do modelo
- Consistência dos dados do Serigado IV

---

**Status**: ✅ Sistema de validação completo implementado
**Validação**: Modelo completo validado na interface, Item A validado no cálculo
