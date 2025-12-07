# Análise da Fórmula de t_d - Tempo Adimensional

## 🔍 Problema Identificado

**Fórmula do slide**:
\[
t_d = 4 \left( \frac{M_2}{M_1} \right)^2 \frac{\alpha_2}{h^2} t
\]

**Cálculo atual**:
- `t_d` calculado: `0.650093`
- `G(t_d)` calculado: `0.396729`
- `G(t_d)` esperado: `0.6689`

**Para obter `G(t_d) = 0.6689`**:
- Precisamos `t_d ≈ 1.28`
- Fator necessário: `1.968950` (aproximadamente `2`)

## 📊 Análise Detalhada

### Valores Calculados

```
M₂ / M₁ = 33 / 35 = 0.942857
(M₂ / M₁)² = 0.888980
α₂ = K₂ / M₂ = 1.2 / 33 = 0.036364 ft²/h
α₂ / h² = 0.036364 / 66² = 0.0000083479
t = 21900 horas (2.5 anos)

t_d = 4 * 0.888980 * 0.0000083479 * 21900
t_d = 0.650093
```

### Valores Necessários

Para `G(t_d) = 0.6689`, precisamos `t_d = 1.28`:

```
t necessário = 1.28 / (4 * 0.888980 * 0.0000083479)
t necessário = 43120 horas = 1796.67 dias = 4.92 anos
```

**Comparação**:
- Tempo real: `21900 horas` (2.5 anos)
- Tempo necessário: `43120 horas` (4.92 anos)
- Razão: `0.507885` (aproximadamente `0.5`)

## 🤔 Possíveis Causas

### 1. Fator Constante Faltando

O fator necessário é aproximadamente `2`. Possibilidades:
- Fórmula deveria ter fator `8` ao invés de `4`?
- Ou `t_d = 2 * 4 * (M₂/M₁)² * (α₂/h²) * t`?

### 2. Unidades do Tempo

Testamos:
- **Horas**: `t_d = 0.650093` ❌
- **Dias**: `t_d = 0.027087` ❌ (muito menor)
- **Segundos**: `t_d = 2340.33` ❌ (muito maior, resulta em NaN)

Horas parece estar correto, mas o valor está baixo.

### 3. Difusividade Térmica

Verificamos unidades:
- `K₂ = 1.2 Btu/ft·h·°F`
- `M₂ = 33 Btu/ft³·°F`
- `α₂ = K₂ / M₂ = 0.036364 ft²/h` ✓

Unidades estão corretas.

### 4. Fórmula Diferente

Possibilidade de que a fórmula do slide seja uma versão simplificada e a real tenha fatores adicionais.

## 📝 Verificações Necessárias

1. **Confirmar fórmula exata de t_d** com o professor/material
2. **Verificar se há fatores adicionais** na fórmula completa
3. **Confirmar unidades** de todas as variáveis
4. **Verificar se há conversão** de unidades em algum ponto

## 🎯 Próximos Passos

1. Aguardar confirmação da fórmula correta de `t_d`
2. Verificar se há material adicional sobre o cálculo
3. Se necessário, ajustar fórmula com fator correto
4. Validar com valores de referência

## 💡 Observação

A fórmula completa de Marx & Langenheim está implementada corretamente:
\[
A_s = \frac{H_0 \cdot M_1 \cdot h}{4 \alpha_2 M_2^2 (T_s - T_r)} \cdot G(t_d)
\]

O problema está apenas no cálculo de `t_d`, que resulta em `G(t_d)` menor que o esperado.

