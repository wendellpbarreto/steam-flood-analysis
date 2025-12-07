import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
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

  const formatNumber = (value: number, decimals: number = 2): string => {
    return new Intl.NumberFormat("pt-BR", {
      maximumFractionDigits: decimals,
      minimumFractionDigits: decimals,
    }).format(value);
  };

  const formatScientific = (value: number): string => {
    return value.toExponential(4);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <CardTitle>Tempo Crítico</CardTitle>
          <Badge variant="secondary">Item B</Badge>
        </div>
        <CardDescription>
          Cálculo do tempo crítico usando correlações de Mandl & Volek
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-3">Fundamentação Teórica</h3>
          <div className="space-y-3 mb-4">
            <div className="bg-muted/50 p-3 rounded">
              <p className="text-sm font-medium mb-1">
                Mandl & Volek - Fórmula do Tempo Crítico:
              </p>
              <code className="text-xs font-mono block">
                e^(t_cD) × erfc(√t_cD) = (1 - (f_sd × L_v) / H_s)
              </code>
            </div>
            <div className="bg-muted/50 p-3 rounded">
              <p className="text-sm font-medium mb-1">Onde:</p>
              <code className="text-xs font-mono block">
                G_1(t_cD) = e^(t_cD) × erfc(√t_cD)
              </code>
            </div>
            <div className="bg-muted/50 p-3 rounded">
              <p className="text-sm font-medium mb-1">
                Tempo Crítico Adimensional:
              </p>
              <code className="text-xs font-mono block">
                t_cd = lookup(FHV) via tabela Mandl & Volek
              </code>
            </div>
            <div className="bg-muted/50 p-3 rounded">
              <p className="text-sm font-medium mb-1">Tempo Crítico:</p>
              <code className="text-xs font-mono block">
                t_c = (t_cd × z_n²) / α_2
              </code>
            </div>
          </div>

          <h3 className="text-lg font-semibold mb-3">
            Fórmula do Tempo Crítico
          </h3>
          <div className="bg-muted p-4 rounded-lg">
            <code className="text-sm font-mono">t_c = (t_cd × z_n²) / α_2</code>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Onde: t_c = Tempo crítico (anos), t_cd = Tempo crítico adimensional
            (obtido da tabela Mandl & Volek), z_n = Espessura líquida (ft), α_2
            = Difusividade térmica (ft²/h)
          </p>
        </div>

        <Separator />

        <div>
          <h3 className="text-lg font-semibold mb-3">
            Cálculo de G_1 (Lado Direito da Equação)
          </h3>
          <div className="space-y-4">
            <div className="bg-primary/10 p-4 rounded-lg border-2 border-primary/20">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    G_1 = (1 - (f_sd × L_v) / H_s)
                  </span>
                  <span className="text-sm font-mono">
                    {formatNumber(criticalTime.G1_value, 6)}
                  </span>
                </div>
                <code className="text-xs block text-muted-foreground">
                  G_1 = 1 - ({formatNumber(common.fsd, 3)} ×{" "}
                  {formatNumber(common.Lv, 2)}) /{" "}
                  {formatNumber(result.enthalpySteam_BtuPerLb, 2)}
                </code>
                <code className="text-xs block text-muted-foreground mt-1">
                  G_1 = 1 -{" "}
                  {formatNumber(
                    (common.fsd * common.Lv) / result.enthalpySteam_BtuPerLb,
                    6
                  )}{" "}
                  = {formatNumber(criticalTime.G1_value, 6)}
                </code>
              </div>
            </div>

            <div className="bg-primary/10 p-4 rounded-lg border-2 border-primary/20">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    Difusividade Térmica (α_2):
                  </span>
                  <span className="text-sm font-mono">
                    {formatScientific(criticalTime.alpha2)} ft²/h
                  </span>
                </div>
                <code className="text-xs block text-muted-foreground">
                  α_2 = K_2 / (ρ_2 × C_2) = {formatNumber(common.K2)} / (
                  {formatNumber(common.rho2C2)})
                </code>
                <code className="text-xs block font-semibold text-primary mt-1">
                  α_2 = {formatScientific(criticalTime.alpha2)} ft²/h
                </code>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="text-lg font-semibold mb-3">
            Busca de t_cD na Tabela Mandl & Volek
          </h3>
          <div className="space-y-4">
            <div className="bg-primary/10 p-4 rounded-lg border-2 border-primary/20">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    t_cD (calculado via busca numérica):
                  </span>
                  <span className="text-sm font-mono">
                    {formatNumber(criticalTime.tcd_calculated, 6)}
                  </span>
                </div>
                <code className="text-xs block text-muted-foreground">
                  Encontrado t_cD tal que G_1(t_cD) ={" "}
                  {formatNumber(criticalTime.G1_value, 6)}
                </code>
              </div>
            </div>

            <div className="bg-primary/10 p-4 rounded-lg border-2 border-primary/20">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Parâmetro FHV:</span>
                  <span className="text-sm font-mono">
                    {formatNumber(criticalTime.fhv, 6)}
                  </span>
                </div>
                <code className="text-xs block text-muted-foreground">
                  FHV = √t_cD / (1 + √t_cD)
                </code>
                <code className="text-xs block text-muted-foreground mt-1">
                  FHV = √{formatNumber(criticalTime.tcd_calculated, 6)} / (1 + √
                  {formatNumber(criticalTime.tcd_calculated, 6)})
                </code>
                <code className="text-xs block font-semibold text-primary mt-1">
                  FHV = {formatNumber(criticalTime.fhv, 6)}
                </code>
              </div>
            </div>

            <div className="bg-primary/10 p-4 rounded-lg border-2 border-primary/20">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    t_cd (da tabela Mandl & Volek):
                  </span>
                  <span className="text-sm font-mono">
                    {formatNumber(criticalTime.tcd_from_table, 6)}
                  </span>
                </div>
                <code className="text-xs block text-muted-foreground">
                  t_cd = lookup(FHV) via correlação Mandl & Volek
                </code>
                <code className="text-xs block text-muted-foreground mt-1">
                  Para FHV = {formatNumber(criticalTime.fhv, 6)}, t_cd ={" "}
                  {formatNumber(criticalTime.tcd_from_table, 6)}
                  {criticalTime.interpolationUsed && " (interpolado)"}
                </code>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="text-lg font-semibold mb-3">
            Cálculo do Tempo Crítico
          </h3>
          <div className="bg-primary/10 p-4 rounded-lg border-2 border-primary/20">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Tempo Crítico:</span>
                <span className="text-sm font-mono">
                  {formatNumber(criticalTime.criticalTime_years, 4)} anos
                </span>
              </div>
              <code className="text-xs block text-muted-foreground">
                t_c = (t_cd × z_n²) / α_2
              </code>
              <code className="text-xs block text-muted-foreground mt-1">
                t_c = ({formatNumber(criticalTime.tcd_from_table, 6)} × (
                {formatNumber(common.zn)} ft)²) /{" "}
                {formatScientific(criticalTime.alpha2)} ft²/h
              </code>
              <code className="text-xs block text-muted-foreground mt-1">
                t_c = ({formatNumber(criticalTime.tcd_from_table, 6)} ×{" "}
                {formatNumber(common.zn * common.zn)} ft²) /{" "}
                {formatScientific(criticalTime.alpha2)} ft²/h
              </code>
              <code className="text-xs block font-semibold text-primary mt-1">
                t_c = {formatNumber(criticalTime.criticalTime_years, 4)} anos ={" "}
                {formatNumber(criticalTime.criticalTime_days, 2)} dias ={" "}
                {formatNumber(criticalTime.criticalTime_hours, 2)} horas
              </code>
            </div>
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="text-lg font-semibold mb-3">Resultado Final</h3>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-primary">
              {formatNumber(criticalTime.criticalTime_days, 2)}
            </span>
            <span className="text-lg text-muted-foreground">dias</span>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Tempo crítico calculado:{" "}
            {formatNumber(criticalTime.criticalTime_years, 4)} anos /{" "}
            {formatNumber(criticalTime.criticalTime_days, 2)} dias /{" "}
            {formatNumber(criticalTime.criticalTime_hours, 2)} horas
          </p>
          {criticalTime.interpolationUsed && (
            <div className="mt-2 p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded text-xs">
              <p className="font-medium text-yellow-800 dark:text-yellow-200">
                ⚠️ Interpolação utilizada na tabela Mandl & Volek
              </p>
              <p className="text-yellow-700 dark:text-yellow-300">
                FHV ({formatNumber(criticalTime.fhv, 6)}) interpolado entre
                valores da tabela
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
