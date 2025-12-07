# Planejamento de Desenvolvimento - Modo Planejador

## 📋 Análise do Estado Atual

### Documentação Organizada

✅ **Documentos Principais**:
- `README.md` - Visão geral e índice
- `PROJETO.md` - Visão consolidada do projeto
- `MODELO_TECNICO.md` - Detalhamento técnico completo
- `INDICE.md` - Navegação e referências rápidas
- `INCONSISTENCIAS.md` - Problemas identificados e correções

✅ **Documentos de Referência**:
- `serigadoiv_steamflood_model.md` - Documentação técnica original
- `problem.md` - Dados do problema Serigado IV
- `output-example.js` - Implementação JavaScript de referência

✅ **Recursos de Dados**:
- `presets/serigado-iv.json` - Preset com valores do Serigado IV
- `tabela-valor-saturado/tabela_vapor_saturado.json` - Tabela F.3 (32°F a 80°F)
- `table-fhv-tcd.json` - Correlação fhv vs tcd (tempo crítico)

---

## 🔍 Análise de Dependências dos Cálculos

### Fluxo de Dependências

```
INPUTS (CommonData + Et + tc + Cases)
    ↓
[1] Preparação: Tempos, ΔT, Entalpias
    ↓
[2] Caso Referência: Área do Padrão (A_pattern)
    ↓
[3] Para cada caso de vazão:
    ├─ [3.1] Massa e Calor
    ├─ [3.2] Fração de Poro Injetado
    ├─ [3.3] ÁREA AQUECIDA (A) ← CHECKPOINT 1
    ├─ [3.4] Energia Armazenada/Perdida
    ├─ [3.5] Volume de Vapor (V1) ← depende de A
    ├─ [3.6] Volume de Óleo (Nps) ← depende de A
    ├─ [3.7] ROV (Fos) ← depende de V1 e Nps
    ├─ [3.8] ROV Equivalente (Fose) ← depende de Fos
    └─ [3.9] Balanço de Energia ← depende de Nps
```

### Dependências do Item A) Área Aquecida

**Fórmula:**
\[
A_{s,i} = \frac{E_t \cdot Q_{tot,i}}{z_n \cdot M_1 \cdot \Delta T}
\]

**Dependências Diretas**:
- ✅ `Et` (thermalEfficiency) - **ENTRADA** (obtida de gráfico)
- ✅ `Q_{tot,i}` - Calculado a partir de:
  - `rateBblPerDay` (entrada)
  - `tHours` (calculado de `tYears`)
  - `H_{s,r}` (calculado de `CwTs`, `fsd`, `Lv`)
- ✅ `z_n` (zn) - **ENTRADA**
- ✅ `M_1` (rho1C1) - **ENTRADA**
- ✅ `ΔT` (deltaT) - Calculado de `Ts - Tr` (ambos entradas)

**Conclusão**: ✅ **SIM, podemos calcular o item A) Área Aquecida como primeiro checkpoint!**

Todas as dependências são entradas diretas ou cálculos simples que não dependem de outros itens.

---

## ❓ Perguntas em Aberto

### 1. Validação de Dados de Entrada

**Pergunta**: Os valores de `CwTs`, `CwTr`, `CwTb` fornecidos no problema (361.91, 77.94, 38.00 Btu/lb) estão corretos para as temperaturas Ts=500°F, Tr=100°F, Tb=70°F?

**Impacto**: Alto - Afeta cálculo de entalpias e todos os cálculos subsequentes

**Ação Necessária**:
- [ ] Validar se a tabela de vapor saturado pode ser usada para verificar/calcular esses valores
- [ ] Verificar se há necessidade de interpolação/extrapolação (tabela cobre apenas 32-80°F)
- [ ] Confirmar origem desses valores (tabela termodinâmica específica?)

**Decisão MVP**: Usar valores fornecidos diretamente. Para Fase 2, implementar lookup/interpolação.

---

### 2. Valores de Correlação (Et e tc)

