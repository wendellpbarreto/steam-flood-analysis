/**
 * Conversão básica.
 */
const FT3_PER_BBL = 5.615;

/**
 * Estrutura de entrada:
 *
 * const input = {
 *   common: { ...dados do reservatório... },
 *   thermalEfficiency: 0.65, // Et para t = 2.5 anos (pego do gráfico G(td))
 *   criticalTimeYears: 1.8,  // tempo crítico t_c (anos), se você já tiver
 *   cases: [
 *     { name: '565 bbl/d', rateBblPerDay: 565 },
 *     { name: '755 bbl/d', rateBblPerDay: 755 }
 *   ]
 * }
 */

/**
 * Calcula entalpia do vapor em função de:
 * - entalpia da água líquida à temperatura alvo (CwT)
 * - qualidade do vapor f
 * - calor de vaporização Lv
 */
function calcSteamEnthalpy(CwT, f, Lv) {
  return CwT + f * Lv; // Btu/lb
}

/**
 * Calcula os resultados para todas as vazões.
 */
function computeSteamInjectionAnalysis(input) {
  const {
    common,
    thermalEfficiency: Et,
    criticalTimeYears: tCriticalYears,
    cases,
  } = input;

  if (Et == null) {
    throw new Error(
      "Você precisa informar thermalEfficiency (Et) a partir do gráfico G(td)."
    );
  }

  const {
    Eb, // eficiência do gerador
    Tb,
    Ts,
    Tr,
    K2, // não usado diretamente aqui, mas mantido se quiser evoluir
    rho1C1, // M1 = ρ1 C1
    rho2C2, // M2 = ρ2 C2 (não usado diretamente aqui)
    tYears,
    So,
    Sor,
    gammaO,
    phi,
    zn,
    zt,
    fsd,
    Fsb,
    Lv,
    rhoW,
    CwTs,
    CwTr,
    CwTb,
    fPVRef, // fração de poro injetado para a vazão de referência
  } = common;

  // ---- 1) tempos e deltas ----
  const tDays = tYears * 365.0;
  const tHours = tDays * 24.0;
  const dT = Ts - Tr; // ΔT da zona de vapor

  // ---- 2) entalpias do vapor ----
  const H_sr = calcSteamEnthalpy(CwTs, fsd, Lv); // Btu/lb (condições de reservatório)
  const H_sb = calcSteamEnthalpy(CwTb, Fsb, Lv); // Btu/lb (saída do gerador)

  // ---- 3) primeiro caso = referência para área da malha A ----
  if (!cases || cases.length === 0) {
    throw new Error("Informe pelo menos uma vazão em cases.");
  }

  // Caso de referência: assumo o primeiro da lista
  const refCase = cases[0];

  // taxa mássica (lb/d) e (lb/h) para o caso de referência
  const mDotRef_lbPerDay = refCase.rateBblPerDay * 350.0; // 1 bbl ≈ 350 lb de água
  const mDotRef_lbPerHour = mDotRef_lbPerDay / 24.0;

  // taxa de calor (Btu/h) no reservatório para o caso de referência
  const QDotRef_BtuPerHour = mDotRef_lbPerHour * H_sr;

  // calor total injetado no tempo t (Btu)
  const QTotRef_Btu = QDotRef_BtuPerHour * tHours;

  // volume de água fria equivalente injetado (bbl) e (ft³)
  const VCWERef_bbl = refCase.rateBblPerDay * tDays;
  const VCWERef_ft3 = VCWERef_bbl * FT3_PER_BBL;

  // área da malha A (ft²) usando fração de poro injetado fPVRef
  // fPVRef = VCWERef_ft3 / (A * zn * phi)  =>  A = VCWERef_ft3 / (fPVRef * zn * phi)
  const A_pattern_ft2 = VCWERef_ft3 / (fPVRef * zn * phi);

  // ---- 4) loop para cada vazão ----
  const results = cases.map((c) => {
    // 4.1) massa de vapor
    const mDot_lbPerDay = c.rateBblPerDay * 350.0;
    const mDot_lbPerHour = mDot_lbPerDay / 24.0;

    // 4.2) calor injetado (reservatório)
    const QDot_BtuPerHour = mDot_lbPerHour * H_sr;
    const QTot_Btu = QDot_BtuPerHour * tHours;

    // 4.3) volume de água fria equivalente injetado
    const VCWE_bbl = c.rateBblPerDay * tDays;
    const VCWE_ft3 = VCWE_bbl * FT3_PER_BBL;

    // 4.4) fração de poro injetado para este caso, usando a mesma área de padrão
    const PV_total_ft3 = A_pattern_ft2 * zn * phi;
    const fPV_case = VCWE_ft3 / PV_total_ft3;

    // 4.5) área aquecida (As) via eficiência térmica:
    // Q_armazenado = Et * QTot_Btu = As * zn * rho1C1 * dT
    // => As = Et * QTot_Btu / (zn * rho1C1 * dT)
    const As_ft2 = (Et * QTot_Btu) / (zn * rho1C1 * dT);

    // 4.6) energia armazenada na zona de vapor (para conferência)
    const QStored_Btu = Et * QTot_Btu;

    // 4.7) energia perdida para camadas adjacentes
    const QLost_Btu = (1.0 - Et) * QTot_Btu;

    // 4.8) volume de vapor necessário para aquecer a rocha (V1)
    // QStored_Btu ≈ ρw * V1 * [ (CwTs - CwTr) + fsd * Lv ]
    const denom_V1 = rhoW * (CwTs - CwTr + fsd * Lv);
    const V1_ft3 = QStored_Btu / denom_V1;
    const V1_bbl = V1_ft3 / FT3_PER_BBL;

    // 4.9) volume de óleo deslocado na zona de vapor Nps
    // Nps_ft3 = As * zn * phi * (So - Sor)
    // Nps_bbl = Nps_ft3 / 5.615
    const deltaS = So - Sor;
    const Nps_ft3 = As_ft2 * zn * phi * deltaS;
    const Nps_bbl = Nps_ft3 / FT3_PER_BBL;

    // 4.10) Razão óleo/vapor (ROV = Fos)
    const Fos = Nps_bbl / V1_bbl;

    // 4.11) Razão óleo-vapor equivalente (Fose)
    // normalizando para vapor padrão 1000 Btu/lb no gerador
    // Fose = Fos * (1000 / H_sb)
    const Fose = Fos * (1000.0 / H_sb);

    // 4.12) Energia contida no óleo (correlação tipo Zaba et al.)
    // Atenção: ajuste a unidade se seu slide definir diferente.
    const h_o = 13.1 + 5600.0 * gammaO; // Btu/bbl (assumido)
    const E_oil_Btu = Nps_bbl * h_o;

    // 4.13) Energia requerida no gerador (corrigindo eficiência Eb)
    const QBoiler_Btu = QTot_Btu / Eb;

    // 4.14) Índice de balanço de energia (energia obtida / energia requerida)
    const E_balance = E_oil_Btu / QBoiler_Btu;

    return {
      name: c.name,
      rateBblPerDay: c.rateBblPerDay,

      // dados de base
      massRate_lbPerDay: mDot_lbPerDay,
      massRate_lbPerHour: mDot_lbPerHour,

      // (a) área aquecida + info complementar
      areaPattern_ft2: A_pattern_ft2, // área do padrão de poços (fixa, mesma para todos)
      areaHeated_As_ft2: As_ft2, // área aquecida (pedido do item a)
      poreFractionInjected: fPV_case, // fração de poro injetado para esta vazão

      // (b) tempo crítico (mesmo para todos, vindo do input)
      criticalTime_years: tCriticalYears,

      // (c) eficiência térmica
      thermalEfficiency: Et,

      // (d) energia perdida
      totalHeatInjected_Btu: QTot_Btu,
      storedHeat_Btu: QStored_Btu,
      lostHeat_Btu: QLost_Btu,

      // (e) volume de vapor necessário
      steamVolumeRequired_V1_ft3: V1_ft3,
      steamVolumeRequired_V1_bbl: V1_bbl,

      // (f) razão óleo/vapor
      oilProduced_Nps_bbl: Nps_bbl,
      oilSteamRatio_Fos: Fos,

      // (g) razão óleo-vapor equivalente
      equivalentOilSteamRatio_Fose: Fose,

      // (h) balanço de energia
      oilEnergy_Btu: E_oil_Btu,
      boilerEnergy_Btu: QBoiler_Btu,
      energyBalanceIndex: E_balance,
    };
  });

  return {
    enthalpyReservoir_BtuPerLb: H_sr,
    enthalpyBoiler_BtuPerLb: H_sb,
    patternArea_ft2: A_pattern_ft2,
    thermalEfficiency: Et,
    criticalTime_years: tCriticalYears,
    cases: results,
  };
}

