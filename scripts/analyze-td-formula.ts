import { serigadoIVPreset } from "../src/data/presets"
import { calculateGTd } from "../src/lib/calculations/math-utils"

const preset = serigadoIVPreset.data
const common = preset.common

console.log("=".repeat(80))
console.log("ANÁLISE DETALHADA - FÓRMULA DE t_d")
console.log("=".repeat(80))
console.log()

const alpha2 = common.K2 / common.rho2C2
const M1 = common.rho1C1
const M2 = common.rho2C2
const h = common.zn
const tYears = common.tYears
const tDays = tYears * 365
const tHours = tDays * 24

console.log("Dados de Entrada:")
console.log(`  K2: ${common.K2} Btu/ft·h·°F`)
console.log(`  rho2C2 (M₂): ${M2} Btu/ft³·°F`)
console.log(`  rho1C1 (M₁): ${M1} Btu/ft³·°F`)
console.log(`  zn (h): ${h} ft`)
console.log(`  tYears: ${tYears} anos`)
console.log(`  tHours: ${tHours} horas`)
console.log()

console.log("Cálculo de α₂:")
console.log(`  α₂ = K₂ / M₂ = ${common.K2} / ${M2} = ${alpha2.toFixed(6)} ft²/h`)
console.log()

console.log("Fórmula do slide:")
console.log(`  t_d = 4 * (M₂ / M₁)² * (α₂ / h²) * t`)
console.log()

console.log("Passo a passo:")
const ratioM = M2 / M1
const ratioMSquared = Math.pow(ratioM, 2)
const alphaOverHSquared = alpha2 / (h * h)
const tdCalculated = 4 * ratioMSquared * alphaOverHSquared * tHours

console.log(`  1. (M₂ / M₁) = ${M2} / ${M1} = ${ratioM.toFixed(6)}`)
console.log(`  2. (M₂ / M₁)² = ${ratioMSquared.toFixed(6)}`)
console.log(`  3. α₂ / h² = ${alpha2.toFixed(6)} / ${h}² = ${alpha2.toFixed(6)} / ${h * h} = ${alphaOverHSquared.toFixed(10)}`)
console.log(`  4. t = ${tHours} horas`)
console.log(`  5. t_d = 4 * ${ratioMSquared.toFixed(6)} * ${alphaOverHSquared.toFixed(10)} * ${tHours}`)
console.log(`  6. t_d = ${tdCalculated.toFixed(6)}`)
console.log()

const GTdCalculated = calculateGTd(tdCalculated)
console.log(`G(t_d) calculado:`)
console.log(`  G(${tdCalculated.toFixed(6)}) = ${GTdCalculated.toFixed(6)}`)
console.log()

console.log("Valores esperados:")
console.log(`  G(t_d) esperado: 0.6689`)
console.log(`  Para G(t_d) = 0.6689, precisamos t_d ≈ 1.28`)
console.log()

console.log("=".repeat(80))
console.log("VERIFICAÇÃO DE UNIDADES E CONSTANTES")
console.log("=".repeat(80))
console.log()

console.log("Verificando se há constante faltando:")
const factorNeeded = 1.28 / tdCalculated
console.log(`  Fator necessário: ${factorNeeded.toFixed(6)}`)
console.log(`  Isso é aproximadamente: ${Math.round(factorNeeded)}`)
console.log()

console.log("Testando diferentes unidades de tempo:")
console.log()

const tdDays = 4 * ratioMSquared * alphaOverHSquared * tDays
console.log(`  Se t estiver em DIAS:`)
console.log(`    t_d = 4 * ${ratioMSquared.toFixed(6)} * ${alphaOverHSquared.toFixed(10)} * ${tDays}`)
console.log(`    t_d = ${tdDays.toFixed(6)}`)
console.log(`    G(t_d) = ${calculateGTd(tdDays).toFixed(6)}`)
console.log()

const tdSeconds = 4 * ratioMSquared * alphaOverHSquared * (tHours * 3600)
console.log(`  Se t estiver em SEGUNDOS:`)
console.log(`    t_d = 4 * ${ratioMSquared.toFixed(6)} * ${alphaOverHSquared.toFixed(10)} * ${tHours * 3600}`)
console.log(`    t_d = ${tdSeconds.toFixed(6)}`)
console.log(`    G(t_d) = ${calculateGTd(tdSeconds).toFixed(6)}`)
console.log()

console.log("=".repeat(80))
console.log("VERIFICAÇÃO DE FÓRMULA ALTERNATIVA")
console.log("=".repeat(80))
console.log()

console.log("Verificando se a fórmula deveria ser diferente:")
console.log(`  Slide mostra: t_d = 4 * (M₂/M₁)² * (α₂/h²) * t`)
console.log(`  Verificando se há conversão de unidades em α₂`)
console.log()

console.log("Verificando unidades de α₂:")
console.log(`  α₂ = K₂ / M₂`)
console.log(`  K₂ = ${common.K2} Btu/ft·h·°F`)
console.log(`  M₂ = ${M2} Btu/ft³·°F`)
console.log(`  α₂ = ${common.K2} / ${M2} = ${alpha2} ft²/h`)
console.log(`  Unidades: (Btu/ft·h·°F) / (Btu/ft³·°F) = ft²/h ✓`)
console.log()

console.log("Para obter t_d = 1.28, precisamos:")
const tdNeeded = 1.28
const tNeeded = tdNeeded / (4 * ratioMSquared * alphaOverHSquared)
console.log(`  t = t_d / (4 * (M₂/M₁)² * (α₂/h²))`)
console.log(`  t = ${tdNeeded} / (4 * ${ratioMSquared.toFixed(6)} * ${alphaOverHSquared.toFixed(10)})`)
console.log(`  t = ${tNeeded.toFixed(2)} horas`)
console.log(`  t = ${(tNeeded / 24).toFixed(2)} dias`)
console.log(`  t = ${(tNeeded / (24 * 365)).toFixed(4)} anos`)
console.log()

console.log("Comparando com valores reais:")
console.log(`  t real: ${tHours} horas = ${tDays} dias = ${tYears} anos`)
console.log(`  t necessário: ${tNeeded.toFixed(2)} horas = ${(tNeeded / 24).toFixed(2)} dias = ${(tNeeded / (24 * 365)).toFixed(4)} anos`)
console.log(`  Razão: ${(tHours / tNeeded).toFixed(6)}`)
console.log()

