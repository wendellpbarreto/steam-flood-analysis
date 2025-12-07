import { serigadoIVPreset } from "../src/data/presets"

const preset = serigadoIVPreset.data
const common = preset.common

console.log("=".repeat(80))
console.log("VERIFICAÇÃO DO CÁLCULO DE t_d")
console.log("=".repeat(80))
console.log()

const alpha2 = common.K2 / common.rho2C2
const M1 = common.rho1C1
const M2 = common.rho2C2
const h = common.zn
const tYears = common.tYears
const tDays = tYears * 365
const tHours = tDays * 24

console.log("Dados:")
console.log(`  K2: ${common.K2} Btu/ft·h·°F`)
console.log(`  rho2C2: ${common.rho2C2} Btu/ft³·°F`)
console.log(`  rho1C1: ${M1} Btu/ft³·°F`)
console.log(`  zn (h): ${h} ft`)
console.log(`  tYears: ${tYears} anos`)
console.log(`  tDays: ${tDays} dias`)
console.log(`  tHours: ${tHours} horas`)
console.log()

console.log("Cálculo atual:")
console.log(`  α₂ = K2 / rho2C2 = ${common.K2} / ${common.rho2C2} = ${alpha2.toFixed(6)} ft²/h`)
console.log(`  t_d = 4 * (M₂ / M₁)² * (α₂ / h²) * t`)
console.log(`  t_d = 4 * (${M2} / ${M1})² * (${alpha2.toFixed(6)} / ${h}²) * ${tHours}`)
console.log(`  t_d = 4 * ${Math.pow(M2 / M1, 2).toFixed(6)} * ${(alpha2 / (h * h)).toFixed(10)} * ${tHours}`)
const tdCurrent = 4 * Math.pow(M2 / M1, 2) * (alpha2 / (h * h)) * tHours
console.log(`  t_d = ${tdCurrent.toFixed(6)}`)
console.log()

console.log("Para obter G(t_d) = 0.6689, precisamos t_d ≈ 1.28")
console.log(`  t_d atual: ${tdCurrent.toFixed(6)}`)
console.log(`  t_d necessário: 1.28`)
console.log(`  Razão: ${(1.28 / tdCurrent).toFixed(6)}`)
console.log()

console.log("Verificando possíveis correções:")
console.log()

console.log("1. Verificando se α₂ está em unidades corretas:")
console.log(`   α₂ = ${alpha2} ft²/h`)
console.log(`   Verificando: K2 = ${common.K2} Btu/ft·h·°F, rho2C2 = ${common.rho2C2} Btu/ft³·°F`)
console.log(`   α₂ = K2 / rho2C2 = ${common.K2} / ${common.rho2C2} = ${alpha2} ft²/h`)
console.log(`   Unidades: (Btu/ft·h·°F) / (Btu/ft³·°F) = ft²/h ✓`)
console.log()

console.log("2. Verificando se precisamos converter horas para outro formato:")
console.log(`   Se multiplicarmos tHours por ${(1.28 / tdCurrent).toFixed(6)}, obtemos t_d = 1.28`)
console.log(`   Isso sugere que talvez o tempo deva estar em outra unidade`)
console.log()

console.log("3. Verificando se há constante faltando na fórmula:")
console.log(`   Fator necessário: ${(1.28 / tdCurrent).toFixed(6)}`)
console.log(`   Isso é aproximadamente: ${Math.round(1.28 / tdCurrent)}`)
console.log()

console.log("4. Verificando se a fórmula do slide está completa:")
console.log(`   Slide: t_d = 4 * (M₂ / M₁)² * (α₂ / h²) * t`)
console.log(`   Verificando se há alguma constante adicional ou conversão`)
console.log()