/**
 * EXEMPLO de uso com os dados do seu enunciado.
 * Ajuste APENAS:
 *  - thermalEfficiency (Et) a partir do gráfico G(td)
 *  - criticalTimeYears com o t_c que você encontrar
 */
const exampleInput = {
  common: {
    Eb: 0.9,
    Tb: 70, // °F
    Ts: 500, // °F
    Tr: 100, // °F
    K2: 1.2, // Btu/ft.h.°F
    rho1C1: 35, // Btu/ft³.°F
    rho2C2: 33, // Btu/ft³.°F
    tYears: 2.5,
    So: 0.64,
    Sor: 0.15,
    gammaO: 0.94,
    phi: 0.24,
    zn: 66, // ft (espessura líquida)
    zt: 86, // ft (espessura total)
    fsd: 0.72,
    Fsb: 0.8,
    Lv: 713.9, // Btu/lb
    rhoW: 62.4, // lb/ft³
    CwTs: 361.91,
    CwTr: 77.94,
    CwTb: 38.0,
    fPVRef: 0.54, // fração de poro injetado (para o caso de referência)
  },
  thermalEfficiency: 0.65, // <-- COLOQUE AQUI O Et que você ler do gráfico G(td)
  criticalTimeYears: 1.8, // <-- COLOQUE AQUI o t_c (anos) que você encontrar
  cases: [
    { name: "Vazão 1 (565 bbl/d)", rateBblPerDay: 565 },
    { name: "Vazão 2 (755 bbl/d)", rateBblPerDay: 755 },
  ],
};

// Exemplo de chamada (em Node ou browser):
// const output = computeSteamInjectionAnalysis(exampleInput);
// console.log(JSON.stringify(output, null, 2));
