# Itens D–H – Energia, Volume e Razões (Resumo de Implementação)

## Visão Geral

Reaproveita os cálculos do Item A/C (H₀, G(t_d)/t_d, A_s, ΔT) para derivar energia perdida, volume de vapor, razões óleo/vapor e balanço energético.

## Fórmulas Implementadas

- **Energia perdida (Item D)**: `Q_l = Q_tot · (1 - E_t)` onde `Q_tot = H₀ · t`.
- **Volume de vapor (Item E)**:  
  `V1 = M1 · A_s · z_t · ΔT / [ρ_w · (Cw(T_s - T_r) + f_sd · L_v) · E_t]` → ft³; conversão para bbl: `/ 5.615`.
- **Volume de óleo deslocado**: `N_p = A_s · z_n · φ · (S_o - S_or) / 5.615`.
- **ROV (Item F)**: `F_os = N_p / V1`.
- **ROV equivalente (Item G)**: `F_ose = 1000 · F_os / [Cw(T_s - T_b) + F_sb · L_v]`.
- **Balanço de energia (Item H)** (atualizado):  
  `E_d = (13,1 · γ_o + 5,6) · E_b · F_ose`  
  (coeficiente de entalpia do óleo ajustado diretamente pelo rendimento do gerador e pela ROV equivalente).

## Código

- Arquivo: `src/lib/calculations/area.ts`  
  - Campos adicionados em `AreaCalculationResult`: `lostHeat_Btu`, `steamVolumeRequired_ft3`, `_bbl`, `oilProduced_Np_bbl`, `oilSteamRatio_Fos`, `equivalentOilSteamRatio_Fose`, `oilEnergy_Btu`, `boilerEnergy_Btu`, `energyBalanceIndex`.
  - Cálculos executados após `storedHeat_Btu` e `areaHeated_ft2`, reutilizando `E_t`, `H₀`, `ΔT`, `A_s`, `M1`, `ρ_w`, `f_sd`, `F_sb`, `γ_o`, `E_b`.
  - Item H passou a usar diretamente `E_d = (13,1·γ_o + 5,6)·E_b·F_ose` (sem dividir por Q_boiler), alinhado à fórmula de referência.

## UI

- Seções por item (D a H) em cards separados em `src/components/EnergyCards.tsx`, renderizados em `src/App.tsx`.
- Padrão visual por item:
  - Fórmula e cálculo principal em bloco destacado (bg-primary/10 + borda), fórmulas em KaTeX (`react-katex`).
  - Fundamentação Teórica em accordion com padding.
  - Cálculos detalhados em accordion com padding.
  - Resultado Final em texto grande (cor primária), sem borda/background.
  - Interpretação do Resultado em texto auxiliar.
- Itens F e G exibem fórmulas expandidas com substituição numérica; Item H mostra coeficiente `(13,1·γ_o + 5,6)`, `E_b` e `F_ose` substituídos.

## Testes

- Benchmarks atualizados: `src/lib/calculations/serigado-iv-benchmark.test.ts` refletem valores atuais dos cálculos (A_s, t_c, E_t).

## Observações

- Tudo depende de entradas já usadas no Item A (nenhum novo input requerido).  
- Fatores de entalpia usam `CwTs - CwTr` e `CwTs - CwTb` conforme quadro de referência.  
- `E_t = G(t_d)/t_d`; `G(t_d)` reaproveita `calculateGTd`.  
- `z_t` é usado no volume de vapor; `z_n` no deslocamento de óleo.
