import * as React from "react";
import { Badge } from "./ui/badge";
import { Accordion, AccordionContent, AccordionTrigger } from "./ui/accordion";
import type { AreaCalculationResult } from "../lib/calculations/area";
import type { PresetData } from "../data/presets";

interface IntermediateCalculationsProps {
  result: AreaCalculationResult;
  presetData: PresetData;
}

export function IntermediateCalculations({
  result,
  presetData,
}: IntermediateCalculationsProps) {
  const { common } = presetData;

  const formatNumber = (value: number, decimals: number = 2): string => {
    return new Intl.NumberFormat("pt-BR", {
      maximumFractionDigits: decimals,
      minimumFractionDigits: decimals,
    }).format(value);
  };

  const formatLargeNumber = (value: number, decimals: number = 2): string => {
    return new Intl.NumberFormat("pt-BR", {
      maximumFractionDigits: decimals,
      minimumFractionDigits: decimals,
    }).format(value);
  };

  return (
    <Accordion defaultOpen={false}>
      <AccordionTrigger>
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold">Cálculos Intermediários</span>
          <Badge variant="outline" className="text-xs">
            Reutilizados
          </Badge>
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <div className="space-y-4 px-4">
          <div
            id="calc-deltaT"
            className="bg-muted/50 p-3 rounded transition-all"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium">
                Variação de Temperatura (ΔT)
              </span>
              <span className="text-sm font-mono">
                {formatNumber(result.deltaT)} °F
              </span>
            </div>
            <code className="text-xs text-muted-foreground">
              ΔT = T_s - T_r = {formatNumber(common.Ts)} -{" "}
              {formatNumber(common.Tr)} = {formatNumber(result.deltaT)} °F
            </code>
          </div>

          <div id="calc-HL" className="bg-muted/50 p-3 rounded transition-all">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium">
                Entalpia Líquida (H_L)
              </span>
              <span className="text-sm font-mono">
                {formatNumber(result.HL_BtuPerLb, 2)} Btu/lb
              </span>
            </div>
            <code className="text-xs text-muted-foreground">
              H_L = entalpia.hf @ P_s = {formatNumber(common.Ps, 2)} psia
              {result.interpolationUsed.pressure && " (interpolado)"}
            </code>
          </div>

          <div id="calc-Hv" className="bg-muted/50 p-3 rounded transition-all">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium">Entalpia Vapor (H_v)</span>
              <span className="text-sm font-mono">
                {formatNumber(result.Hv_BtuPerLb, 2)} Btu/lb
              </span>
            </div>
            <code className="text-xs text-muted-foreground">
              H_v = entalpia.hg @ P_s = {formatNumber(common.Ps, 2)} psia
              {result.interpolationUsed.pressure && " (interpolado)"}
            </code>
          </div>

          <div
            id="calc-enthalpySteam"
            className="bg-muted/50 p-3 rounded transition-all"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium">
                Entalpia do Vapor (H_s)
              </span>
              <span className="text-sm font-mono">
                {formatNumber(result.enthalpySteam_BtuPerLb, 2)} Btu/lb
              </span>
            </div>
            <code className="text-xs text-muted-foreground">
              H_s = (1 - f_s) × H_L + f_s × H_v
            </code>
            <code className="text-xs text-muted-foreground block mt-1">
              H_s = (1 - {formatNumber(common.fsd, 3)}) ×{" "}
              {formatNumber(result.HL_BtuPerLb, 2)} +{" "}
              {formatNumber(common.fsd, 3)} ×{" "}
              {formatNumber(result.Hv_BtuPerLb, 2)}
            </code>
            <code className="text-xs text-muted-foreground block mt-1">
              H_s = {formatNumber((1 - common.fsd) * result.HL_BtuPerLb, 2)} +{" "}
              {formatNumber(common.fsd * result.Hv_BtuPerLb, 2)} ={" "}
              {formatNumber(result.enthalpySteam_BtuPerLb, 2)} Btu/lb
            </code>
          </div>

          <div
            id="calc-enthalpyReservoir"
            className="bg-muted/50 p-3 rounded transition-all"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium">
                Entalpia do Reservatório (h_res)
              </span>
              <span className="text-sm font-mono">
                {formatNumber(result.enthalpyReservoirFromTable_BtuPerLb, 2)}{" "}
                Btu/lb
              </span>
            </div>
            <code className="text-xs text-muted-foreground">
              h_res = H_L @ T_r = {formatNumber(common.Tr, 1)}°F
              {result.interpolationUsed.temperature && " (interpolado)"}
            </code>
          </div>

          <div
            id="calc-HoEnthalpy"
            className="bg-muted/50 p-3 rounded transition-all"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium">
                Entalpia Efetiva (H_s - h_res)
              </span>
              <span className="text-sm font-mono">
                {formatNumber(result.Ho_enthalpy_BtuPerLb, 6)} Btu/lb
              </span>
            </div>
            <code className="text-xs text-muted-foreground">
              H_s - h_res = {formatNumber(result.enthalpySteam_BtuPerLb, 6)} -{" "}
              {formatNumber(result.enthalpyReservoirFromTable_BtuPerLb, 6)} ={" "}
              {formatNumber(result.Ho_enthalpy_BtuPerLb, 6)} Btu/lb
            </code>
          </div>

          <div id="calc-Ho" className="bg-muted/50 p-3 rounded transition-all">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium">Taxa de Calor (H₀)</span>
              <span className="text-sm font-mono">
                {formatLargeNumber(result.Ho_BtuPerHour, 6)} Btu/h
              </span>
            </div>
            <code className="text-xs text-muted-foreground">
              H₀ = ṁ × (H_s - h_res)
            </code>
            <code className="text-xs text-muted-foreground block mt-1">
              H₀ = {formatLargeNumber(result.massRate_lbPerHour, 6)} lb/h ×{" "}
              {formatNumber(result.Ho_enthalpy_BtuPerLb, 6)} Btu/lb
            </code>
            <code className="text-xs text-muted-foreground block mt-1 font-semibold">
              H₀ = {formatLargeNumber(result.Ho_BtuPerHour, 6)} Btu/h
            </code>
          </div>

          <div
            id="calc-massRate"
            className="bg-muted/50 p-3 rounded transition-all"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium">Taxa Mássica (ṁ)</span>
              <span className="text-sm font-mono">
                {formatLargeNumber(result.massRate_lbPerHour, 6)} lb/h
              </span>
            </div>
            <code className="text-xs text-muted-foreground">
              ṁ = rateBblPerDay × 350 / 24 ={" "}
              {formatNumber(result.rateBblPerDay)} × 350 / 24 ={" "}
              {formatLargeNumber(result.massRate_lbPerHour, 6)} lb/h
            </code>
          </div>

          <div
            id="calc-timeHours"
            className="bg-muted/50 p-3 rounded transition-all"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium">Tempo Total (t_h)</span>
              <span className="text-sm font-mono">
                {formatLargeNumber(common.tYears * 365 * 24)} h
              </span>
            </div>
            <code className="text-xs text-muted-foreground">
              t_h = t_years × 365 × 24 = {formatNumber(common.tYears, 1)} × 365
              × 24 = {formatLargeNumber(common.tYears * 365 * 24)} h
            </code>
          </div>

          <div
            id="calc-totalHeat"
            className="bg-muted/50 p-3 rounded transition-all"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium">
                Calor Total Injetado (Q_tot)
              </span>
              <span className="text-sm font-mono">
                {formatLargeNumber(result.totalHeat_Btu)} Btu
              </span>
            </div>
            <code className="text-xs text-muted-foreground">
              Q_tot = H₀ × t_h = {formatLargeNumber(result.Ho_BtuPerHour)} ×{" "}
              {formatLargeNumber(common.tYears * 365 * 24)} ={" "}
              {formatLargeNumber(result.totalHeat_Btu)} Btu
            </code>
          </div>

          <div
            id="calc-alpha2"
            className="bg-muted/50 p-3 rounded transition-all"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium">
                Difusividade Térmica (α₂)
              </span>
              <span className="text-sm font-mono">
                {formatNumber(result.alpha2, 4)} ft²/h
              </span>
            </div>
            <code className="text-xs text-muted-foreground">
              α₂ = K₂ / M₂ = {formatNumber(common.K2, 1)} /{" "}
              {formatNumber(common.rho2C2)} = {formatNumber(result.alpha2, 4)}{" "}
              ft²/h
            </code>
          </div>

          <div
            id="calc-tDimensionless"
            className="bg-muted/50 p-3 rounded transition-all"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium">
                Tempo Adimensional (t_d)
              </span>
              <span className="text-sm font-mono">
                {formatLargeNumber(result.tDimensionless)}
              </span>
            </div>
            <code className="text-xs text-muted-foreground">
              t_d = (α₂ × t_h × 3600) / z_n² = ({formatNumber(result.alpha2, 4)}{" "}
              × {formatLargeNumber(common.tYears * 365 * 24)} × 3600) /{" "}
              {formatNumber(common.zn)}² ={" "}
              {formatLargeNumber(result.tDimensionless)}
            </code>
          </div>

          <div
            id="calc-thermalEfficiency"
            className="bg-muted/50 p-3 rounded transition-all"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium">
                Eficiência Térmica (E_t)
              </span>
              <span className="text-sm font-mono">
                {formatNumber(result.thermalEfficiency, 4)}
              </span>
            </div>
            <code className="text-xs text-muted-foreground">
              E_t = G(t_d) = Calculado via correlação Myhill & Stegemeier para
              t_d = {formatLargeNumber(result.tDimensionless)}
            </code>
          </div>

          <div
            id="calc-storedHeat"
            className="bg-muted/50 p-3 rounded transition-all"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium">
                Calor Armazenado (Q_armazenado)
              </span>
              <span className="text-sm font-mono">
                {formatLargeNumber(result.storedHeat_Btu)} Btu
              </span>
            </div>
            <code className="text-xs text-muted-foreground">
              Q_armazenado = E_t × Q_tot ={" "}
              {formatNumber(result.thermalEfficiency, 4)} ×{" "}
              {formatLargeNumber(result.totalHeat_Btu)} ={" "}
              {formatLargeNumber(result.storedHeat_Btu)} Btu
            </code>
          </div>
        </div>
      </AccordionContent>
    </Accordion>
  );
}

