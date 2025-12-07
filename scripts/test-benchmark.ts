import { calculateAreaHeated } from "../src/lib/calculations/area"
import { serigadoIVPreset } from "../src/data/presets"

const benchmarkValues = {
  case565: {
    areaHeated_As_ft2: 98047.4218,
    criticalTime_days: 427.63,
    criticalTime_hours: 10263.23,
    thermalEfficiency: 0.6689,
  },
  case755: {
    areaHeated_As_ft2: 131019.1212,
    criticalTime_days: 427.63,
    criticalTime_hours: 10263.23,
    thermalEfficiency: 0.6689,
  },
}

function relativeError(calculated: number, expected: number): number {
  if (expected === 0) {
    return Math.abs(calculated - expected)
  }
  return Math.abs((calculated - expected) / expected)
}

function formatPercent(value: number): string {
  return `${(value * 100).toFixed(4)}%`
}

console.log("=".repeat(80))
console.log("SERIGADO IV - BENCHMARK DE VALORES DE REFERÊNCIA")
console.log("=".repeat(80))
console.log()

const preset = serigadoIVPreset.data

console.log("📊 CASO 565 bbl/d")
console.log("-".repeat(80))

const result565 = calculateAreaHeated(preset, { rateBblPerDay: 565 }, 0)
const expected565 = benchmarkValues.case565

console.log(`Área Aquecida:`)
console.log(`  Calculado: ${result565.areaHeated_ft2.toFixed(4)} ft²`)
console.log(`  Esperado:  ${expected565.areaHeated_As_ft2} ft²`)
console.log(`  Erro:      ${formatPercent(relativeError(result565.areaHeated_ft2, expected565.areaHeated_As_ft2))}`)
console.log()

const criticalTime_days_565 = result565.criticalTime.criticalTime_years * 365
console.log(`Tempo Crítico (dias):`)
console.log(`  Calculado: ${criticalTime_days_565.toFixed(2)} dias`)
console.log(`  Esperado:  ${expected565.criticalTime_days} dias`)
console.log(`  Erro:      ${formatPercent(relativeError(criticalTime_days_565, expected565.criticalTime_days))}`)
console.log()

const criticalTime_hours_565 = result565.criticalTime.criticalTime_years * 365 * 24
console.log(`Tempo Crítico (horas):`)
console.log(`  Calculado: ${criticalTime_hours_565.toFixed(2)} horas`)
console.log(`  Esperado:  ${expected565.criticalTime_hours} horas`)
console.log(`  Erro:      ${formatPercent(relativeError(criticalTime_hours_565, expected565.criticalTime_hours))}`)
console.log()

console.log(`Eficiência Térmica:`)
console.log(`  Calculado: ${result565.thermalEfficiency.toFixed(6)}`)
console.log(`  Esperado:  ${expected565.thermalEfficiency}`)
console.log(`  Erro:      ${formatPercent(relativeError(result565.thermalEfficiency, expected565.thermalEfficiency))}`)
console.log()

console.log("📊 CASO 755 bbl/d")
console.log("-".repeat(80))

const result755 = calculateAreaHeated(preset, { rateBblPerDay: 755 }, 1)
const expected755 = benchmarkValues.case755

console.log(`Área Aquecida:`)
console.log(`  Calculado: ${result755.areaHeated_ft2.toFixed(4)} ft²`)
console.log(`  Esperado:  ${expected755.areaHeated_As_ft2} ft²`)
console.log(`  Erro:      ${formatPercent(relativeError(result755.areaHeated_ft2, expected755.areaHeated_As_ft2))}`)
console.log()

console.log("=".repeat(80))
console.log("ANÁLISE DETALHADA - CASO 565 bbl/d")
console.log("=".repeat(80))
console.log()

