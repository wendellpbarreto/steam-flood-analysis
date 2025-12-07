
# Serigado IV · Steamflood Analytical Assessment

Este documento descreve, de forma **genérica e parametrizada**, o modelo analítico implementado em JavaScript para o **Projeto de Injeção Contínua de Vapor** no campo onshore **Serigado IV**.

A ideia é servir como documentação técnica para o projeto no Cursor, explicando:

- Quais são as **entradas** (dados do reservatório, do vapor e das vazões).
- Quais são as **principais equações** usadas.
- Quais são as **saídas** calculadas para cada vazão de injeção de vapor.
- Onde entram os parâmetros lidos de **gráficos/correlações externas** (ex.: \(G(t_d)\), \(t_c\)).

---

## 1. Visão geral do modelo

O modelo implementa a **PARTE 1 – Análise analítica** do projeto de injeção contínua de vapor, usando as formulações clássicas:

- **Marx & Langenheim** – balanço de energia na zona de vapor.
- **Myhill & Stegemeier** – eficiência térmica \(E_t = G(t_d)\).
- **Mandl & Volek** – definição de **tempo crítico** \(t_c\).
- Conceitos de **Razão Óleo/Vapor (ROV)** e **ROV equivalente**.
- **Balanço total de energia** com base na energia contida no óleo produzido.

A função principal em JavaScript (exemplo):

```ts
computeSteamInjectionAnalysis(input: SteamAnalysisInput) => SteamAnalysisOutput
```

onde `input` contém:

- **Dados comuns do reservatório/processo** (`common`)
- **Eficiência térmica global** \(E_t\) (lida de gráfico)
- **Tempo crítico** \(t_c\) (lido de gráfico/correlação)
- **Lista de casos de vazão** (`cases`), cada um com uma vazão de vapor em bbl/dia

---

## 2. Entradas do modelo

### 2.1. Estrutura geral (pseudo-tipo)

```ts
type CommonData = {
  Eb: number;      // Eficiência do gerador [-]
  Tb: number;      // Temperatura na caldeira (°F)
  Ts: number;      // Temperatura da zona de vapor (°F)
  Tr: number;      // Temperatura inicial do reservatório (°F)

  Ps: number;      // Pressão do vapor (psia) — aqui só informativa

  K2: number;      // Condutividade térmica das camadas sub/sobrejacentes (Btu/ft·h·°F)
  rho1C1: number;  // M1 = ρ1*C1, capacidade calorífica volumétrica zona de vapor (Btu/ft³·°F)
  rho2C2: number;  // M2 = ρ2*C2, capacidade calorífica volumétrica camadas adjacentes (Btu/ft³·°F)

  tYears: number;  // Tempo de injeção (anos)

  So: number;      // Saturação inicial de óleo
  Sor: number;     // Saturação residual de óleo
  gammaO: number;  // Densidade relativa do óleo (γo)
  phi: number;     // Porosidade (φ)

  zn: number;      // Espessura líquida do reservatório (ft)
  zt: number;      // Espessura total sujeita a aquecimento (ft)

  fsd: number;     // Qualidade do vapor no reservatório
  Fsb: number;     // Qualidade do vapor na caldeira

  Lv: number;      // Calor de vaporização (Btu/lb)
  rhoW: number;    // Densidade da água (lb/ft³)

  CwTs: number;    // Entalpia da água líquida a Ts (Btu/lb)
  CwTr: number;    // Entalpia da água líquida a Tr (Btu/lb)
  CwTb: number;    // Entalpia da água líquida a Tb (Btu/lb)

  fPVRef: number;  // Fração de poro injetado para a vazão de referência (adimensional)
};

type SteamRateCase = {
  name: string;          // Rótulo do caso (ex.: "Vazão 1 (565 bbl/d)")
  rateBblPerDay: number; // Vazão de injeção de vapor (bbl/d)
};

type SteamAnalysisInput = {
  common: CommonData;
  thermalEfficiency: number;    // Et, obtido do gráfico G(td)
  criticalTimeYears: number;    // tc, obtido de Mandl & Volek
  cases: SteamRateCase[];
};
```

---

### 2.2. Variáveis físicas e significado

