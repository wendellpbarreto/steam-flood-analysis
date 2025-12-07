# Documentação de Cálculos - Diretrizes

## 📋 Objetivo

Este diretório contém a documentação detalhada de cada cálculo implementado no sistema de análise de steamflood. O objetivo principal é facilitar a **leitura futura**, **manutenção**, **evolução** e **correção de problemas** através de documentação completa e precisa.

---

## 🎯 Nível de Detalhamento Esperado

Cada documento de cálculo deve seguir um padrão rigoroso de detalhamento, garantindo que qualquer desenvolvedor possa:

1. **Entender a fundamentação teórica** completa
2. **Reproduzir o cálculo manualmente** passo a passo
3. **Identificar cada variável** e sua origem
4. **Localizar no código** onde cada parte está implementada
5. **Validar resultados** através de exemplos numéricos
6. **Identificar pontos de atenção** e possíveis problemas
7. **Fazer modificações** com segurança

---

## 📐 Estrutura Padrão de Documentação

Cada documento deve conter as seguintes seções:

### 1. Visão Geral
- Descrição clara do que o cálculo faz
- Contexto dentro do sistema
- Importância do resultado

### 2. Objetivo
- O que se pretende calcular
- Para que serve o resultado
- Dependências de outros cálculos

### 3. Fundamentação Teórica
- **Fórmulas matemáticas** completas (em LaTeX quando possível)
- **Referências bibliográficas** (autores, artigos, livros)
- **Derivação** ou explicação física das fórmulas
- **Condições de validade** e limitações

### 4. Cálculo Detalhado Passo a Passo
- **Cada etapa** do cálculo explicada
- **Fórmulas intermediárias** mostradas
- **Ordem de execução** clara
- **Explicação** do porquê de cada passo

### 5. Variáveis e Fontes de Dados
- **Tabela completa** de todas as variáveis:
  - Nome da variável
  - Descrição
  - Unidade
  - Fonte (usuário, tabela, cálculo anterior)
  - Exemplo com valores reais
- **Distinção clara** entre:
  - Variáveis de entrada
  - Variáveis calculadas
  - Constantes

### 6. Tabelas e Dados Externos
- **Localização** dos arquivos de dados
- **Estrutura** das tabelas (JSON, formato)
- **Funções de busca** e interpolação
- **Algoritmos** de interpolação explicados
- **Tolerâncias** e critérios de busca

### 7. Implementação no Código
- **Arquivo principal** onde está implementado
- **Função principal** do cálculo
- **Fluxo de cálculo** em pseudocódigo ou código comentado
- **Funções auxiliares** e onde estão localizadas
- **Estruturas de dados** utilizadas

### 8. Exemplo Numérico Completo
- **Dados de entrada** reais (preferencialmente Serigado IV)
- **Cálculo passo a passo** com valores numéricos
- **Resultados intermediários** mostrados
- **Resultado final** destacado

### 9. Pontos de Atenção
- **Interpolação**: Quando e como ocorre
- **Unidades**: Conversões e consistência
- **Validação**: Campos obrigatórios e limites
- **Precisão numérica**: Limitações e cuidados
- **Dependências**: Outros cálculos necessários

### 10. Debugging e Validação
- **Valores esperados** para casos conhecidos
- **Logs úteis** para debug
- **Como validar** se o cálculo está correto
- **Sinais de problemas** e como identificá-los

### 11. Referências
- **Bibliografia** completa
- **Artigos científicos** relevantes
- **Tabelas de referência** utilizadas
- **Padrões** seguidos (ex: ASME Steam Tables)

### 12. Modificações Futuras
- **Possíveis melhorias** identificadas
- **Pontos de extensão** no código
- **Linhas específicas** onde fazer modificações
- **Considerações** para futuras evoluções

### 13. Notas de Implementação
- **Decisões de design** tomadas
- **Alternativas** consideradas e descartadas
- **Compatibilidade** com outras partes do sistema
- **Trade-offs** realizados

---

## ✍️ Padrões de Escrita

### Fórmulas Matemáticas
- Use LaTeX para fórmulas: `\[ ... \]` para fórmulas destacadas
- Use `\( ... \)` ou `$ ... $` para fórmulas inline
- Sempre defina cada símbolo após a fórmula
- Use notação científica consistente

### Código
- Use blocos de código com syntax highlighting
- Referencie arquivos usando caminhos relativos ao root do projeto
- Mostre trechos de código relevantes, não arquivos inteiros
- Use comentários explicativos quando necessário

### Tabelas
- Use tabelas markdown para organizar informações
- Inclua unidades em todas as colunas relevantes
- Use exemplos reais sempre que possível

### Exemplos Numéricos
- Use valores reais do preset Serigado IV quando possível
- Mostre cálculos intermediários completos
- Indique claramente quando valores são interpolados
- Mostre a precisão esperada (casas decimais)

---

## 🔍 Critérios de Qualidade

Um documento está completo quando:

- ✅ **Qualquer desenvolvedor** consegue entender sem consultar código
- ✅ **Cálculo pode ser reproduzido** manualmente usando apenas o documento
- ✅ **Todas as variáveis** estão documentadas com origem e unidade
- ✅ **Todas as fórmulas** estão explicadas e referenciadas
- ✅ **Exemplo numérico** completo está presente
- ✅ **Pontos críticos** estão destacados e explicados
- ✅ **Localização no código** está clara para cada parte
- ✅ **Possíveis problemas** estão documentados

---

## 📁 Estrutura de Arquivos

```
docs/calculos/
├── README.md                    # Este arquivo (diretrizes)
├── ITEM_A_AREA_AQUECIDA.md      # Documentação do Item A
├── ITEM_B_TEMPO_CRITICO.md      # Documentação do Item B
└── ...                          # Futuros itens
```

---

## 🔄 Processo de Atualização

1. **Ao implementar um novo cálculo**: Criar documento completo seguindo esta estrutura
2. **Ao modificar um cálculo existente**: Atualizar documento correspondente
3. **Ao identificar problemas**: Documentar na seção "Pontos de Atenção"
4. **Ao fazer melhorias**: Atualizar seção "Modificações Futuras"

---

## 📝 Template Base

Use o arquivo `ITEM_A_AREA_AQUECIDA.md` como template base para novos documentos. Ele segue todas as diretrizes aqui estabelecidas e pode ser usado como referência.

---

**Última atualização**: 2024
**Versão**: 1.0
**Autor**: Sistema de Análise de Steamflood

