import { serigadoIVPreset } from "../src/data/presets"
import { getEnthalpyAtTemperature } from "../src/data/tables/saturated-steam"
import { calculateGTd } from "../src/lib/calculations/math-utils"
import { calculateTDimensionless } from "../src/lib/calculations/thermal-efficiency"

const preset = serigadoIVPreset.data
const common = preset.common

console.log("=".repeat(80))
console.log("DEBUG - FÓRMULA COMPLETA DO SLIDE")
console.log("=".repeat(80))
console.log()

console.log("Dados de Entrada:")
console.log(`  Ts: ${common.Ts} °F`)
console.log(`  fsd: ${common.fsd}`)
console.log(`  CwTs (fornecido): ${common.CwTs} Btu/lb`)
console.log(`  Lv (fornecido): ${common.Lv} Btu/lb`)
console.log()

console.log("Entalpia usando tabela (limite 80°F):")
const enthalpyTable = getEnthalpyAtTemperature(common.Ts, common.fsd)
console.log(`  H_v (tabela, extrapolado): ${enthalpyTable.toFixed(6)} Btu/lb`)
console.log()

console.log("Entalpia usando valores fornecidos:")
const enthalpyProvided = common.CwTs + common.fsd * common.Lv
console.log(`  H_v = CwTs + fsd * Lv`)
console.log(`  H_v = ${common.CwTs} + ${common.fsd} * ${common.Lv}`)
console.log(`  H_v = ${enthalpyProvided.toFixed(6)} Btu/lb`)
console.log()

console.log("=".repeat(80))
console.log("CÁLCULO DE t_d")
console.log("=".repeat(80))
console.log()

const alpha2 = common.K2 / common.rho2C2
const M1 = common.rho1C1
const M2 = common.rho2C2
const h = common.zn
const tHours = common.tYears * 365 * 24

console.log(`  α₂ = K2 / rho2C2 = ${common.K2} / ${common.rho2C2} = ${alpha2.toFixed(6)} ft²/h`)
console.log(`  M₁ = ${M1} Btu/ft³·°F`)
console.log(`  M₂ = ${M2} Btu/ft³·°F`)
console.log(`  h = ${h} ft`)
console.log(`  t = ${tHours} horas`)
console.log()

const tDimensionless = calculateTDimensionless(common, alpha2, tHours)
console.log(`  t_d = 4 * (M₂ / M₁)² * (α₂ / h²) * t`)
console.log(`  t_d = 4 * (${M2} / ${M1})² * (${alpha2.toFixed(6)} / ${h}²) * ${tHours}`)
console.log(`  t_d = 4 * ${Math.pow(M2 / M1, 2).toFixed(6)} * ${(alpha2 / (h * h)).toFixed(10)} * ${tHours}`)
console.log(`  t_d = ${tDimensionless.toFixed(6)}`)
console.log()

const GTd = calculateGTd(tDimensionless)
console.log(`  G(t_d) = e^(t_d) * erfc(√t_d) + 2√(t_d/π) - 1`)
console.log(`  G(t_d) = ${GTd.toFixed(6)}`)
console.log()

console.log("=".repeat(80))
console.log("CÁLCULO DE ÁREA AQUECIDA")
console.log("=".repeat(80))
console.log()

const rateBblPerDay = 565
const massRate_lbPerHour = (rateBblPerDay * 350) / 24
const Ho = massRate_lbPerHour * enthalpyProvided
const deltaT = common.Ts - common.Tr

console.log(`Usando entalpia fornecida (${enthalpyProvided.toFixed(6)} Btu/lb):`)
console.log(`  H_o = ṁ * H_v = ${massRate_lbPerHour.toFixed(2)} lb/h * ${enthalpyProvided.toFixed(6)} Btu/lb`)
console.log(`  H_o = ${Ho.toFixed(2)} Btu/h`)
console.log()

const numerator = Ho * M1 * h
const denominator = 4 * alpha2 * M2 * M2 * deltaT
const areaHeated = (numerator / denominator) * GTd

console.log(`  A_s = (H_o * M₁ * h) / (4 * α₂ * M₂² * ΔT) * G(t_d)`)
console.log(`  A_s = (${Ho.toFixed(2)} * ${M1} * ${h}) / (4 * ${alpha2.toFixed(6)} * ${M2}² * ${deltaT}) * ${GTd.toFixed(6)}`)
console.log(`  A_s = ${numerator.toFixed(2)} / ${denominator.toFixed(2)} * ${GTd.toFixed(6)}`)
console.log(`  A_s = ${(numerator / denominator).toFixed(6)} * ${GTd.toFixed(6)}`)
console.log(`  A_s = ${areaHeated.toFixed(4)} ft²`)
console.log()

console.log(`Valor esperado: 98047.4218 ft²`)
console.log(`Diferença: ${(areaHeated - 98047.4218).toFixed(4)} ft²`)
console.log(`Erro: ${((areaHeated - 98047.4218) / 98047.4218 * 100).toFixed(4)}%`)
console.log()

console.log("=".repeat(80))
console.log("VERIFICAÇÃO DE G(t_d)")
console.log("=".repeat(80))
console.log()

console.log(`Para E_t = 0.6689 (esperado), precisamos:`)
console.log(`  G(t_d) deveria ser aproximadamente 0.6689`)
console.log(`  G(t_d) calculado: ${GTd.toFixed(6)}`)
console.log(`  Diferença: ${Math.abs(GTd - 0.6689).toFixed(6)}`)
console.log()

console.log("Verificando se t_d está correto...")
console.log(`  t_d atual: ${tDimensionless.toFixed(6)}`)
console.log(`  Para G(t_d) = 0.6689, precisamos encontrar qual t_d corresponde`)
console.log()