| Variável   | Descrição                                                                 | Unidade                 |
|-----------|---------------------------------------------------------------------------|-------------------------|
| Eb        | Eficiência do gerador de vapor                                            | –                       |
| Tb        | Temperatura na caldeira                                                   | °F                      |
| Ts        | Temperatura da zona de vapor                                              | °F                      |
| Tr        | Temperatura inicial do reservatório                                       | °F                      |
| Ps        | Pressão do vapor                                                          | psia                    |
| K2        | Condutividade térmica das camadas sub/sobrejacentes                      | Btu/ft·h·°F             |
| rho1C1    | \(M_1 = ρ_1 C_1\), capacidade calorífica volumétrica da zona de vapor  | Btu/ft³·°F              |
| rho2C2    | \(M_2 = ρ_2 C_2\), cap. calorífica volumétrica camadas adjacentes      | Btu/ft³·°F              |
| tYears    | Tempo de injeção                                                          | anos                    |
| So        | Saturação inicial de óleo                                                 | –                       |
| Sor       | Saturação residual de óleo                                                | –                       |
| γo (gammaO) | Densidade relativa do óleo                                              | –                       |
| φ (phi)   | Porosidade do reservatório                                                | –                       |
| zn        | Espessura líquida (zona produtiva)                                        | ft                      |
| zt        | Espessura total sujeita a aquecimento                                     | ft                      |
| fsd       | Qualidade do vapor no reservatório                                        | –                       |
| Fsb       | Qualidade do vapor na caldeira                                            | –                       |
| Lv        | Calor de vaporização do vapor                                             | Btu/lb                  |
| ρw (rhoW) | Densidade da água                                                         | lb/ft³                  |
| CwTs      | Entalpia da água líquida a Ts                                             | Btu/lb                  |
| CwTr      | Entalpia da água líquida a Tr                                             | Btu/lb                  |
| CwTb      | Entalpia da água líquida a Tb                                             | Btu/lb                  |
| fPVRef    | Fração de poro injetado para a vazão de referência                        | –                       |
| rateBblPerDay | Vazão de injeção de vapor                                             | bbl/d                   |
| Et        | Eficiência térmica global (Myhill & Stegemeier)                           | –                       |
| tc        | Tempo crítico (Mandl & Volek)                                             | anos                    |

---

## 3. Principais etapas e equações

### 3.1. Conversões de tempo

- Tempo total de injeção em dias:  
  \[
  t_d = t_{years} \cdot 365
  \]

- Tempo total em horas:  
  \[
  t_h = t_d \cdot 24
  \]

### 3.2. Variação de temperatura da zona de vapor

\[
\Delta T = T_s - T_r
\]

---

### 3.3. Entalpias do vapor

**No reservatório (Ts, fsd):**

\[
H_{s,r} = C_{wTs} + f_{sd} \cdot L_v \quad [\text{Btu/lb}]
\]

**Na caldeira (Tb, Fsb):**

\[
H_{s,b} = C_{wTb} + F_{sb} \cdot L_v \quad [\text{Btu/lb}]
\]

---

### 3.4. Taxa de massa de vapor e calor injetado

Assumindo **1 bbl ≈ 350 lb** de água:

\[
\dot m_i [\text{lb/d}] = \text{rateBblPerDay}_i \cdot 350
\]
\[
\dot m_i [\text{lb/h}] = \frac{\dot m_i [\text{lb/d}]}{24}
\]

Taxa de calor (reservatório):

\[
\dot Q_{r,i} = \dot m_i \cdot H_{s,r} \quad [\text{Btu/h}]
\]

Calor total injetado:

\[
Q_{tot,i} = \dot Q_{r,i} \cdot t_h \quad [\text{Btu}]
\]

---

### 3.5. Volume de água fria equivalente (CWE) e área do padrão

Volume CWE injetado:

\[
V_{CWE,i} [\text{bbl}] = q_i \cdot t_d
\]
\[
V_{CWE,i} [\text{ft}^3] = V_{CWE,i}[\text{bbl}] \cdot 5{,}615
\]

Para o caso de referência (ex.: 565 bbl/d), usando a fração de poro injetado:

\[
f_{PV} = \frac{V_{CWE,ref}}{A_{pattern} \cdot z_n \cdot \phi}
\quad\Rightarrow\quad
A_{pattern} = \frac{V_{CWE,ref}}{f_{PV} \cdot z_n \cdot \phi}
\]

Com \(A_{pattern}\) fixo, para qualquer caso:

- Volume poroso total:
  \[
  PV_{total} = A_{pattern} \cdot z_n \cdot \phi
  \]

- Nova fração de poro injetado:
  \[
  f_{PV,i} = \frac{V_{CWE,i}}{PV_{total}}
  \]

---

### 3.6. Área aquecida \(A_s\) – item (a)

Balanço de energia (Marx & Langenheim):

\[
Q_{armazenado,i} = A_{s,i} \cdot z_n \cdot M_1 \cdot \Delta T
\]

Eficiência térmica:

\[
E_t = \frac{Q_{armazenado,i}}{Q_{tot,i}}
\]

Logo:

\[
A_{s,i} = \frac{E_t \cdot Q_{tot,i}}{z_n \cdot M_1 \cdot \Delta T}
\]

---

### 3.7. Tempo crítico \(t_c\) – item (b)

No código, **\(t_c\) entra como ENTRADA**, pois depende de:

- Difusividade térmica da formação adjacente:
  \[
  \alpha_2 = \frac{K_2}{M_2}
  \]
- Tempo adimensional \(t_d\) (função da geometria e propriedades).
- Correlação/curva de **Mandl & Volek**.

No projeto:

- Você **obtém \(t_c\) dos gráficos/correlações** e passa como `criticalTimeYears`.

---

### 3.8. Eficiência térmica \(E_t\) – item (c)

Similarmente, **\(E_t\) é ENTRADA**, calculada via:

\[
E_t = G(t_d)
\]

onde \(G(t_d)\) vem de curvas de **Myhill & Stegemeier**.

No código:

- `thermalEfficiency` representa esse valor para o tempo total de injeção.