**Pergunta**: Como obter `thermalEfficiency` (Et) e `criticalTimeYears` (tc) de forma automática ou semi-automática?

**Situação Atual**:
- `Et` deve ser obtido do gráfico `G(t_d)` (Myhill & Stegemeier)
- `tc` deve ser obtido de Mandl & Volek
- Existe tabela `table-fhv-tcd.json` mas não está claro como relacionar com `tc`

**Ações Necessárias**:
- [ ] Documentar processo de obtenção de `Et` do gráfico `G(t_d)`
- [ ] Verificar se `table-fhv-tcd.json` pode ser usada para calcular `tc`
- [ ] Definir se MVP aceita entrada manual ou precisa de lookup/interpolação

**Decisão MVP**: Aceitar entrada manual. Para Fase 2, implementar lookup/interpolação.

---

### 3. Tabela de Vapor Saturado - Cobertura

**Pergunta**: A tabela `tabela_vapor_saturado.json` cobre apenas 32°F a 80°F. Como lidar com Ts=500°F?

**Impacto**: Médio - Valores já fornecidos no problema, mas necessário para Fase 2

**Ações Necessárias**:
- [ ] Verificar se há tabela expandida disponível
- [ ] Considerar biblioteca termodinâmica (CoolProp, REFPROP) para Fase 2
- [ ] Documentar limitação atual

**Decisão MVP**: Usar valores fornecidos diretamente. Tabela não é necessária para MVP.

---

### 4. Estrutura de Dados - Validação

**Pergunta**: Quais validações são críticas antes de executar cálculos?

**Validações Necessárias**:
- [ ] Todos os campos obrigatórios presentes
- [ ] Valores numéricos válidos (positivos onde aplicável)
- [ ] `So > Sor` (saturação inicial maior que residual)
- [ ] `Ts > Tr` (temperatura vapor maior que reservatório)
- [ ] `thermalEfficiency` entre 0 e 1
- [ ] `cases.length > 0`
- [ ] `fPVRef > 0` e `fPVRef <= 1`

**Ação**: Implementar validação com Zod no MVP.

---

### 5. Unidades e Conversões

**Pergunta**: Todas as conversões estão documentadas e validadas?

**Conversões Identificadas**:
- ✅ `tDays = tYears * 365.0`
- ✅ `tHours = tDays * 24.0`
- ✅ `massRate_lbPerDay = rateBblPerDay * 350.0` (1 bbl ≈ 350 lb)
- ✅ `VCWE_ft3 = VCWE_bbl * 5.615` (FT3_PER_BBL = 5.615)

**Ação**: Criar arquivo de constantes e conversões.

---

### 6. Estrutura do Projeto Next.js

**Pergunta**: Qual estrutura de pastas seguir?

**Estrutura Proposta**:
```
steamfloodanalysis/
├── docs/                    # Documentação (atual)
├── src/
│   ├── app/                # Next.js App Router
│   │   ├── page.tsx        # Página principal
│   │   └── layout.tsx      # Layout
│   ├── components/         # Componentes React
│   │   ├── ui/             # Componentes Shadcn UI
│   │   ├── forms/          # Formulários
│   │   └── results/        # Visualização de resultados
│   ├── lib/                # Lógica de negócio
│   │   ├── calculations/   # Funções de cálculo
│   │   ├── types/          # TypeScript types
│   │   ├── validation/     # Schemas Zod
│   │   └── constants/      # Constantes e conversões
│   └── data/               # Dados estáticos
│       ├── presets/        # Presets JSON
│       └── tables/         # Tabelas (vapor, fhv-tcd)
├── public/                 # Assets estáticos
└── package.json
```

**Ação**: Criar estrutura base do projeto.

---

## ✅ Checkpoints de Desenvolvimento

### Checkpoint 1: Cálculo da Área Aquecida (Item A)

**Objetivo**: Implementar cálculo do item A) Área Aquecida

**Pré-requisitos**:
- ✅ Estrutura do projeto Next.js criada
- ✅ Types TypeScript definidos
- ✅ Validação de inputs básica
- ✅ Função de cálculo de entalpias
- ✅ Função de cálculo de área aquecida

