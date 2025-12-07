# Estrutura da Documentação

## 📁 Organização de Arquivos

```
docs/
├── README.md                    # Visão geral do projeto
├── INDICE.md                    # Índice de navegação
├── PROJETO.md                    # Visão consolidada do projeto
├── MODELO_TECNICO.md            # Detalhamento técnico completo
├── PLANEJAMENTO.md              # Plano de desenvolvimento e checkpoints
├── INCONSISTENCIAS.md           # Problemas identificados e correções
├── ESTRUTURA.md                 # Este arquivo - estrutura de organização
│
├── referencia/                  # Documentos de referência original
│   ├── serigadoiv_steamflood_model.md  # Documentação técnica original
│   ├── problem.md                       # Dados do problema Serigado IV
│   └── output-example.js                # Implementação JavaScript de referência
│
├── presets/                     # Presets e casos salvos
│   ├── README.md                # Documentação do sistema de presets
│   └── serigado-iv.json         # Preset com valores do Serigado IV
│
├── tabelas/                     # Tabelas e correlações
│   ├── vapor-saturado/          # Tabela F.3 - Vapor d'Água Saturado
│   │   ├── README.md
│   │   └── tabela_vapor_saturado.json
│   └── fhv-tcd.json             # Correlação fhv vs tcd (tempo crítico)
│
└── recursos/                     # Recursos adicionais
    └── Mtodos_trmicos_-_1_slide.pdf  # Material de referência
```

## 📚 Guia de Uso

### Para Desenvolvedores

1. **Início Rápido**: Comece por `README.md` e `PLANEJAMENTO.md`
2. **Referência Técnica**: Consulte `MODELO_TECNICO.md` para detalhes de implementação
3. **Exemplos**: Veja `referencia/output-example.js` para código de referência
4. **Dados**: Use `presets/serigado-iv.json` como preset padrão

### Para Entendimento do Projeto

1. **Visão Geral**: `README.md`
2. **Contexto**: `PROJETO.md`
3. **Detalhes Técnicos**: `MODELO_TECNICO.md`
4. **Problemas Conhecidos**: `INCONSISTENCIAS.md`

### Para Navegação

- Use `INDICE.md` para encontrar documentos rapidamente
- Use `ESTRUTURA.md` (este arquivo) para entender organização

## 🔄 Mudanças de Estrutura

### Arquivos Movidos

- `serigadoiv_steamflood_model.md` → `referencia/`
- `problem.md` → `referencia/`
- `output-example.js` → `referencia/`
- `tabela-valor-saturado/` → `tabelas/vapor-saturado/`
- `table-fhv-tcd.json` → `tabelas/`
- `Mtodos_trmicos_-_1_slide.pdf` → `recursos/`

### Links Atualizados

Todos os links nos documentos principais foram atualizados para refletir a nova estrutura.

