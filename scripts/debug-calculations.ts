import { serigadoIVPreset } from "../src/data/presets"

const preset = serigadoIVPreset.data
const common = preset.common

console.log("=".repeat(80))
console.log("DEBUG - CÁLCULOS INTERMEDIÁRIOS")
console.log("=".repeat(80))
console.log()

console.log("Dados de Entrada:")
console.log(`  K2: ${common.K2} Btu/ft·h·°F`)
console.log(`  rho2C2: ${common.rho2C2} Btu/ft³·°F`)
console.log(`  zn: ${common.zn} ft`)
console.log(`  tYears: ${common.tYears} anos`)
console.log()

const alpha2 = common.K2 / common.rho2C2
console.log(`Difusividade Térmica (α₂):`)
console.log(`  α₂ = K2 / rho2C2`)
console.log(`  α₂ = ${common.K2} / ${common.rho2C2}`)
console.log(`  α₂ = ${alpha2} ft²/h`)
console.log()

const tDays = common.tYears * 365.0
const tHours = tDays * 24.0
const tSeconds = tHours * 3600.0
const znSquared = common.zn * common.zn

console.log(`Conversões de Tempo:`)
console.log(`  tDays = ${tDays} dias`)
console.log(`  tHours = ${tHours} horas`)
console.log(`  tSeconds = ${tSeconds} segundos`)
console.log(`  zn² = ${znSquared} ft²`)
console.log()

const tDimensionless = (alpha2 * tSeconds) / znSquared
console.log(`Tempo Adimensional (t_d):`)
console.log(`  t_d = (α₂ × t) / z_n²`)
console.log(`  t_d = (${alpha2} × ${tSeconds}) / ${znSquared}`)
console.log(`  t_d = ${tDimensionless}`)
console.log(`  log10(t_d) = ${Math.log10(tDimensionless).toFixed(6)}`)
console.log()

const fhv = Math.sqrt(tDimensionless) / (1 + Math.sqrt(tDimensionless))
console.log(`Parâmetro FHV:`)
console.log(`  FHV = √t_d / (1 + √t_d)`)
console.log(`  FHV = √${tDimensionless} / (1 + √${tDimensionless})`)
console.log(`  FHV = ${fhv.toFixed(6)}`)
console.log()

console.log("=".repeat(80))
console.log("VALORES ESPERADOS:")
console.log("=".repeat(80))
console.log(`  Eficiência Térmica: 0.6689`)
console.log(`  Tempo Crítico: 427.63 dias = ${427.63 * 24} horas`)
console.log()

console.log("=".repeat(80))
console.log("ANÁLISE:")
console.log("=".repeat(80))
console.log(`  t_d calculado: ${tDimensionless}`)
console.log(`  FHV calculado: ${fhv.toFixed(6)}`)
console.log()
console.log("Para obter E_t = 0.6689, precisamos verificar:")
console.log("  - Qual valor de t_d corresponde a E_t = 0.6689?")
console.log("  - A função lookupMyhillStegemeier está correta?")
console.log()
console.log("Para obter t_c = 427.63 dias, precisamos verificar:")
console.log("  - Qual valor de FHV corresponde a t_cd que resulta em 427.63 dias?")
console.log("  - A conversão de t_cd para t_c está correta?")
console.log()

