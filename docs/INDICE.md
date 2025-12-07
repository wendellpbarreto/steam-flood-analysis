# Índice da Documentação

## 📑 Documentos Organizados

### 1. Documentação Principal

#### [README.md](./README.md)

**Visão geral do projeto**

- Objetivo e fases
- Links para todos os documentos
- Dados do problema Serigado IV
- Próximos passos
- Status do projeto

#### [PROJETO.md](./PROJETO.md)

**Visão consolidada do projeto**

- Contexto técnico
- Estrutura de dados (inputs/outputs)
- Equações principais
- Plano de desenvolvimento (MVP + Fase 2)
- Stack tecnológico sugerido

#### [MODELO_TECNICO.md](./MODELO_TECNICO.md)

**Detalhamento técnico completo**

- Fundamentação teórica (Marx & Langenheim, Myhill & Stegemeier, Mandl & Volek)
- Fluxo de cálculo passo a passo
- Estrutura de dados TypeScript
- Validações necessárias
- Observações técnicas

#### [INCONSISTENCIAS.md](./INCONSISTENCIAS.md)

**Análise de problemas e correções**

- Inconsistências identificadas
- Correções propostas
- Checklist de validação
- Próximas ações recomendadas

#### [presets/](./presets/)

**Sistema de Presets e Casos**

- `serigado-iv.json`: Preset com valores do Serigado IV
- `README.md`: Documentação do sistema de presets
- Estrutura de dados e funcionalidades

---

### 2. Documentação de Referência Original

#### [referencia/serigadoiv_steamflood_model.md](./referencia/serigadoiv_steamflood_model.md)

**Documentação técnica original**

- Modelo analítico detalhado
- Estrutura de dados original
- Equações matemáticas completas
- Como usar no projeto

#### [referencia/problem.md](./referencia/problem.md)

**Dados do problema Serigado IV**

- Parâmetros do reservatório
- Casos de vazão
- Itens a calcular

#### [referencia/output-example.js](./referencia/output-example.js)

**Implementação JavaScript de referência**

- Função `computeSteamInjectionAnalysis`
- Exemplo de uso
- Estrutura de dados validada

---

### 3. Recursos de Dados

#### [tabelas/vapor-saturado/](./tabelas/vapor-saturado/)

**Tabela F.3 - Vapor d'Água Saturado**

- `tabela_vapor_saturado.json`: Dados termodinâmicos (32°F a 80°F)
- `README.md`: Documentação da estrutura

#### [tabelas/fhv-tcd.json](./tabelas/fhv-tcd.json)

**Correlação fhv vs tcd**

- Dados para cálculo de tempo crítico
- Formato: Array JSON com pares `{fhv, tcd}`

---

## 🗺️ Guia de Navegação

### Para entender o projeto

1. Comece por **[README.md](./README.md)** para visão geral
2. Leia **[PROJETO.md](./PROJETO.md)** para contexto completo
3. Consulte **[MODELO_TECNICO.md](./MODELO_TECNICO.md)** para detalhes técnicos

### Para iniciar desenvolvimento

1. Revise **[INCONSISTENCIAS.md](./INCONSISTENCIAS.md)** para problemas conhecidos
2. Use **[output-example.js](./output-example.js)** como referência de implementação
3. Consulte **[MODELO_TECNICO.md](./MODELO_TECNICO.md)** para fluxo de cálculo

### Para entender o modelo matemático

1. **[serigadoiv_steamflood_model.md](./serigadoiv_steamflood_model.md)** - Documentação original completa
2. **[MODELO_TECNICO.md](./MODELO_TECNICO.md)** - Seção "Fundamentação Teórica"
3. **[PROJETO.md](./PROJETO.md)** - Seção "Equações Principais"

### Para validar dados

1. **[problem.md](./problem.md)** - Dados do problema Serigado IV
2. **[INCONSISTENCIAS.md](./INCONSISTENCIAS.md)** - Problemas identificados
3. **[MODELO_TECNICO.md](./MODELO_TECNICO.md)** - Seção "Validações Necessárias"

---

## 📊 Resumo do Conhecimento

### Objetivo

Aplicação web calculadora para análise analítica de injeção contínua de vapor no campo Serigado IV.

### MVP (Fase 1)

- Input de valores → Output de resultados calculados
- Interface web com formulário e tabela de resultados

### Fase 2

- Detalhamento completo de todos os cálculos
- Visualização passo a passo das equações
- Gráficos e comparações

### Modelo

- Baseado em Marx & Langenheim, Myhill & Stegemeier, Mandl & Volek
- Calcula 8 itens principais para cada vazão de injeção
- Implementação de referência em JavaScript disponível

### Dados Disponíveis

- Parâmetros do reservatório Serigado IV
- Tabela de vapor saturado (limitada)
- Correlação fhv vs tcd
- Implementação JavaScript validada

---

## 🔍 Busca Rápida

### Por Tópico

**Estrutura de dados**: [PROJETO.md](./PROJETO.md) → Seção "Estrutura de Dados"
**Sistema de presets**: [PROJETO.md](./PROJETO.md) → Seção "Sistema de Presets e Casos"
**Preset Serigado IV**: [presets/serigado-iv.json](./presets/serigado-iv.json)
**Planejamento**: [PLANEJAMENTO.md](./PLANEJAMENTO.md) → Checkpoints e perguntas
**Equações**: [MODELO_TECNICO.md](./MODELO_TECNICO.md) → Seção "Fluxo de Cálculo"
**Implementação**: [referencia/output-example.js](./referencia/output-example.js)
**Validações**: [MODELO_TECNICO.md](./MODELO_TECNICO.md) → Seção "Validações Necessárias"
**Problemas**: [INCONSISTENCIAS.md](./INCONSISTENCIAS.md)
**Dados do problema**: [referencia/problem.md](./referencia/problem.md)
**Estrutura de docs**: [ESTRUTURA.md](./ESTRUTURA.md) → Organização de arquivos

### Por Fase

**MVP**: [PROJETO.md](./PROJETO.md) → Seção "MVP - Fase 1"
**Fase 2**: [PROJETO.md](./PROJETO.md) → Seção "Fase 2 - Detalhamento de Cálculos"

---

**Última atualização**: Organização inicial concluída
