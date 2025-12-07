import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { erfc } from "../lib/calculations/math-utils";
import type { AreaCalculationResult } from "../lib/calculations/area";
import type { PresetData } from "../data/presets";

interface ThermalEfficiencyDetailProps {
  result: AreaCalculationResult;
  presetData: PresetData;
}

export function ThermalEfficiencyDetail({
  result,
  presetData,
}: ThermalEfficiencyDetailProps) {
  const { common } = presetData;

  const formatNumber = (value: number, decimals: number = 2): string => {
    return new Intl.NumberFormat("pt-BR", {
      maximumFractionDigits: decimals,
      minimumFractionDigits: decimals,
    }).format(value);
  };

  const formatScientific = (value: number): string => {
    return value.toExponential(4);
  };

  const formatLargeNumber = (value: number): string => {
    return new Intl.NumberFormat("pt-BR", {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    }).format(value);
  };

  // Calcular tempo em diferentes unidades para exibição
  const tDays = common.tYears * 365.0;
  const tHours = tDays * 24.0;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <CardTitle>Eficiência Térmica</CardTitle>
          <Badge variant="secondary">Item C</Badge>
        </div>
        <CardDescription>
          Cálculo da eficiência térmica usando correlação de Myhill & Stegemeier
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-3">Fundamentação Teórica</h3>
          <div className="space-y-3 mb-4">
            <div className="bg-muted/50 p-3 rounded">
              <p className="text-sm font-medium mb-1">
                Myhill & Stegemeier - Eficiência Térmica:
              </p>
              <code className="text-xs font-mono block">
                E_t = G(t_d) / t_d
              </code>
              <p className="text-xs text-muted-foreground mt-1">
                Onde G(t_d) = e^(t_d) × erfc(√t_d) + 2√(t_d/π) - 1
              </p>
            </div>
            <div className="bg-muted/50 p-3 rounded">
              <p className="text-sm font-medium mb-1">Onde:</p>
              <code className="text-xs font-mono block">
                E_t = Q_armazenado / Q_total
              </code>
              <p className="text-xs text-muted-foreground mt-1">
                A eficiência térmica representa a fração do calor total injetado
                que é efetivamente armazenado na zona de vapor, em relação ao
                calor perdido para as camadas adjacentes.
              </p>
            </div>
            <div className="bg-muted/50 p-3 rounded">
              <p className="text-sm font-medium mb-1">
                Tempo Adimensional (t_d):
              </p>
              <code className="text-xs font-mono block">
                t_d = 4 × (M₂/M₁)² × (α₂/h²) × t
              </code>
              <p className="text-xs text-muted-foreground mt-1">
                O tempo adimensional relaciona o tempo de injeção com as
                propriedades térmicas do reservatório e camadas adjacentes.
              </p>
            </div>
          </div>

          <h3 className="text-lg font-semibold mb-3">
            Fórmula da Eficiência Térmica
          </h3>
          <div className="bg-muted p-4 rounded-lg">
            <code className="text-sm font-mono">
              E_t = G(t_d) / t_d
            </code>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Onde: E_t = Eficiência térmica (adimensional, 0 a 1), G(t_d) = Função de Myhill & Stegemeier, t_d = Tempo adimensional
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            G(t_d) = e^(t_d) × erfc(√t_d) + 2√(t_d/π) - 1
          </p>
        </div>

        <Separator />

        <div>
          <h3 className="text-lg font-semibold mb-3">
            Cálculo do Tempo Adimensional (t_d)
          </h3>
          <div className="space-y-4">
            <div className="bg-primary/10 p-4 rounded-lg border-2 border-primary/20">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    Difusividade Térmica (α₂):
                  </span>
                  <span className="text-sm font-mono">
                    {formatScientific(result.alpha2)} ft²/h
                  </span>
                </div>
                <code className="text-xs block text-muted-foreground">
                  α₂ = K₂ / (ρ₂ × C₂) = {formatNumber(common.K2)} / (
                  {formatNumber(common.rho2C2)})
                </code>
                <code className="text-xs block font-semibold text-primary mt-1">
                  α₂ = {formatScientific(result.alpha2)} ft²/h
                </code>
              </div>
            </div>

            <div className="bg-primary/10 p-4 rounded-lg border-2 border-primary/20">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    Tempo de Injeção (t):
                  </span>
                  <span className="text-sm font-mono">
                    {formatNumber(common.tYears, 2)} anos ={" "}
                    {formatNumber(tDays, 2)} dias ={" "}
                    {formatLargeNumber(tHours)} horas
                  </span>
                </div>
                <code className="text-xs block text-muted-foreground">
                  t = {formatNumber(common.tYears, 2)} anos × 365 dias/ano × 24
                  h/dia
                </code>
                <code className="text-xs block font-semibold text-primary mt-1">
                  t = {formatLargeNumber(tHours)} horas
                </code>
              </div>
            </div>

            <div className="bg-primary/10 p-4 rounded-lg border-2 border-primary/20">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    Tempo Adimensional (t_d):
                  </span>
                  <span className="text-sm font-mono">
                    {formatNumber(result.tDimensionless, 6)}
                  </span>
                </div>
                <code className="text-xs block text-muted-foreground">
                  t_d = 4 × (M₂/M₁)² × (α₂/h²) × t
                </code>
                <code className="text-xs block text-muted-foreground mt-1">
                  t_d = 4 × ({formatNumber(common.rho2C2)} /{" "}
                  {formatNumber(common.rho1C1)})² × (
                  {formatScientific(result.alpha2)} / ({formatNumber(common.zt)}{" "}
                  ft)²) × {formatLargeNumber(tHours)} h
                </code>
                <code className="text-xs block text-muted-foreground mt-1 text-yellow-600 dark:text-yellow-400">
                  Nota: h = z_t (espessura total = {formatNumber(common.zt)} ft), não z_n
                </code>
                <code className="text-xs block text-muted-foreground mt-1">
                  t_d = 4 × ({formatNumber(common.rho2C2 / common.rho1C1, 6)})² ×
                  ({formatScientific(result.alpha2 / (common.zt * common.zt))}) ×{" "}
                  {formatLargeNumber(tHours)}
                </code>
                <code className="text-xs block font-semibold text-primary mt-1">
                  t_d = {formatNumber(result.tDimensionless, 6)}
                </code>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="text-lg font-semibold mb-3">
            Cálculo de G(t_d) - Função de Myhill & Stegemeier
          </h3>
          <div className="space-y-4">
            <div className="bg-primary/10 p-4 rounded-lg border-2 border-primary/20">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    G(t_d) = e^(t_d) × erfc(√t_d) + 2√(t_d/π) - 1
                  </span>
                  <span className="text-sm font-mono">
                    {formatNumber(result.GTd ?? 0, 6)}
                  </span>
                </div>
                <code className="text-xs block text-muted-foreground">
                  G(t_d) = e^({formatNumber(result.tDimensionless, 6)}) ×
                  erfc(√{formatNumber(result.tDimensionless, 6)}) + 2√(
                  {formatNumber(result.tDimensionless, 6)}/π) - 1
                </code>
                <code className="text-xs block text-muted-foreground mt-1">
                  Calculando cada termo:
                </code>
                <code className="text-xs block text-muted-foreground mt-1">
                  • e^(t_d) × erfc(√t_d) ={" "}
                  {formatNumber(
                    Math.exp(result.tDimensionless) *
                      erfc(Math.sqrt(result.tDimensionless)),
                    6
                  )}
                </code>
                <code className="text-xs block text-muted-foreground">
                  • 2√(t_d/π) ={" "}
                  {formatNumber(
                    (2 * Math.sqrt(result.tDimensionless)) / Math.sqrt(Math.PI),
                    6
                  )}
                </code>
                <code className="text-xs block font-semibold text-primary mt-1">
                  G(t_d) = {formatNumber(result.GTd ?? 0, 6)}
                </code>
              </div>
            </div>

            <div className="bg-primary/10 p-4 rounded-lg border-2 border-primary/20">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    E_t = G(t_d) / t_d
                  </span>
                  <span className="text-sm font-mono">
                    {formatNumber(result.thermalEfficiency, 6)}
                  </span>
                </div>
                <code className="text-xs block text-muted-foreground">
                  E_t = {formatNumber(result.GTd ?? 0, 6)} / {formatNumber(result.tDimensionless, 6)}
                </code>
                <code className="text-xs block font-semibold text-primary mt-1">
                  E_t = {formatNumber(result.thermalEfficiency, 6)}
                </code>
                <p className="text-xs text-muted-foreground mt-2">
                  <strong>Nota:</strong> G(t_d) foi calculado no Item A e reaproveitado aqui.
                </p>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="text-lg font-semibold mb-3">Interpretação do Resultado</h3>
          <div className="space-y-3">
            <div className="bg-muted/50 p-3 rounded">
              <p className="text-sm font-medium mb-1">Eficiência Térmica:</p>
              <p className="text-sm text-muted-foreground">
                A eficiência térmica de{" "}
                <strong>
                  {formatNumber(result.thermalEfficiency * 100, 2)}%
                </strong>{" "}
                indica que{" "}
                <strong>
                  {formatNumber(result.thermalEfficiency * 100, 2)}%
                </strong>{" "}
                do calor total injetado é efetivamente armazenado na zona de vapor,
                enquanto{" "}
                <strong>
                  {formatNumber((1 - result.thermalEfficiency) * 100, 2)}%
                </strong>{" "}
                é perdido para as camadas adjacentes.
              </p>
            </div>
            <div className="bg-muted/50 p-3 rounded">
              <p className="text-sm font-medium mb-1">Calor Armazenado:</p>
              <code className="text-xs block text-muted-foreground">
                Q_armazenado = E_t × Q_total ={" "}
                {formatNumber(result.thermalEfficiency, 4)} ×{" "}
                {formatLargeNumber(result.totalHeat_Btu)} Btu ={" "}
                {formatLargeNumber(result.storedHeat_Btu)} Btu
              </code>
            </div>
            <div className="bg-muted/50 p-3 rounded">
              <p className="text-sm font-medium mb-1">Calor Perdido:</p>
              <code className="text-xs block text-muted-foreground">
                Q_perdido = (1 - E_t) × Q_total ={" "}
                {formatNumber(1 - result.thermalEfficiency, 4)} ×{" "}
                {formatLargeNumber(result.totalHeat_Btu)} Btu ={" "}
                {formatLargeNumber(
                  (1 - result.thermalEfficiency) * result.totalHeat_Btu
                )}{" "}
                Btu
              </code>
            </div>
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="text-lg font-semibold mb-3">Resultado Final</h3>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-primary">
              {formatNumber(result.thermalEfficiency, 4)}
            </span>
            <span className="text-lg text-muted-foreground">
              ({formatNumber(result.thermalEfficiency * 100, 2)}%)
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Eficiência térmica calculada para t_d ={" "}
            {formatNumber(result.tDimensionless, 6)}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

