# Análise de Inconsistências e Correções

Este documento lista as inconsistências encontradas na documentação e propõe correções.

---

## 1. Inconsistências Identificadas

### 1.1. `problem.md` - Variáveis de Espessura

**Problema**: Linhas 15-16 do arquivo `problem.md`:

```
Espessura líquida do reservatório, zt = 66 ft
Espessura total do reservatório, zt = 86 ft
```

**Análise**:
- Ambas as variáveis usam o mesmo nome `zt`
- Deveria ser `zn` para espessura líquida e `zt` para espessura total
- O código de referência (`output-example.js`) usa corretamente:
  - `zn: 66` (espessura líquida)
  - `zt: 86` (espessura total)

**Correção Proposta**:
```
Espessura líquida do reservatório, zn = 66 ft
Espessura total do reservatório, zt = 86 ft
```

**Impacto**:
- Alto - Afeta cálculos de área aquecida e volume de vapor
- A espessura líquida (`zn`) é usada para cálculo de área aquecida
- A espessura total (`zt`) é usada para cálculo de volume de vapor necessário

---

### 1.2. Tabela de Vapor Saturado - Cobertura de Temperatura

**Problema**:
- A tabela `tabela_vapor_saturado.json` cobre apenas 32°F a 80°F
- O problema requer temperatura de vapor `Ts = 500°F`
- Valores de entalpia `CwTs = 361.91 Btu/lb` não podem ser obtidos diretamente da tabela

**Análise**:
- Os valores `CwTs`, `CwTr`, `CwTb` já estão fornecidos no problema
- A tabela pode não ser necessária para o MVP se os valores já estão disponíveis
- Para Fase 2, pode ser necessário:
  - Expandir a tabela para cobrir até 500°F
  - Implementar interpolação/extrapolação
  - Usar biblioteca termodinâmica externa

**Correção Proposta**:
- **MVP**: Usar valores fornecidos diretamente no input
- **Fase 2**:
  - Verificar se há tabela completa disponível
  - Implementar lookup/interpolação se necessário
  - Considerar usar biblioteca termodinâmica (ex: CoolProp, REFPROP)

**Impacto**:
- Baixo para MVP (valores já fornecidos)
- Médio para Fase 2 (necessário para cálculo automático de propriedades)

---

### 1.3. Valores de Correlação - Et e tc

**Problema**:
- `thermalEfficiency` e `criticalTimeYears` são marcados como "obtidos de gráficos"
- Não há processo claro de como obtê-los
- O exemplo usa valores arbitrários (0.65 e 1.8)

**Análise**:
- Existe tabela `table-fhv-tcd.json` que pode ser usada para `tc`
- Não há tabela explícita para `Et = G(td)`
- Necessário documentar processo de obtenção

**Correção Proposta**:
1. **Documentar processo de obtenção**:
   - Para `Et`: Explicar como ler gráfico Myhill & Stegemeier
   - Para `tc`: Documentar uso da tabela `table-fhv-tcd.json`

2. **MVP**:
   - Permitir entrada manual dos valores
   - Validar faixas razoáveis (Et: 0-1, tc: positivo)

3. **Fase 2**:
   - Implementar lookup/interpolação da tabela `table-fhv-tcd.json` para `tc`
   - Considerar implementar correlação para `Et` se disponível

**Impacto**:
- Médio - Afeta usabilidade mas não impede MVP
- Alto para Fase 2 - Necessário para automação completa

---

### 1.4. Unidades e Precisão

**Problema**:
- Mistura de unidades (alguns valores em °F, outros em °C implícito)
- Precisão inconsistente (alguns com 1 decimal, outros com 2)
- Conversões não documentadas

**Análise**:
- O modelo usa unidades inglesas consistentemente
- Precisão deve seguir padrão científico (3-4 dígitos significativos)

**Correção Proposta**:
- Documentar claramente todas as unidades
- Padronizar precisão de entrada (2-3 decimais)
- Validar unidades no input do usuário

**Impacto**:
- Baixo - Mais uma questão de UX/documentação

---

### 1.5. Correlação de Energia do Óleo

**Problema**:
- Equação \(h_o = 13{,}1 + 5600 \cdot \gamma_o\) marcada como "assumida"
- Não há referência à origem da correlação
- Pode não ser específica para óleo do Serigado IV

**Análise**:
- Correlação tipo Zaba mencionada no código
- Necessário verificar se é adequada para o caso específico

**Correção Proposta**:
- Documentar origem da correlação
- Permitir override do valor no MVP
- Na Fase 2, permitir seleção de diferentes correlações

**Impacto**:
- Médio - Afeta precisão do balanço de energia
- Pode ser ajustado sem impacto estrutural

---

## 2. Correções Aplicadas

### 2.1. Documentação Consolidada

✅ Criado `docs/PROJETO.md` com visão geral consolidada
✅ Criado `docs/MODELO_TECNICO.md` com detalhamento técnico
✅ Documentação organizada e estruturada

### 2.2. Estrutura de Dados

✅ Tipos TypeScript definidos claramente
✅ Validações documentadas
✅ Fluxo de cálculo detalhado

---

## 3. Próximas Ações Recomendadas

### Prioridade Alta

1. **Validar dados do problema**:
   - Confirmar valores de `zn` e `zt` com fonte original
   - Verificar se `CwTs`, `CwTr`, `CwTb` estão corretos para as temperaturas

2. **Clarificar obtenção de Et e tc**:
   - Documentar processo de leitura de gráficos
   - Verificar se há correlações implementáveis

### Prioridade Média

3. **Expandir tabela termodinâmica**:
   - Verificar se há tabela completa disponível
   - Planejar implementação de lookup/interpolação

4. **Validar correlação de energia do óleo**:
   - Confirmar adequação para Serigado IV
   - Documentar alternativas se disponíveis

### Prioridade Baixa

5. **Padronizar unidades e precisão**:
   - Criar guia de estilo para inputs
   - Implementar validação de unidades

---

## 4. Checklist de Validação

Antes de iniciar desenvolvimento do MVP:

- [ ] Confirmar valores de `zn` e `zt` corretos
- [ ] Validar valores de entalpia (`CwTs`, `CwTr`, `CwTb`)
- [ ] Obter valores reais de `Et` e `tc` para o caso Serigado IV
- [ ] Verificar se correlação de energia do óleo é adequada
- [ ] Documentar processo de obtenção de valores de correlação
- [ ] Definir faixas de validação para todos os inputs
- [ ] Planejar tratamento de erros e casos extremos

---

## 5. Notas para Desenvolvimento

### MVP

- Focar em funcionalidade básica: input → cálculo → output
- Validações simples (valores positivos, faixas razoáveis)
- Usar valores fornecidos diretamente (sem lookup de tabelas)

### Fase 2

- Implementar lookup/interpolação de tabelas
- Adicionar validações avançadas
- Permitir múltiplas correlações/configurações
- Implementar histórico e comparações

