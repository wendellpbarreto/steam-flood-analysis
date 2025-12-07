# Materiais Necessários para Implementação Completa

## ✅ O Que Já Temos

1. **Tabela de Vapor Saturado** (`tabela_vapor_saturado.json`)
   - Range: 32°F a 80°F
   - Usada para calcular entalpia (mas precisamos de 500°F, então usamos valores fornecidos)

2. **Tabela FHV-TCD** (`table-fhv-tcd.json`)
   - Para cálculo de tempo crítico (Mandl & Volek)
   - Não é usada para eficiência térmica

3. **Fórmula Simplificada Implementada**
   - `A_s = (E_t * Q_tot) / (z_n * M_1 * ΔT)`
   - Código atualizado

## ❌ O Que Está Faltando

### 1. Tabela G(t_d) vs t_d (Myhill & Stegemeier) ⭐ CRÍTICO

**Necessário para**: Obter eficiência térmica `E_t` a partir do tempo adimensional `t_d`

**Formato esperado**:
```json
[
  { "t_d": 0.1, "G_td": 0.08 },
  { "t_d": 0.2, "G_td": 0.15 },
  { "t_d": 0.5, "G_td": 0.32 },
  { "t_d": 1.0, "G_td": 0.56 },
  { "t_d": 1.28, "G_td": 0.6689 },
  ...
]
```

**Valores de referência conhecidos**:
- Para `t_d ≈ 1.28`: `G(t_d) = 0.6689` (valor esperado para Serigado IV)
- Para `t_d = 0.650093` (calculado atual): `G(t_d) = 0.396729` (calculado, mas errado)

**Onde encontrar**:
- Gráfico de Myhill & Stegemeier
- Tabela de correlação G(t_d)
- Material do professor

### 2. Validação do Cálculo de t_d

**Fórmula atual**:
\[
t_d = 4 \left( \frac{M_2}{M_1} \right)^2 \frac{\alpha_2}{h^2} t
\]

**Valores calculados**:
- `t_d = 0.650093` (com tempo em horas)
- Para obter `G(t_d) = 0.6689`, precisamos `t_d ≈ 1.28`

**Possíveis problemas**:
- Unidades do tempo (horas vs dias vs segundos)
- Fator constante faltando
- Fórmula diferente do esperado

**Necessário**: Confirmar fórmula correta de `t_d` com o professor/material

## 📊 Status Atual

### Cálculo da Área Aquecida

**Fórmula**: `A_s = (E_t * Q_tot) / (z_n * M_1 * ΔT)` ✅

**Resultado atual**:
- Calculado: `67,863.34 ft²`
- Esperado: `98,047.42 ft²`
- Erro: `30.8%`

**Causa do erro**: `E_t` está calculando `0.396729` quando deveria ser `0.6689`

### Cálculo de E_t

**Método atual**: Usando função `G(t_d)` com `erfc()`
- `t_d` calculado: `0.650093`
- `G(t_d)` calculado: `0.396729`
- `G(t_d)` esperado: `0.6689`

**Método necessário**: Lookup em tabela G(t_d) vs t_d

## 🎯 Próximos Passos

1. **Receber tabela G(t_d) vs t_d** do usuário
2. **Implementar lookup com interpolação**
3. **Validar cálculo de t_d** (verificar se precisa ajuste)
4. **Testar com valores de referência**

## 📝 Formato Esperado da Tabela

Se você tiver a tabela em formato diferente, podemos adaptar. Formatos aceitos:

1. **JSON** (preferido):
```json
[
  { "t_d": 0.1, "G_td": 0.08 },
  { "t_d": 0.2, "G_td": 0.15 }
]
```

2. **CSV**:
```csv
t_d,G_td
0.1,0.08
0.2,0.15
```

3. **Imagem/PDF**: Podemos digitalizar se necessário

4. **Correlação matemática**: Se houver fórmula, podemos implementar

## 🔍 Informações Adicionais Úteis

Se você tiver:
- Gráfico de Myhill & Stegemeier
- Documentação sobre como calcular t_d
- Valores de referência de t_d para Serigado IV
- Qualquer material relacionado

Por favor, compartilhe para completarmos a implementação!

