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

interface CriticalTimeDetailProps {
  result: AreaCalculationResult;
  presetData: PresetData;
}

export function CriticalTimeDetail({
  result,
  presetData,
}: CriticalTimeDetailProps) {
  const { common } = presetData;
  const { criticalTime } = result;

  const formatNumber = (value: number, decimals: number = 2): string =>
    new Intl.NumberFormat("pt-BR", {
      maximumFractionDigits: decimals,
      minimumFractionDigits: decimals,
    }).format(value);

  const formatScientific = (value: number): string => value.toExponential(4);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <CardTitle>Tempo Crítico</CardTitle>
          <Badge variant="secondary">Item B</Badge>
        </div>
        <CardDescription>
          Cálculo de t_c (Mandl &amp; Volek) via G₁, fhv e t_cd
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <section className="space-y-3">
          <h3 className="text-base font-semibold">Fórmula e cálculo principal</h3>
          <div className="bg-primary/10 rounded-lg p-4 border-2 border-primary/20 space-y-2">
            <BlockMath math={"G_1(t_{cD}) = e^{t_{cD}}\\,\\mathrm{erfc}(\\sqrt{t_{cD}}) = 1 - \\dfrac{f_{sd} L_v}{H_s}"} />
            <BlockMath math={"t_c = \\dfrac{t_{cD} \\cdot z_n^2}{\\alpha_2}"} />
            <div className="text-xs text-muted-foreground bg-background/60 rounded p-2 space-y-1">
              <p>G₁ = {formatNumber(criticalTime.G1_value, 6)} → t_cD = {formatNumber(criticalTime.tcd_from_table, 6)} (tabela fhv–tcd)</p>
              <p>
                t_c = <span className="font-semibold text-primary">
                  {formatNumber(criticalTime.criticalTime_days, 2)} dias
                </span>{" "}
                ({formatNumber(criticalTime.criticalTime_hours, 2)} h)
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-2">
          <Accordion>
            <AccordionTrigger>Fundamentação Teórica</AccordionTrigger>
            <AccordionContent className="px-3 pb-3 space-y-2">
              <p className="text-sm">
                Mandl &amp; Volek: <InlineMath math={"G_1(t_{cD}) = e^{t_{cD}}\\,\\mathrm{erfc}(\\sqrt{t_{cD}})"} /> e
                correlação fhv → t_cd. Escala final: <InlineMath math={"t_c = t_{cD} z_n^2 / \\alpha_2"} />.
              </p>
              <p className="text-xs text-muted-foreground">
                G₁ depende de H_s e f_sd; α₂ = K₂/(ρ₂C₂); z_n é a espessura líquida aquecida.
              </p>
            </AccordionContent>
          </Accordion>
        </section>

        <section className="space-y-2">
          <Accordion>
            <AccordionTrigger>Cálculos detalhados</AccordionTrigger>
            <AccordionContent className="px-3 pb-3 space-y-2">
              <div className="text-xs space-y-2">
                <p>H_s = {formatNumber(result.enthalpySteam_BtuPerLb, 2)} Btu/lb</p>
                <p>h_res = entalpia @ T_r → {formatNumber(result.enthalpyReservoirFromTable_BtuPerLb, 2)} Btu/lb</p>
                <p>H_s,eff = H_s - h_res = {formatNumber(result.Ho_enthalpy_BtuPerLb, 2)} Btu/lb</p>
                <p>G₁ = 1 - (f_sd·L_v)/H_s,eff = {formatNumber(criticalTime.G1_value, 6)}</p>
                <p>FHV (planilha) = f_sd·(H_v - H_L)/H_s,eff = {formatNumber(criticalTime.fhv, 6)}</p>
                <p>t_cD (tabela fhv–tcd) = {formatNumber(criticalTime.tcd_from_table, 6)}</p>
                <p>α₂ = {formatScientific(criticalTime.alpha2)} ft²/h; h = z_n = {formatNumber(common.zn)} ft</p>
                <p>t_c usa t_cd como t_d: t = t_cd / [4(M₂/M₁)²(α₂/h²)]</p>
                <p>t_c = {formatNumber(criticalTime.criticalTime_days, 2)} dias = {formatNumber(criticalTime.criticalTime_hours, 2)} h</p>
              </div>
            </AccordionContent>
          </Accordion>
        </section>

        <section className="space-y-2">
          <h3 className="text-base font-semibold">Resultado Final</h3>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-primary">
              t_c = {formatNumber(criticalTime.criticalTime_days, 2)} dias
            </p>
            <p className="text-sm text-muted-foreground">
              = {formatNumber(criticalTime.criticalTime_hours, 2)} h, usando t_cD = {formatNumber(criticalTime.tcd_from_table, 6)} e z_n = {formatNumber(common.zn)} ft
            </p>
          </div>
        </section>

        <section className="space-y-2">
          <h3 className="text-base font-semibold">Interpretação do Resultado</h3>
          <p className="text-sm text-muted-foreground">
            Marca o ponto crítico de avanço da frente térmica. Valores maiores indicam tempos mais longos
            para atingir a condição correlacionada; depende de f_sd, H_s, α₂ e z_n.
          </p>
        </section>
      </CardContent>
    </Card>
  );
}
