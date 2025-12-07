# Presets e Casos Salvos

Esta pasta contém os presets pré-definidos do sistema.

## Estrutura

Cada preset é um arquivo JSON seguindo a estrutura:

```typescript
interface Preset {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt?: string;
  isDefault?: boolean;
  data: SteamAnalysisInput;
}
```

## Presets Disponíveis

### Serigado IV (`serigado-iv.json`)

**Caso de referência** do campo Serigado IV com todos os parâmetros do reservatório e casos de vazão pré-configurados.

**Características**:
- Valores validados do problema original
- 2 casos de vazão: 565 e 755 bbl/d
- Preset padrão do sistema

**Uso**:
- Carregar como ponto de partida para novos cálculos
- Base para comparação com outros cenários
- Referência para validação de resultados

## Funcionalidades do Sistema

### MVP (Fase 1)

- ✅ **Carregar Preset**: Botão para carregar valores do Serigado IV
- ✅ **Edição Livre**: Todos os campos podem ser modificados após carregar
- ✅ **Cálculo Dinâmico**: Recalcula automaticamente ao alterar valores

### Fase 2

- 📝 **Salvar Casos Customizados**: Usuário pode salvar suas próprias configurações
- 📊 **Comparar Casos**: Comparar múltiplos casos lado a lado
- 📚 **Biblioteca de Presets**: Expandir com outros casos de referência

## Como Adicionar Novos Presets

1. Criar arquivo JSON seguindo a estrutura acima
2. Usar ID único e descritivo
3. Incluir todos os campos obrigatórios de `SteamAnalysisInput`
4. Documentar origem dos valores na descrição

## Validação

Antes de usar um preset, o sistema deve validar:
- Todos os campos obrigatórios presentes
- Valores dentro de faixas razoáveis
- Estrutura de dados correta
- Pelo menos um caso de vazão definido

