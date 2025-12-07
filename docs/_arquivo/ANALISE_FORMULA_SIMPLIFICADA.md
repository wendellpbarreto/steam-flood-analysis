# Análise - Fórmula Simplificada para Área Aquecida

## 📋 Fórmula Simplificada

\[
A_s = \frac{E_t \cdot Q_{tot}}{z_n \cdot M_1 \cdot \Delta T}
\]

## 🔍 Componentes Necessários

### 1. Eficiência Térmica (E_t)

**Valor esperado**: `0.6689`

**Como obter**:
- Via correlação Myhill & Stegemeier: `E_t = G(t_d)`
- Requer cálculo de `t_d` (tempo adimensional)
- Requer tabela/correlação `G(t_d)` vs `t_d`

**Status**: ⚠️ **FALTA TABELA/CORRELAÇÃO**

### 2. Calor Total Injetado (Q_tot)

**Cálculo**:
\[
Q_{tot} = \dot{m} \cdot H_{s,r} \cdot t_h
\]

Onde:
- `ṁ` = taxa mássica (lb/h) = `rateBblPerDay * 350 / 24`
- `H_{s,r}` = entalpia no reservatório (Btu/lb)
- `t_h` = tempo em horas = `tYears * 365 * 24`

**Status**: ✅ **IMPLEMENTADO** (usando valores fornecidos ou tabela de vapor saturado)

### 3. Parâmetros do Reservatório

- `z_n` = espessura líquida (ft) ✅
- `M_1 = ρ_1 C_1` = capacidade calorífica zona vapor (Btu/ft³·°F) ✅
- `ΔT = T_s - T_r` = variação de temperatura (°F) ✅

**Status**: ✅ **TODOS DISPONÍVEIS**

## 📊 Tabelas Disponíveis

### ✅ Tabelas Existentes

1. **`table-fhv-tcd.json`**
   - Para cálculo de tempo crítico (Mandl & Volek)
   - Não é usada para E_t

2. **`tabela_vapor_saturado.json`**
   - Para cálculo de entalpia do vapor
   - Range: 32°F a 80°F
   - ⚠️ Não cobre 500°F (precisa usar valores fornecidos)

### ❌ Tabelas Faltantes

1. **Tabela G(t_d) vs t_d (Myhill & Stegemeier)**
   - Necessária para obter E_t a partir de t_d
   - Formato esperado: `[{ t_d: number, G_td: number }]`

## 🔢 Cálculo de t_d Necessário

Para usar a tabela G(t_d), precisamos calcular `t_d` corretamente:

\[
t_d = 4 \left( \frac{M_2}{M_1} \right)^2 \frac{\alpha_2}{h^2} t
\]

Onde:
- `M_2 = ρ_2 C_2` = capacidade calorífica camadas adjacentes
- `M_1 = ρ_1 C_1` = capacidade calorífica zona vapor
- `α_2 = K_2 / M_2` = difusividade térmica
- `h = z_n` = espessura líquida
- `t` = tempo em horas

**Status**: ⚠️ **FÓRMULA IMPLEMENTADA, MAS PRECISA VALIDAÇÃO**

## 📝 Checklist de Implementação

- [x] Fórmula simplificada identificada
- [x] Cálculo de Q_tot implementado
- [x] Parâmetros do reservatório disponíveis
- [ ] **Tabela G(t_d) vs t_d** ← **FALTA**
- [ ] Cálculo de t_d validado
- [ ] Lookup de E_t a partir de t_d
- [ ] Cálculo final de A_s

## 🚨 O Que Precisamos do Usuário

1. **Tabela G(t_d) vs t_d** (Myhill & Stegemeier)
   - Formato JSON preferido
   - Ou imagem/PDF da tabela para digitalização
   - Ou correlação matemática se disponível

2. **Validação do cálculo de t_d**
   - Confirmar se a fórmula está correta
   - Verificar unidades (horas vs dias vs segundos)

3. **Valores de referência para validação**
   - t_d esperado para Serigado IV
   - E_t esperado (já temos: 0.6689)