console.log("Cálculos Intermediários:")
console.log(`  tYears: ${preset.common.tYears}`)
console.log(`  tDays: ${preset.common.tYears * 365}`)
console.log(`  tHours: ${preset.common.tYears * 365 * 24}`)
console.log(`  deltaT: ${result565.deltaT} °F`)
console.log(`  zn: ${preset.common.zn} ft`)
console.log(`  rho1C1: ${preset.common.rho1C1} Btu/ft³·°F`)
console.log(`  CwTs: ${preset.common.CwTs} Btu/lb`)
console.log(`  fsd: ${preset.common.fsd}`)
console.log(`  Lv: ${preset.common.Lv} Btu/lb`)
console.log()

const enthalpyReservoir = preset.common.CwTs + preset.common.fsd * preset.common.Lv
console.log(`Entalpia no Reservatório:`)
console.log(`  H_sr = CwTs + fsd * Lv`)
console.log(`  H_sr = ${preset.common.CwTs} + ${preset.common.fsd} * ${preset.common.Lv}`)
console.log(`  H_sr = ${enthalpyReservoir.toFixed(6)} Btu/lb`)
console.log(`  Calculado: ${result565.enthalpyReservoir_BtuPerLb.toFixed(6)} Btu/lb`)
console.log()

const massRate_lbPerDay = 565 * 350
const massRate_lbPerHour = massRate_lbPerDay / 24
const heatRate_BtuPerHour = massRate_lbPerHour * enthalpyReservoir
const totalHeat_Btu = heatRate_BtuPerHour * (preset.common.tYears * 365 * 24)

console.log(`Calor Total Injetado:`)
console.log(`  mDot_lbPerDay = ${massRate_lbPerDay} lb/d`)
console.log(`  mDot_lbPerHour = ${massRate_lbPerHour.toFixed(2)} lb/h`)
console.log(`  QDot_BtuPerHour = ${heatRate_BtuPerHour.toFixed(2)} Btu/h`)
console.log(`  QTot_Btu = ${totalHeat_Btu.toFixed(2)} Btu`)
console.log(`  Calculado: ${result565.totalHeat_Btu.toFixed(2)} Btu`)
console.log()

console.log(`Eficiência Térmica:`)
console.log(`  E_t (calculado): ${result565.thermalEfficiency.toFixed(6)}`)
console.log(`  E_t (esperado): ${expected565.thermalEfficiency}`)
console.log()

const storedHeat_Btu = result565.thermalEfficiency * result565.totalHeat_Btu
console.log(`Calor Armazenado:`)
console.log(`  Q_armazenado = E_t * Q_tot`)
console.log(`  Q_armazenado = ${result565.thermalEfficiency.toFixed(6)} * ${result565.totalHeat_Btu.toFixed(2)}`)
console.log(`  Q_armazenado = ${storedHeat_Btu.toFixed(2)} Btu`)
console.log(`  Calculado: ${result565.storedHeat_Btu.toFixed(2)} Btu`)
console.log()

const denominator = preset.common.zn * preset.common.rho1C1 * result565.deltaT
console.log(`Denominador da Fórmula:`)
console.log(`  z_n * M_1 * ΔT = ${preset.common.zn} * ${preset.common.rho1C1} * ${result565.deltaT}`)
console.log(`  z_n * M_1 * ΔT = ${denominator}`)
console.log()

console.log(`Área Aquecida:`)
console.log(`  A_s = Q_armazenado / (z_n * M_1 * ΔT)`)
console.log(`  A_s = ${storedHeat_Btu.toFixed(2)} / ${denominator}`)
console.log(`  A_s = ${(storedHeat_Btu / denominator).toFixed(4)} ft²`)
console.log(`  Calculado: ${result565.areaHeated_ft2.toFixed(4)} ft²`)
console.log(`  Esperado:  ${expected565.areaHeated_As_ft2} ft²`)
console.log(`  Diferença: ${(result565.areaHeated_ft2 - expected565.areaHeated_As_ft2).toFixed(4)} ft²`)
console.log(`  Erro:      ${formatPercent(relativeError(result565.areaHeated_ft2, expected565.areaHeated_As_ft2))}`)
console.log()

