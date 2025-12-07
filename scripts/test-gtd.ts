import { calculateGTd } from "../src/lib/calculations/math-utils"

console.log("=".repeat(80))
console.log("TESTE DA FUNÇÃO G(t_d)")
console.log("=".repeat(80))
console.log()

console.log("Testando valores conhecidos:")
console.log()

const testValues = [
  { td: 0.1, expected: null },
  { td: 0.5, expected: null },
  { td: 0.65, expected: 0.6689 },
  { td: 1.0, expected: null },
  { td: 2.0, expected: null },
  { td: 5.0, expected: null },
]

testValues.forEach(({ td, expected }) => {
  const gtd = calculateGTd(td)
  console.log(`  t_d = ${td.toFixed(6)}`)
  console.log(`    G(t_d) = ${gtd.toFixed(6)}`)
  if (expected !== null) {
    const error = Math.abs(gtd - expected)
    const percentError = (error / expected) * 100
    console.log(`    Esperado: ${expected}`)
    console.log(`    Erro: ${error.toFixed(6)} (${percentError.toFixed(2)}%)`)
  }
  console.log()
})

console.log("=".repeat(80))
console.log("BUSCANDO t_d QUE RESULTA EM G(t_d) = 0.6689")
console.log("=".repeat(80))
console.log()

let bestTd = 0
let bestError = Infinity

for (let td = 0.1; td <= 10; td += 0.01) {
  const gtd = calculateGTd(td)
  const error = Math.abs(gtd - 0.6689)
  if (error < bestError) {
    bestError = error
    bestTd = td
  }
}

console.log(`  Melhor t_d encontrado: ${bestTd.toFixed(6)}`)
console.log(`  G(t_d) = ${calculateGTd(bestTd).toFixed(6)}`)
console.log(`  Erro: ${bestError.toFixed(6)}`)
console.log()

console.log("Verificando t_d calculado (0.650093):")
const gtdCalculated = calculateGTd(0.650093)
console.log(`  G(0.650093) = ${gtdCalculated.toFixed(6)}`)
console.log(`  Esperado: 0.6689`)
console.log(`  Erro: ${Math.abs(gtdCalculated - 0.6689).toFixed(6)}`)
console.log()

