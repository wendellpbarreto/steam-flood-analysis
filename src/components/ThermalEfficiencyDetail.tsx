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

interface ThermalEfficiencyDetailProps {
  result: AreaCalculationResult;
  presetData: PresetData;
}

export function ThermalEfficiencyDetail({
  result,
  presetData,
}: ThermalEfficiencyDetailProps) {
  const { common } = presetData;

  const formatNumber = (value: number, decimals: number = 2): string =>
    new Intl.NumberFormat("pt-BR", {
      maximumFractionDigits: decimals,
      minimumFractionDigits: decimals,
    }).format(value);

  const formatScientific = (value: number): string => value.toExponential(4);

  const formatLargeNumber = (value: number): string =>
    new Intl.NumberFormat("pt-BR", {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    }).format(value);

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
          Cálculo de E_t pela correlação de Myhill &amp; Stegemeier (G(t_d)/t_d)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <section className="space-y-3">
          <h3 className="text-base font-semibold">Fórmula e cálculo principal</h3>
          <div className="bg-primary/10 rounded-lg p-4 border-2 border-primary/20 space-y-2">
            <BlockMath math={"E_t = \\dfrac{G(t_d)}{t_d}"} />
            <BlockMath math={"G(t_d) = e^{t_d}\\,\\mathrm{erfc}(\\sqrt{t_d}) + 2\\sqrt{t_d/\\pi} - 1"} />
            <div className="text-xs text-muted-foreground bg-background/60 rounded p-2 space-y-1">
              <p>t_d = {formatNumber(result.tDimensionless, 6)} → G(t_d) = {formatNumber(result.GTd, 6)}</p>
              <p>
                E_t = <span className="font-semibold text-primary">{formatNumber(result.thermalEfficiency, 6)}</span>
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-2">
          <Accordion>
            <AccordionTrigger>Fundamentação Teórica</AccordionTrigger>
            <AccordionContent className="px-3 pb-3 space-y-2">
              <p className="text-sm">
                <InlineMath math={"E_t = Q_{armazenado}/Q_{tot}"} /> com{" "}
                <InlineMath math={"G(t_d)"} /> obtido de Myhill &amp; Stegemeier.
              </p>
              <p className="text-xs text-muted-foreground">
                Tempo adimensional: <InlineMath math={"t_d = 4 (M_2/M_1)^2 (\\alpha_2/h^2) t"} />, usando h = z_t.
              </p>
            </AccordionContent>
          </Accordion>
        </section>

        <section className="space-y-2">
          <Accordion>
            <AccordionTrigger>Cálculos detalhados</AccordionTrigger>
            <AccordionContent className="px-3 pb-3 space-y-2">
              <div className="text-xs space-y-2">
                <p>α₂ = {formatScientific(result.alpha2)} ft²/h</p>
                <p>t = {formatLargeNumber(tHours)} h ( {formatNumber(common.tYears, 2)} anos )</p>
                <p>t_d = {formatNumber(result.tDimensionless, 6)} · G(t_d) = {formatNumber(result.GTd, 6)}</p>
                <p>E_t = G(t_d)/t_d = {formatNumber(result.thermalEfficiency, 6)}</p>
              </div>
            </AccordionContent>
          </Accordion>
        </section>

        <section className="space-y-2">
          <h3 className="text-base font-semibold">Resultado Final</h3>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-primary">
              E_t = {formatNumber(result.thermalEfficiency, 6)}
            </p>
            <p className="text-sm text-muted-foreground">
              t_d = {formatNumber(result.tDimensionless, 6)} · G(t_d) = {formatNumber(result.GTd, 6)}
            </p>
          </div>
        </section>

        <section className="space-y-2">
          <h3 className="text-base font-semibold">Interpretação do Resultado</h3>
          <p className="text-sm text-muted-foreground">
            E_t indica a fração do calor total que fica armazenada; valores maiores significam menor
            perda para camadas adjacentes e maior eficiência do processo.
          </p>
        </section>
      </CardContent>
    </Card>
  );
}