**Entradas Necessárias**:
- `common`: CommonData completo
- `thermalEfficiency`: Et (entrada manual)
- `cases`: Array com pelo menos uma vazão

**Saída Esperada**:
- `areaHeated_As_ft2`: Área aquecida calculada
- Validação de resultado (comparar com exemplo de referência)

**Critérios de Aceitação**:
- [ ] Função calcula área aquecida corretamente
- [ ] Validação de inputs funciona
- [ ] Resultado corresponde ao exemplo de referência
- [ ] Testes unitários passando

**Próximos Passos Após Checkpoint 1**:
- Checkpoint 2: Energia Armazenada/Perdida (itens C e D)
- Checkpoint 3: Volume de Vapor (item E)
- Checkpoint 4: ROV e ROV Equivalente (itens F e G)
- Checkpoint 5: Balanço de Energia (item H)

---

### Checkpoint 2: Energia Armazenada e Perdida (Itens C e D)

**Dependências**: Checkpoint 1 (área aquecida)

**Objetivo**: Calcular energia armazenada e perdida

**Saídas Esperadas**:
- `storedHeat_Btu`: Energia armazenada
- `lostHeat_Btu`: Energia perdida
- `thermalEfficiency`: Et (já entrada, mas validar)

---

### Checkpoint 3: Volume de Vapor Necessário (Item E)

**Dependências**: Checkpoint 2 (energia armazenada)

**Objetivo**: Calcular volume de vapor necessário

**Saída Esperada**:
- `steamVolumeRequired_V1_ft3`: Volume em ft³
- `steamVolumeRequired_V1_bbl`: Volume em bbl

---

### Checkpoint 4: ROV e ROV Equivalente (Itens F e G)

**Dependências**: Checkpoint 1 (área aquecida) e Checkpoint 3 (volume de vapor)

**Objetivo**: Calcular razão óleo/vapor e equivalente

**Saídas Esperadas**:
- `oilProduced_Nps_bbl`: Volume de óleo produzido
- `oilSteamRatio_Fos`: ROV
- `equivalentOilSteamRatio_Fose`: ROV equivalente

---

### Checkpoint 5: Balanço de Energia (Item H)

**Dependências**: Checkpoint 4 (volume de óleo)

**Objetivo**: Calcular balanço total de energia

**Saídas Esperadas**:
- `oilEnergy_Btu`: Energia contida no óleo
- `boilerEnergy_Btu`: Energia requerida no gerador
- `energyBalanceIndex`: Índice de balanço

---

## 📦 Estrutura de Arquivos Proposta

### Organização da Pasta `docs/`

```
docs/
├── README.md                    # Visão geral
├── INDICE.md                    # Índice de navegação
├── PROJETO.md                    # Visão consolidada
├── MODELO_TECNICO.md            # Detalhamento técnico
├── PLANEJAMENTO.md              # Este documento
├── INCONSISTENCIAS.md           # Problemas e correções
│
├── referencia/                  # Documentos de referência
│   ├── serigadoiv_steamflood_model.md
│   ├── problem.md
│   └── output-example.js
│
├── presets/                     # Presets e casos
│   ├── README.md
│   └── serigado-iv.json
│
├── tabelas/                     # Tabelas e correlações
│   ├── vapor-saturado/
│   │   ├── README.md
│   │   └── tabela_vapor_saturado.json
│   └── fhv-tcd.json
│
└── recursos/                    # Recursos adicionais
    └── Mtodos_trmicos_-_1_slide.pdf
```

**Ação**: Reorganizar estrutura atual para seguir este padrão.

---

## 🎯 Plano de Ação Imediato

### Fase 1: Setup e Preparação

1. **Reorganizar estrutura de documentos**
   - [ ] Criar subpastas `referencia/`, `tabelas/`, `recursos/`
   - [ ] Mover arquivos para locais apropriados
   - [ ] Atualizar links nos documentos

