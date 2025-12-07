import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionTrigger,
} from "./ui/accordion";
import { BlockMath, InlineMath } from "react-katex";
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

  const formatNumber = (value: number, decimals: number = 2): string =>
    new Intl.NumberFormat("pt-BR", {
      maximumFractionDigits: decimals,
      minimumFractionDigits: decimals,
    }).format(value);

  const formatLargeNumber = (value: number, decimals: number = 2): string =>
    new Intl.NumberFormat("pt-BR", {
      maximumFractionDigits: decimals,
      minimumFractionDigits: decimals,
    }).format(value);

  const formatScientific = (value: number): string => value.toExponential(4);

  const tDays = common.tYears * 365.0;
  const tHours = tDays * 24.0;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <CardTitle>Área Aquecida</CardTitle>
          <Badge variant="secondary">Item A</Badge>
        </div>
        <CardDescription>
          Cálculo de A_s pela fórmula completa de Marx &amp; Lengenheim
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <section className="space-y-3">
          <h3 className="text-base font-semibold">Fórmula e cálculo principal</h3>
          <div className="bg-primary/10 rounded-lg p-4 border-2 border-primary/20 space-y-2">
            <BlockMath math={"A_s = \\dfrac{H_0 \\cdot M_1 \\cdot h}{4\\,\\alpha_2\\,M_2^2\\,\\Delta T}\\;G(t_d)"} />
            <div className="text-xs text-muted-foreground bg-background/60 rounded p-2 space-y-1">
              <p>H₀ = {formatLargeNumber(result.Ho_BtuPerHour)} Btu/h · G(t_d) = {formatNumber(result.GTd, 6)}</p>
              <p>
                Numerador = H₀·M₁·h = {formatScientific(result.Ho_BtuPerHour * common.rho1C1 * common.zt)} ; Denominador = 4·α₂·M₂²·ΔT ={" "}
                {formatScientific(4 * result.alpha2 * common.rho2C2 * common.rho2C2 * result.deltaT)}
              </p>
              <p>
                A_s = <span className="font-semibold text-primary">{formatLargeNumber(result.areaHeated_ft2, 6)} ft²</span>
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-2">
          <Accordion>
            <AccordionTrigger>Fundamentação Teórica</AccordionTrigger>
            <AccordionContent className="px-3 pb-3 space-y-2">
              <p className="text-sm">
                Modelo de Marx &amp; Lengenheim: balanço de energia na zona de vapor.
              </p>
              <p className="text-xs text-muted-foreground">
                <InlineMath math={"G(t_d) = e^{t_d}\\,\\mathrm{erfc}(\\sqrt{t_d}) + 2\\sqrt{t_d/\\pi} - 1"} /> e{" "}
                <InlineMath math={"t_d = 4 (M_2/M_1)^2 (\\alpha_2/h^2) t"} /> com h = z_t.
              </p>
              <p className="text-xs text-muted-foreground">
                H_s = (1 - f_s)·H_L + f_s·H_v; H₀ = ṁ·(H_s - h_res).
              </p>
            </AccordionContent>
          </Accordion>
        </section>

        <section className="space-y-2">
          <Accordion>
            <AccordionTrigger>Cálculos detalhados</AccordionTrigger>
            <AccordionContent className="px-3 pb-3 space-y-2">
              <div className="text-xs space-y-2">
                <p>ΔT = T_s - T_r = {formatNumber(result.deltaT)} °F</p>
                <p>H_s = {formatNumber(result.enthalpySteam_BtuPerLb, 2)} Btu/lb</p>
                <p>h_res = {formatNumber(result.enthalpyReservoirFromTable_BtuPerLb, 2)} Btu/lb → H_s - h_res = {formatNumber(result.Ho_enthalpy_BtuPerLb, 2)} Btu/lb</p>
                <p>ṁ = {formatLargeNumber(result.massRate_lbPerHour)} lb/h → H₀ = {formatLargeNumber(result.Ho_BtuPerHour)} Btu/h</p>
                <p>α₂ = {formatScientific(result.alpha2)} ft²/h · t = {formatLargeNumber(tHours)} h</p>
                <p>t_d = {formatNumber(result.tDimensionless, 6)} · G(t_d) = {formatNumber(result.GTd, 6)}</p>
                <p>M₁ = {formatNumber(common.rho1C1)}; M₂ = {formatNumber(common.rho2C2)}; h = z_t = {formatNumber(common.zt)} ft</p>
              </div>
            </AccordionContent>
          </Accordion>
        </section>

        <section className="space-y-2">
          <h3 className="text-base font-semibold">Resultado Final</h3>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-primary">
              A_s = {formatLargeNumber(result.areaHeated_ft2, 6)} ft²
            </p>
            <p className="text-sm text-muted-foreground">
              Usando H₀ = {formatLargeNumber(result.Ho_BtuPerHour)} Btu/h, G(t_d) = {formatNumber(result.GTd, 6)} e ΔT = {formatNumber(result.deltaT)} °F
            </p>
          </div>
        </section>

        <section className="space-y-2">
          <h3 className="text-base font-semibold">Interpretação do Resultado</h3>
          <p className="text-sm text-muted-foreground">
            A_s indica a extensão da zona aquecida após o período de injeção. Valores maiores
            impactam diretamente N_p, F_os e os demais itens subsequentes.
          </p>
        </section>
      </CardContent>
    </Card>
  );
}