---

### 3.9. Energia perdida para camadas adjacentes – item (d)

\[
Q_{perdido,i} = (1 - E_t) \cdot Q_{tot,i}
\]

---

### 3.10. Volume de vapor necessário para aquecer a rocha – item (e)

Equação para o volume de vapor requerido (forma zona de vapor):

\[
V_{1,i} =
\frac{M_1 \cdot A_{s,i} \cdot z_t \cdot \Delta T}
     {E_t \cdot \rho_w \cdot \big[ C_w(T_s - T_r) + f_{sd} L_v \big]}
\]

No código:

- Calculamos primeiro \(Q_{armazenado,i} = E_t \cdot Q_{tot,i}\).
- Rearranjamos para isolar \(V_{1,i}\), convertendo para ft³ e depois bbl.

---

### 3.11. Razão óleo/vapor (ROV) – item (f)

Volume de óleo deslocado na zona de vapor:

\[
\Delta S = S_o - S_{or}
\]
\[
N_{p,s} [\text{ft}^3] = A_{s,i} \cdot z_n \cdot \phi \cdot \Delta S
\]
\[
N_{p,s} [\text{bbl}] = \frac{N_{p,s}[\text{ft}^3]}{5{,}615}
\]

ROV:

\[
F_{os,i} = \frac{N_{p,s}[\text{bbl}]}{V_{1,i}[\text{bbl}]}
\]

---

### 3.12. Razão óleo–vapor equivalente – item (g)

Normalizando para vapor padrão de **1000 Btu/lb** na caldeira:

\[
F_{ose,i} =
F_{os,i} \cdot 
\frac{1000}
     {C_w(T_s - T_b) + F_{sb} L_v}
\]

No código:

- Usamos:
  \[
  C_w(T_s - T_b) \approx C_{wTs} - C_{wTb}
  \]
  e o mesmo \(L_v\).

---

### 3.13. Balanço de energia – item (h)

Energia contida no óleo (correlação tipo Zaba):

\[
h_o = 13{,}1 + 5600 \cdot \gamma_o \quad [\text{Btu/bbl}] \quad (assumido)
\]

Energia no óleo:

\[
E_{óleo,i} = N_{p,s}[\text{bbl}] \cdot h_o
\]

Energia requerida para gerar o vapor (caldeira):

\[
Q_{boiler,i} = \frac{Q_{tot,i}}{E_b}
\]

Índice de balanço de energia:

\[
E_{d,i} = \frac{E_{óleo,i}}{Q_{boiler,i}}
\]

---

## 4. Saídas do modelo (por caso de vazão)

Para cada entrada `SteamRateCase`, o modelo retorna algo na linha de:

```ts
type SteamRateResult = {
  name: string;
  rateBblPerDay: number;

  // Massa e calor
  massRate_lbPerDay: number;
  massRate_lbPerHour: number;
  totalHeatInjected_Btu: number;

  // (a) Área
  areaPattern_ft2: number;     // área do padrão de poços (fixa)
  areaHeated_As_ft2: number;   // área aquecida

  // Fração de poro injetado
  poreFractionInjected: number;

  // (b) Tempo crítico
  criticalTime_years: number;  // igual para todos, vindo do input

  // (c) Eficiência térmica
  thermalEfficiency: number;   // Et

  // (d) Energia perdida
  storedHeat_Btu: number;
  lostHeat_Btu: number;

  // (e) Volume de vapor necessário
  steamVolumeRequired_V1_ft3: number;
  steamVolumeRequired_V1_bbl: number;

  // (f) Razão óleo/vapor
  oilProduced_Nps_bbl: number;
  oilSteamRatio_Fos: number;

  // (g) Razão óleo-vapor equivalente
  equivalentOilSteamRatio_Fose: number;

  // (h) Balanço de energia
  oilEnergy_Btu: number;
  boilerEnergy_Btu: number;
  energyBalanceIndex: number;
};

type SteamAnalysisOutput = {
  enthalpyReservoir_BtuPerLb: number;  // Hs,r
  enthalpyBoiler_BtuPerLb: number;     // Hs,b
  patternArea_ft2: number;             // A_pattern
  thermalEfficiency: number;           // Et
  criticalTime_years: number;          // tc
  cases: SteamRateResult[];
};
```

---

## 5. Como usar no projeto (resumo operacional)

1. **Definir os dados comuns** (`common`) de acordo com o problema (Serigado IV).
2. **Definir as vazões de vapor** em `cases` (ex.: 565 e 755 bbl/d).
3. A partir dos **gráficos da disciplina**:
   - Ler \(G(t_d)\) para o tempo de injeção → preencher `thermalEfficiency`.
   - Ler \(t_c\) (Mandl & Volek) → preencher `criticalTimeYears`.
4. Chamar a função `computeSteamInjectionAnalysis(input)`.
5. Usar o objeto de saída para:
   - Montar tabelas de resultados.
   - Gerar gráficos (ROV x vazão, balanço de energia, etc.).
   - Preencher relatório técnico.

Sugestão de caminho do arquivo neste projeto:

- `docs/serigadoiv_steamflood_model.md`
