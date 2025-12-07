import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { Alert, AlertDescription } from "./ui/alert"
import type { SteamRateCase } from "../data/presets"
import { getCaseName } from "../data/presets"
import {
  bblPerDayToMetricTonsPerDay,
  metricTonsPerDayToBblPerDay,
} from "../lib/constants/conversions"
import { validateSteamRate, syncSteamRateUnits } from "../lib/validation/steam-rate"

interface SteamRateCasesProps {
  cases: SteamRateCase[]
  onCasesChange: (cases: SteamRateCase[]) => void
}

export function SteamRateCases({ cases, onCasesChange }: SteamRateCasesProps) {
  const updateCase = (
    index: number,
    field: keyof SteamRateCase,
    value: number
  ) => {
    let updated = cases.map((c, i) =>
      i === index ? { ...c, [field]: value } : c
    )

    const updatedCase = updated[index]

    if (field === "rateBblPerDay") {
      updatedCase.rateTonsPerDay = bblPerDayToMetricTonsPerDay(value)
    } else if (field === "rateTonsPerDay") {
      updatedCase.rateBblPerDay = metricTonsPerDayToBblPerDay(value)
    }

    updated[index] = syncSteamRateUnits(updatedCase)
    onCasesChange(updated)
  }

  const addCase = () => {
    const newCase: SteamRateCase = {
      rateBblPerDay: 500,
    }
    onCasesChange([...cases, syncSteamRateUnits(newCase)])
  }

  const removeCase = (index: number) => {
    if (cases.length > 1) {
      onCasesChange(cases.filter((_, i) => i !== index))
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Casos de Vazão</CardTitle>
            <CardDescription>
              Defina as vazões de injeção de vapor para análise
            </CardDescription>
          </div>
          <Badge variant="secondary">{cases.length} caso(s)</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {cases.map((caseItem, index) => {
          const validation = validateSteamRate(caseItem)
          const caseName = getCaseName(index)

          return (
            <div key={index} className="space-y-3">
              <div className="flex flex-col md:flex-row gap-4 p-4 border rounded-lg bg-muted/30">
                <div className="flex items-center justify-center min-w-[100px]">
                  <Badge variant="outline" className="text-sm font-semibold">
                    {caseName}
                  </Badge>
                </div>
                <div className="flex-1 space-y-2">
                  <Label htmlFor={`case-rate-bbl-${index}`}>
                    Vazão (bbl/d)
                  </Label>
                  <Input
                    id={`case-rate-bbl-${index}`}
                    type="number"
                    step="0.1"
                    value={caseItem.rateBblPerDay}
                    onChange={(e) =>
                      updateCase(
                        index,
                        "rateBblPerDay",
                        parseFloat(e.target.value) || 0
                      )
                    }
                  />
                  {caseItem.rateTonsPerDay && (
                    <p className="text-xs text-muted-foreground">
                      ≈ {caseItem.rateTonsPerDay.toFixed(2)} t/d
                    </p>
                  )}
                </div>
                <div className="flex-1 space-y-2">
                  <Label htmlFor={`case-rate-tons-${index}`}>
                    Vazão (t/d)
                  </Label>
                  <Input
                    id={`case-rate-tons-${index}`}
                    type="number"
                    step="0.1"
                    value={caseItem.rateTonsPerDay || ""}
                    onChange={(e) =>
                      updateCase(
                        index,
                        "rateTonsPerDay",
                        parseFloat(e.target.value) || 0
                      )
                    }
                    placeholder="Calculado automaticamente"
                  />
                  {caseItem.rateBblPerDay && (
                    <p className="text-xs text-muted-foreground">
                      ≈ {caseItem.rateBblPerDay.toFixed(1)} bbl/d
                    </p>
                  )}
                </div>
                {cases.length > 1 && (
                  <div className="flex items-end">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => removeCase(index)}
                    >
                      Remover
                    </Button>
                  </div>
                )}
              </div>
              {!validation.valid && (
                <Alert variant="destructive" className="py-2">
                  <AlertDescription className="text-sm">
                    {validation.errors.join("; ")}
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )
        })}
        <Button variant="outline" onClick={addCase} className="w-full">
          + Adicionar Caso de Vazão
        </Button>
      </CardContent>
    </Card>
  )
}