2. **Criar estrutura do projeto Next.js**
   - [ ] Inicializar projeto Next.js 14+ com TypeScript
   - [ ] Configurar Tailwind CSS
   - [ ] Instalar Shadcn UI
   - [ ] Configurar Zod para validação

3. **Definir tipos TypeScript**
   - [ ] Criar `src/lib/types/` com interfaces
   - [ ] Definir `CommonData`, `SteamRateCase`, `SteamAnalysisInput`
   - [ ] Definir `SteamRateResult`, `SteamAnalysisOutput`

4. **Criar constantes e utilitários**
   - [ ] Arquivo de constantes (`FT3_PER_BBL`, `LBS_PER_BBL`, etc.)
   - [ ] Funções de conversão
   - [ ] Validações básicas

### Fase 2: Implementação Incremental

5. **Checkpoint 1: Área Aquecida**
   - [ ] Função `calcSteamEnthalpy`
   - [ ] Função `calcHeatedArea`
   - [ ] Validação de inputs
   - [ ] Testes unitários
   - [ ] Comparação com exemplo de referência

6. **Checkpoint 2-5: Itens Restantes**
   - [ ] Implementar cada checkpoint sequencialmente
   - [ ] Validar resultados em cada etapa
   - [ ] Testes unitários

### Fase 3: Interface e Integração

7. **Formulário de Input**
   - [ ] Componente de formulário com React Hook Form
   - [ ] Validação com Zod
   - [ ] Botão "Carregar Preset Serigado IV"
   - [ ] Seções organizadas (Reservatório, Correlação, Vazões)

8. **Visualização de Resultados**
   - [ ] Tabela de resultados
   - [ ] Organização por itens (a) a (h)
   - [ ] Formatação de números e unidades

9. **Integração Completa**
   - [ ] Conectar formulário → cálculo → resultados
   - [ ] Tratamento de erros
   - [ ] Feedback visual

---

## 🔄 Decisões Pendentes

### Decisão 1: Validação de Entalpias

**Opção A**: Usar valores fornecidos diretamente (MVP)
**Opção B**: Implementar lookup/interpolação da tabela (Fase 2)

**Recomendação**: Opção A para MVP, Opção B para Fase 2

---

### Decisão 2: Valores de Correlação (Et e tc)

**Opção A**: Entrada manual apenas (MVP)
**Opção B**: Implementar lookup/interpolação (Fase 2)

**Recomendação**: Opção A para MVP, Opção B para Fase 2

---

### Decisão 3: Estrutura de Testes

**Opção A**: Testes unitários com Jest/Vitest
**Opção B**: Testes de integração com Playwright

**Recomendação**: Opção A para MVP (testes unitários), Opção B para Fase 2 (testes E2E)

---

## ✅ Resumo Executivo

### Status Atual

- ✅ Documentação consolidada e organizada
- ✅ Modelo técnico compreendido
- ✅ Dependências mapeadas
- ✅ Preset Serigado IV criado
- ⏳ Estrutura do projeto Next.js pendente
- ⏳ Implementação pendente

### Próximos Passos Imediatos

1. **Reorganizar estrutura de documentos** (30 min)
2. **Criar estrutura base do projeto Next.js** (1-2 horas)
3. **Implementar Checkpoint 1: Área Aquecida** (2-3 horas)
4. **Validar resultados com exemplo de referência** (30 min)

### Perguntas Críticas para Resolver

1. ✅ Podemos começar pelo item A? **SIM** - Todas as dependências são entradas diretas
2. ⏳ Validação de valores de entalpia - Usar valores fornecidos no MVP
3. ⏳ Valores de correlação - Entrada manual no MVP
4. ⏳ Estrutura de testes - Jest/Vitest para testes unitários

### Confirmação para Início

**Pronto para iniciar desenvolvimento após**:
- [ ] Reorganização de documentos (se necessário)
- [ ] Criação da estrutura do projeto Next.js
- [ ] Definição de tipos TypeScript
- [ ] Aprovação do plano de checkpoints

---

**Última atualização**: Análise completa concluída - Pronto para desenvolvimento