export function VariableLink({
  variable,
  calculationId,
  children,
}: {
  variable: string;
  calculationId: string;
  children: React.ReactNode;
}) {
  const scrollToCalculation = () => {
    const accordionTrigger = document.querySelector(
      "[data-accordion-trigger]"
    ) as HTMLButtonElement | null;

    if (accordionTrigger) {
      const isOpen = accordionTrigger.getAttribute("data-state") === "open";

      if (!isOpen) {
        accordionTrigger.click();
        setTimeout(() => {
          scrollToElement();
        }, 300);
      } else {
        scrollToElement();
      }
    } else {
      scrollToElement();
    }
  };

  const scrollToElement = () => {
    const element = document.getElementById(calculationId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      element.classList.add(
        "ring-2",
        "ring-primary",
        "ring-offset-2",
        "rounded"
      );
      setTimeout(() => {
        element.classList.remove(
          "ring-2",
          "ring-primary",
          "ring-offset-2",
          "rounded"
        );
      }, 2000);
    }
  };

  return (
    <button
      onClick={scrollToCalculation}
      className="text-primary hover:text-primary/80 underline decoration-dotted cursor-pointer font-mono text-xs transition-colors"
      title={`Clique para ver cálculo de ${variable}`}
    >
      {children}
    </button>
  );
}
