
# Tabela F.3 – Vapor d’Água Saturado (Unidades Inglesas)

Este repositório contém a tabela digitalizada da Tabela F.3 (Vapor d’Água Saturado).
Os dados foram convertidos para **JSON estruturado**, facilitando uso em aplicações científicas, simuladores e cálculos termodinâmicos.

---

## 📄 Estrutura do JSON (`tabela_vapor_saturado.json`)

Cada item do array representa uma linha da tabela original (temperatura em °F).

### Exemplo de entrada:

```json
{
  "t_F": 32,
  "pressure_psia": 0.0886,
  "volume_specific": {
    "liq_sat": 0.01602,
    "evap": 3304.6,
    "vap_sat": 3304.6
  },
  "energia_interna_U": {
    "liq_sat": -0.02,
    "evap": 1021.3,
    "vap_sat": 1021.3
  },
  "entalpia_H": {
    "liq_sat": -0.02,
    "evap": 1075.5,
    "vap_sat": 1075.5
  },
  "entropia_S": {
    "liq_sat": 0.0,
    "evap": 2.1873,
    "vap_sat": 2.1873
  }
}
```

---

## 🔍 Colunas presentes

### Variáveis termodinâmicas

| Categoria | Descrição | Unidade |
|----------|-----------|---------|
| `t_F` | Temperatura | °F |
| `pressure_psia` | Pressão de saturação | psia |
| `volume_specific` | Volume específico | ft³/lbm |
| `energia_interna_U` | Energia interna específica | Btu/lbm |
| `entalpia_H` | Entalpia específica | Btu/lbm |
| `entropia_S` | Entropia específica | Btu/(lbm·°R) |

Cada grupo contém:
- `liq_sat` → líquido saturado  
- `evap` → calor latente (evaporação)  
- `vap_sat` → vapor saturado  

---

## 🧪 Uso em código

### Python
```python
import json

with open("tabela_vapor_saturado.json") as f:
    data = json.load(f)

print(data[0]["entalpia_H"]["vap_sat"])
```

### JavaScript
```js
import table from './tabela_vapor_saturado.json' assert { type: 'json' };

console.log(table[0].entropia_S.evap);
```

---

## 📌 Observações

- Todos os números foram convertidos para **ponto decimal**.
- A tabela cobre a faixa **32°F a 80°F**.
- Os valores são transcritos diretamente da tabela escaneada fornecida.

---

## 📂 Arquivos

```
tabela_vapor_saturado.json
README.md
```

---

## ✨ Autor
Gerado automaticamente via ChatGPT a partir da tabela original fornecida pelo usuário.
