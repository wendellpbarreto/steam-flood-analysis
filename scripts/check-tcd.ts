import { fhvTcdTable } from "../src/data/tables/fhv-tcd"

const fhv = 0.962483

console.log("=".repeat(80))
console.log("VERIFICAÇÃO TABELA FHV-TCD")
console.log("=".repeat(80))
console.log()

console.log(`FHV calculado: ${fhv}`)
console.log()

let lower = fhvTcdTable[0]
let upper = fhvTcdTable[fhvTcdTable.length - 1]

for (let i = 0; i < fhvTcdTable.length - 1; i++) {
  const current = fhvTcdTable[i]
  const next = fhvTcdTable[i + 1]

  if (fhv >= current.fhv && fhv <= next.fhv) {
    lower = current
    upper = next
    break
  }
}

console.log(`Intervalo encontrado:`)
console.log(`  FHV: ${lower.fhv} → ${upper.fhv}`)
console.log(`  TCD: ${lower.tcd} → ${upper.tcd}`)
console.log()

const t = (fhv - lower.fhv) / (upper.fhv - lower.fhv)
const tcd = lower.tcd + t * (upper.tcd - lower.tcd)

console.log(`Interpolação:`)
console.log(`  t = (${fhv} - ${lower.fhv}) / (${upper.fhv} - ${lower.fhv})`)
console.log(`  t = ${t.toFixed(6)}`)
console.log(`  tcd = ${lower.tcd} + ${t.toFixed(6)} * (${upper.tcd} - ${lower.tcd})`)
console.log(`  tcd = ${tcd.toFixed(6)}`)
console.log()

const alpha2 = 1.2 / 33
const znSquared = 66 * 66
const tCriticalSeconds = (tcd * znSquared) / alpha2
const tCriticalHours = tCriticalSeconds / 3600.0
const tCriticalDays = tCriticalHours / 24.0

console.log(`Conversão para Tempo Crítico:`)
console.log(`  α₂ = ${alpha2} ft²/h`)
console.log(`  z_n² = ${znSquared} ft²`)
console.log(`  t_c (segundos) = (t_cd × z_n²) / α₂`)
console.log(`  t_c (segundos) = (${tcd.toFixed(6)} × ${znSquared}) / ${alpha2}`)
console.log(`  t_c (segundos) = ${tCriticalSeconds.toFixed(2)} s`)
console.log(`  t_c (horas) = ${tCriticalHours.toFixed(2)} h`)
console.log(`  t_c (dias) = ${tCriticalDays.toFixed(2)} dias`)
console.log()

console.log("=".repeat(80))
console.log("VALORES ESPERADOS:")
console.log("=".repeat(80))
console.log(`  Tempo Crítico: 427.63 dias = ${427.63 * 24} horas`)
console.log()

console.log("=".repeat(80))
console.log("ANÁLISE:")
console.log("=".repeat(80))
console.log(`  t_c calculado: ${tCriticalDays.toFixed(2)} dias`)
console.log(`  t_c esperado: 427.63 dias`)
console.log(`  Diferença: ${Math.abs(tCriticalDays - 427.63).toFixed(2)} dias`)
console.log()

console.log("Para obter t_c = 427.63 dias:")
console.log(`  t_c (horas) esperado = ${427.63 * 24} horas`)
console.log(`  t_c (segundos) esperado = ${427.63 * 24 * 3600} segundos`)
console.log()

const tcdExpected = (427.63 * 24 * 3600 * alpha2) / znSquared
console.log(`  t_cd esperado = (t_c × α₂) / z_n²`)
console.log(`  t_cd esperado = (${427.63 * 24 * 3600} × ${alpha2}) / ${znSquared}`)
console.log(`  t_cd esperado = ${tcdExpected.toFixed(6)}`)
console.log()

console.log("Verificando qual FHV corresponde a este t_cd:")
for (let i = 0; i < fhvTcdTable.length - 1; i++) {
  const current = fhvTcdTable[i]
  const next = fhvTcdTable[i + 1]

  if (tcdExpected >= current.tcd && tcdExpected <= next.tcd) {
    const t2 = (tcdExpected - current.tcd) / (next.tcd - current.tcd)
    const fhvExpected = current.fhv + t2 * (next.fhv - current.fhv)

    console.log(`  Intervalo: t_cd ${current.tcd} → ${next.tcd}`)
    console.log(`  FHV correspondente: ${fhvExpected.toFixed(6)}`)
    console.log(`  FHV calculado atual: ${fhv.toFixed(6)}`)
    console.log(`  Diferença: ${Math.abs(fhvExpected - fhv).toFixed(6)}`)
    break
  }
}

