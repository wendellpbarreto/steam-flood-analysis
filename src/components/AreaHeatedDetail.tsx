import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { VariableLink } from "./IntermediateCalculations";
import type { AreaCalculationResult } from "../lib/calculations/area";
import type { PresetData } from "../data/presets";

interface AreaHeatedDetailProps {
  result: AreaCalculationResult;
  presetData: PresetData;
}

export function AreaHeatedDetail({
  result,
  presetData,
}: AreaHeatedDetailProps) {
  const { common } = presetData;

  const formatNumber = (value: number, decimals: number = 2): string => {
    return new Intl.NumberFormat("pt-BR", {
      maximumFractionDigits: decimals,
      minimumFractionDigits: decimals,
    }).format(value);
  };

  const formatLargeNumber = (value: number): string => {
    return new Intl.NumberFormat("pt-BR", {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    }).format(value);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <CardTitle>Área Aquecida</CardTitle>
          <Badge variant="secondary">Item A</Badge>
        </div>
        <CardDescription>
          Cálculo da área aquecida com aplicação da fórmula e valores
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-3">Fundamentação Teórica</h3>
          <div className="space-y-3 mb-4">
            <div className="bg-muted/50 p-3 rounded">
              <p className="text-sm font-medium mb-1">
                Marx & Lengenheim - Fórmula Completa:
              </p>
              <code className="text-xs font-mono block">
                A_s = (H₀ × M₁ × h) / (4 × α₂ × M₂² × (T_s - T_r)) × G(t_d)
              </code>
            </div>
            <div className="bg-muted/50 p-3 rounded">
              <p className="text-sm font-medium mb-1">Onde G(t_d):</p>
              <code className="text-xs font-mono block">
                G(t_d) = e^(t_d) × erfc(√t_d) + 2√(t_d/π) - 1
              </code>
            </div>
            <div className="bg-muted/50 p-3 rounded">
              <p className="text-sm font-medium mb-1">
                Entalpia do Vapor (Hs):
              </p>
              <code className="text-xs font-mono block">
                H_s = (1 - f_s) × H_L + f_s × H_v
              </code>
            </div>
            <div className="bg-muted/50 p-3 rounded">
              <p className="text-sm font-medium mb-1">Taxa de Calor (H₀):</p>
              <code className="text-xs font-mono block">
                H₀ = ṁ × (H_s - h_res)
              </code>
            </div>
          </div>

          <h3 className="text-lg font-semibold mb-3">
            Fórmula da Área Aquecida
          </h3>
          <div className="bg-muted p-4 rounded-lg">
            <code className="text-sm font-mono">
              A_s = (H₀ × M₁ × h) / (4 × α₂ × M₂² × ΔT) × G(t_d)
            </code>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Onde: A_s = Área aquecida (ft²), H₀ = Taxa instantânea de injeção de
            calor (Btu/h), M₁ = Capacidade calorífica volumétrica da zona de
            vapor (Btu/ft³·°F), h = Espessura total do reservatório (ft) = z_t, α₂ =
            Difusividade térmica (ft²/h), M₂ = Capacidade calorífica volumétrica
            das camadas adjacentes (Btu/ft³·°F),{" "}
            <VariableLink variable="ΔT" calculationId="calc-deltaT">
              ΔT
            </VariableLink>{" "}
            = T_s - T_r (°F), G(t_d) = Função de tempo adimensional
          </p>
        </div>

        <Separator />

        <div>
          <h3 className="text-lg font-semibold mb-3">
            Cálculo de H₀ (Taxa de Calor)
          </h3>
          <div className="bg-muted/50 p-4 rounded-lg mb-4 space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">
                  H_L (Entalpia líquida @ P_s):
                </span>
                <span className="text-sm font-mono">
                  {formatNumber(result.HL_BtuPerLb, 2)} Btu/lb
                </span>
              </div>
              <code className="text-xs block text-muted-foreground">
                H_L = entalpia.hf @ P_s = {formatNumber(common.Ps, 2)} psia
                {result.interpolationUsed.pressure && " (interpolado)"}
              </code>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">
                  H_v (Entalpia vapor @ P_s):
                </span>
                <span className="text-sm font-mono">
                  {formatNumber(result.Hv_BtuPerLb, 2)} Btu/lb
                </span>
              </div>
              <code className="text-xs block text-muted-foreground">
                H_v = entalpia.hg @ P_s = {formatNumber(common.Ps, 2)} psia
                {result.interpolationUsed.pressure && " (interpolado)"}
              </code>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">
                  H_s (Entalpia do vapor):
                </span>
                <span className="text-sm font-mono">
                  {formatNumber(result.enthalpySteam_BtuPerLb, 2)} Btu/lb
                </span>
              </div>
              <code className="text-xs block text-muted-foreground">
                H_s = (1 - f_s) × H_L + f_s × H_v
              </code>
              <code className="text-xs block text-muted-foreground mt-1">
                H_s = (1 - {formatNumber(common.fsd, 3)}) ×{" "}
                {formatNumber(result.HL_BtuPerLb, 2)} +{" "}
                {formatNumber(common.fsd, 3)} ×{" "}
                {formatNumber(result.Hv_BtuPerLb, 2)} ={" "}
                {formatNumber(result.enthalpySteam_BtuPerLb, 2)} Btu/lb
              </code>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">
                  h_res (Entalpia do reservatório):
                </span>
                <span className="text-sm font-mono">
                  {formatNumber(result.enthalpyReservoirFromTable_BtuPerLb, 2)}{" "}
                  Btu/lb
                </span>
              </div>
              <code className="text-xs block text-muted-foreground">
                h_res = H_L @ T_r = {formatNumber(common.Tr, 1)}°F
                {result.interpolationUsed.temperature && " (interpolado)"}
              </code>
            </div>

            <div className="pt-2 border-t">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">
                  H_s - h_res (Entalpia efetiva):
                </span>
                <span className="text-sm font-mono font-semibold">
                  {formatNumber(result.Ho_enthalpy_BtuPerLb, 2)} Btu/lb
                </span>
              </div>
              <code className="text-xs block text-muted-foreground">
                H_s - h_res = {formatNumber(result.enthalpySteam_BtuPerLb, 2)} -{" "}
                {formatNumber(result.enthalpyReservoirFromTable_BtuPerLb, 2)} ={" "}
                {formatNumber(result.Ho_enthalpy_BtuPerLb, 2)} Btu/lb
              </code>
            </div>

            <div className="pt-2 border-t bg-primary/5 rounded p-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-semibold">
                  H₀ (Taxa de calor):
                </span>
                <span className="text-sm font-mono font-bold text-primary">
                  {formatLargeNumber(result.Ho_BtuPerHour)} Btu/h
                </span>
              </div>
              <code className="text-xs block text-muted-foreground">
                H₀ = ṁ × (H_s - h_res)
              </code>
              <code className="text-xs block text-muted-foreground mt-1">
                H₀ = {formatLargeNumber(result.massRate_lbPerHour)} lb/h ×{" "}
                {formatNumber(result.Ho_enthalpy_BtuPerLb, 2)} Btu/lb
              </code>
              <code className="text-xs block font-semibold text-primary mt-1">
                H₀ = {formatLargeNumber(result.Ho_BtuPerHour)} Btu/h
              </code>
            </div>

            {(result.interpolationUsed.pressure ||
              result.interpolationUsed.temperature) && (
              <div className="mt-2 p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded text-xs">
                <p className="font-medium text-yellow-800 dark:text-yellow-200">
                  ⚠️ Interpolação utilizada:
                </p>
                {result.interpolationUsed.pressure && (
                  <p className="text-yellow-700 dark:text-yellow-300">
                    • Pressão ({formatNumber(common.Ps, 2)} psia) interpolada
                    entre valores da tabela
                  </p>
                )}
                {result.interpolationUsed.temperature && (
                  <p className="text-yellow-700 dark:text-yellow-300">
                    • Temperatura ({formatNumber(common.Tr, 1)}°F) interpolada
                    entre valores da tabela
                  </p>
                )}
              </div>
            )}
          </div>

          <h3 className="text-lg font-semibold mb-3">Aplicação da Fórmula</h3>
          <div className="bg-primary/10 p-4 rounded-lg border-2 border-primary/20">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">A_s =</span>
                <span className="text-sm font-mono">
                  {formatLargeNumber(result.areaHeated_ft2)} ft²
                </span>
              </div>
              <code className="text-xs block text-muted-foreground">
                A_s = (H₀ × M₁ × h) / (4 × α₂ × M₂² × ΔT) × G(t_d)
              </code>
              <code className="text-xs block text-muted-foreground mt-1">
                A_s = ({formatLargeNumber(result.Ho_BtuPerHour)} ×{" "}
                {formatNumber(common.rho1C1)} × {formatNumber(common.zt)}) / (4
                × {formatNumber(result.alpha2, 4)} ×{" "}
                {formatNumber(common.rho2C2)}² × {formatNumber(result.deltaT)})
                × {formatNumber(result.thermalEfficiency, 4)}
              </code>
              <code className="text-xs block text-muted-foreground mt-1 text-yellow-600 dark:text-yellow-400">
                Nota: h = z_t (espessura total = {formatNumber(common.zt)} ft), não z_n (espessura líquida)
              </code>
              <code className="text-xs block text-muted-foreground mt-1">
                A_s ={" "}
                {formatLargeNumber(
                  result.Ho_BtuPerHour * common.rho1C1 * common.zt
                )}{" "}
                /{" "}
                {formatLargeNumber(
                  4 *
                    result.alpha2 *
                    common.rho2C2 *
                    common.rho2C2 *
                    result.deltaT
                )}{" "}
                × {formatNumber(result.thermalEfficiency, 4)}
              </code>
              <code className="text-xs block text-muted-foreground mt-1 text-yellow-600 dark:text-yellow-400">
                Nota: Usando h = z_t = {formatNumber(common.zt)} ft (espessura total)
              </code>
              <code className="text-xs block font-semibold text-primary mt-2">
                A_s = {formatLargeNumber(result.areaHeated_ft2)} ft²
              </code>
            </div>
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="text-lg font-semibold mb-3">Resultado Final</h3>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-primary">
              {formatLargeNumber(result.areaHeated_ft2)}
            </span>
            <span className="text-lg text-muted-foreground">ft²</span>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Área aquecida calculada para vazão de{" "}
            {formatNumber(result.rateBblPerDay)} bbl/d
            {result.rateTonsPerDay &&
              ` / ${formatNumber(result.rateTonsPerDay, 1)} t/d`}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
