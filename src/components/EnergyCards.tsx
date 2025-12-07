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
import type { AreaCalculationResult } from "../lib/calculations/area";
import type { PresetData } from "../data/presets";
import { BlockMath, InlineMath } from "react-katex";

interface EnergyCardsProps {
  result: AreaCalculationResult;
  presetData: PresetData;
}

const formatNumber = (value: number, decimals: number = 2): string =>
  new Intl.NumberFormat("pt-BR", {
    maximumFractionDigits: decimals,
    minimumFractionDigits: decimals,
  }).format(value);

const formatLarge = (value: number): string =>
  new Intl.NumberFormat("pt-BR", {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  }).format(value);

export function EnergyCards({ result, presetData }: EnergyCardsProps) {
  const { common } = presetData;
  const lostPercent = (result.lostHeat_Btu / result.totalHeat_Btu) * 100;
  const storedPercent = (result.storedHeat_Btu / result.totalHeat_Btu) * 100;

  return (
    <div className="space-y-6">
      <EnergyLostCard
        lostHeat={result.lostHeat_Btu}
        totalHeat={result.totalHeat_Btu}
        storedHeat={result.storedHeat_Btu}
        lostPercent={lostPercent}
        storedPercent={storedPercent}
      />

      <SteamVolumeCard
        ft3={result.steamVolumeRequired_ft3}
        bbl={result.steamVolumeRequired_bbl}
        deltaHWater={
          (common.CwTs - common.CwTr) + common.fsd * common.Lv
        }
        efficiency={result.thermalEfficiency}
      />

      <OilSteamRatioCard
        fos={result.oilSteamRatio_Fos}
        np={result.oilProduced_Np_bbl}
        v1={result.steamVolumeRequired_bbl}
        deltaS={common.So - common.Sor}
        phi={common.phi}
        zn={common.zn}
      />

      <EquivalentRatioCard
        fose={result.equivalentOilSteamRatio_Fose}
        fos={result.oilSteamRatio_Fos}
        cwDeltaTb={common.CwTs - common.CwTb}
        fSbLv={common.Fsb * common.Lv}
      />

      <EnergyBalanceCard
        index={result.energyBalanceIndex}
        gammaO={common.gammaO}
        efficiencyBoiler={common.Eb}
      />
    </div>
  );
}

function EnergyLostCard({
  lostHeat,
  totalHeat,
  storedHeat,
  lostPercent,
  storedPercent,
}: {
  lostHeat: number;
  totalHeat: number;
  storedHeat: number;
  lostPercent: number;
  storedPercent: number;
}): JSX.Element {
  const efficiency = storedPercent / 100;
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <CardTitle>Energia Perdida</CardTitle>
          <Badge variant="secondary">Item D</Badge>
        </div>
        <CardDescription>
          Energia dissipada para camadas adjacentes durante o período de injeção
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <section className="space-y-3">
          <h3 className="text-base font-semibold">Fórmula e cálculo principal</h3>
          <div className="bg-primary/10 rounded-lg p-4 border-2 border-primary/20 space-y-2">
            <BlockMath math={"Q_l = Q_{tot} \\cdot (1 - E_t)"} />
            <p className="text-xs text-muted-foreground">
              {`E_t = G(t_d)/t_d`} · {`Q_tot = H_0 · t`}
            </p>
            <div className="text-xs text-muted-foreground bg-background/60 rounded p-2 space-y-1">
              <p>Q_tot = {formatLarge(totalHeat)} Btu</p>
              <p>
                E_t = {formatNumber(efficiency, 4)} → Q_arm = {formatLarge(storedHeat)} Btu
              </p>
              <p>
                Q_l = {formatLarge(totalHeat)} × (1 - {formatNumber(efficiency, 4)}) ={" "}
                <span className="font-semibold text-primary">{formatLarge(lostHeat)} Btu</span>
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-2">
        <Accordion>
          <AccordionTrigger>Fundamentação Teórica</AccordionTrigger>
          <AccordionContent className="px-3 pb-3 space-y-2">
              <p className="text-sm mb-2">Balanço energético:</p>
              <p className="text-sm">
                <InlineMath math={"E_t = \\dfrac{Q_{armazenado}}{Q_{tot}}"} /> ⇒{" "}
                <InlineMath math={"Q_l = Q_{tot} - Q_{armazenado} = Q_{tot}(1 - E_t)"} />.
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Q_l representa o calor perdido por condução para camadas adjacentes ao longo
                do tempo de injeção.
              </p>
            </AccordionContent>
          </Accordion>
        </section>

        <section className="space-y-2">
        <Accordion>
          <AccordionTrigger>Cálculos detalhados</AccordionTrigger>
          <AccordionContent className="px-3 pb-3">
              <div className="text-xs space-y-2">
                <p>Q_tot = H₀ · t = {formatLarge(totalHeat)} Btu</p>
                <p>E_t = {formatNumber(efficiency, 4)} (Myhill &amp; Stegemeier)</p>
                <p>Q_arm = E_t · Q_tot = {formatLarge(storedHeat)} Btu</p>
                <p>Q_l = Q_tot - Q_arm = {formatLarge(lostHeat)} Btu</p>
              </div>
            </AccordionContent>
          </Accordion>
        </section>

        <section className="space-y-2">
          <h3 className="text-base font-semibold">Resultado Final</h3>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-primary">
              Q_l = {formatLarge(lostHeat)} Btu
            </p>
            <p className="text-sm text-muted-foreground">
              ({formatNumber(lostPercent, 2)}% do total) · Q_arm = {formatLarge(storedHeat)} Btu (
              {formatNumber(storedPercent, 2)}%)
            </p>
          </div>
        </section>

        <section className="space-y-2">
          <h3 className="text-base font-semibold">Interpretação do Resultado</h3>
          <p className="text-sm text-muted-foreground">
            {formatNumber(lostPercent, 2)}% do calor injetado é perdido por condução;{" "}
            {formatNumber(storedPercent, 2)}% permanece armazenado. Quanto menor Q_l, maior a
            eficiência térmica do processo.
          </p>
        </section>
      </CardContent>
    </Card>
  );
}

function SteamVolumeCard({
  ft3,
  bbl,
  deltaHWater,
  efficiency,
}: {
  ft3: number;
  bbl: number;
  deltaHWater: number;
  efficiency: number;
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <CardTitle>Volume de Vapor Necessário</CardTitle>
          <Badge variant="secondary">Item E</Badge>
        </div>
        <CardDescription>
          V₁ = <span className="font-semibold">{formatLarge(ft3)} ft³</span>{" "}
          ({formatLarge(bbl)} bbl)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <section className="space-y-3">
          <h3 className="text-base font-semibold">Fórmula e cálculo principal</h3>
          <div className="bg-primary/10 rounded-lg p-4 border-2 border-primary/20 space-y-2">
            <BlockMath math={"V_1 = \\dfrac{M_1 \\cdot A_s \\cdot z_t \\cdot \\Delta T}{\\rho_w\\,[C_w (T_s - T_r) + f_{sd} L_v] \\cdot E_t}"} />
            <div className="text-xs text-muted-foreground bg-background/60 rounded p-2 space-y-1">
              <p>Δh_água = {formatNumber(deltaHWater, 3)} Btu/lb</p>
              <p>E_t = {formatNumber(efficiency, 4)}</p>
              <p>
                V₁ = <span className="font-semibold text-primary">{formatLarge(ft3)} ft³</span>{" "}
                ({formatLarge(bbl)} bbl)
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-2">
        <Accordion>
          <AccordionTrigger>Fundamentação Teórica</AccordionTrigger>
          <AccordionContent className="px-3 pb-3 space-y-2">
              <p className="text-sm">
                <InlineMath math={"V_1"} /> é o volume de vapor necessário para fornecer a
                energia armazenada na zona aquecida considerando eficiência térmica e entalpia da água.
              </p>
              <p className="text-xs text-muted-foreground">
                Deriva do balanço energético: calor armazenado = massa de água (em volume equivalente)
                × variação de entalpia / E_t.
              </p>
            </AccordionContent>
          </Accordion>
        </section>

        <section className="space-y-2">
        <Accordion>
          <AccordionTrigger>Cálculos detalhados</AccordionTrigger>
          <AccordionContent className="px-3 pb-3">
              <div className="text-xs space-y-2">
                <p>Δh_água = Cw(T_s - T_r) + f_sd·L_v = {formatNumber(deltaHWater, 3)} Btu/lb</p>
                <p>E_t = {formatNumber(efficiency, 4)} (Myhill &amp; Stegemeier)</p>
                <p>V₁(ft³) = {formatLarge(ft3)} · V₁(bbl) = {formatLarge(bbl)} bbl</p>
              </div>
            </AccordionContent>
          </Accordion>
        </section>

        <section className="space-y-2">
          <h3 className="text-base font-semibold">Resultado Final</h3>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-primary">
              V₁ = {formatLarge(ft3)} ft³
            </p>
            <p className="text-sm text-muted-foreground">
              ({formatLarge(bbl)} bbl) usando Δh_água = {formatNumber(deltaHWater, 3)} Btu/lb e
              E_t = {formatNumber(efficiency, 4)}
            </p>
          </div>
        </section>

        <section className="space-y-2">
          <h3 className="text-base font-semibold">Interpretação do Resultado</h3>
          <p className="text-sm text-muted-foreground">
            Representa o volume de vapor requerido para aquecer a zona aquecida calculada. Valores
            menores indicam menor demanda energética; reduzem com maior E_t ou Δh_água menor.
          </p>
        </section>
      </CardContent>
    </Card>
  );
}

function OilSteamRatioCard({
  fos,
  np,
  v1,
  deltaS,
  phi,
  zn,
}: {
  fos: number;
  np: number;
  v1: number;
  deltaS: number;
  phi: number;
  zn: number;
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <CardTitle>Razão Óleo/Vapor</CardTitle>
          <Badge variant="secondary">Item F</Badge>
        </div>
        <CardDescription>
          F_os = <span className="font-semibold">{formatNumber(fos, 4)}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <section className="space-y-3">
          <h3 className="text-base font-semibold">Fórmula e cálculo principal</h3>
          <div className="bg-primary/10 rounded-lg p-4 border-2 border-primary/20 space-y-2">
            <BlockMath math={"N_p = \\dfrac{A_s \\cdot z_n \\cdot \\phi \\cdot (S_o - S_{or})}{5.615}"} />
            <BlockMath math={"F_{os} = \\dfrac{N_p}{V_1}"} />
            <div className="text-xs text-muted-foreground bg-background/60 rounded p-2 space-y-1">
              <p>ΔS = {formatNumber(deltaS, 3)}, ϕ = {formatNumber(phi, 3)}, z_n = {formatNumber(zn, 1)} ft</p>
              <p>
                N_p = {formatLarge(np)} bbl; V₁ = {formatLarge(v1)} bbl
              </p>
              <p>
                F_os = <span className="font-semibold text-primary">{formatNumber(fos, 4)}</span>
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-2">
        <Accordion>
          <AccordionTrigger>Fundamentação Teórica</AccordionTrigger>
          <AccordionContent className="px-3 pb-3 space-y-2">
              <p className="text-sm">
                <InlineMath math={"N_p"} /> representa o volume de óleo deslocado pela frente térmica.
              </p>
              <p className="text-xs text-muted-foreground">
                Calculado via balanço volumétrico do padrão aquecido (A_s · z_n · ϕ · ΔS). A razão
                óleo/vapor F_os indica a eficiência de produção por volume de vapor injetado.
              </p>
            </AccordionContent>
          </Accordion>
        </section>

        <section className="space-y-2">
        <Accordion>
          <AccordionTrigger>Cálculos detalhados</AccordionTrigger>
          <AccordionContent className="px-3 pb-3">
              <div className="text-xs space-y-2">
                <p>ΔS = S_o - S_or = {formatNumber(deltaS, 3)}</p>
                <p>N_p = {formatLarge(np)} bbl (A_s·z_n·ϕ·ΔS / 5.615)</p>
                <p>V₁ = {formatLarge(v1)} bbl</p>
                <p>F_os = N_p / V₁ = {formatNumber(fos, 4)}</p>
              </div>
            </AccordionContent>
          </Accordion>
        </section>

        <section className="space-y-2">
          <h3 className="text-base font-semibold">Resultado Final</h3>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-primary">F_os = {formatNumber(fos, 4)}</p>
            <p className="text-sm text-muted-foreground">
              N_p = {formatLarge(np)} bbl · V₁ = {formatLarge(v1)} bbl
            </p>
          </div>
        </section>

        <section className="space-y-2">
          <h3 className="text-base font-semibold">Interpretação do Resultado</h3>
          <p className="text-sm text-muted-foreground">
            F_os indica a eficiência volumétrica do vapor na geração de óleo produzido; valores mais
            altos refletem melhor desempenho do processo.
          </p>
        </section>
      </CardContent>
    </Card>
  );
}

function EquivalentRatioCard({
  fose,
  fos,
  cwDeltaTb,
  fSbLv,
}: {
  fose: number;
  fos: number;
  cwDeltaTb: number;
  fSbLv: number;
}) {
  const denominator = cwDeltaTb + fSbLv;
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <CardTitle>ROV Equivalente</CardTitle>
          <Badge variant="secondary">Item G</Badge>
        </div>
        <CardDescription>
          F_ose = <span className="font-semibold">{formatNumber(fose, 4)}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <section className="space-y-3">
          <h3 className="text-base font-semibold">Fórmula e cálculo principal</h3>
          <div className="bg-primary/10 rounded-lg p-4 border-2 border-primary/20 space-y-2">
            <BlockMath math={"F_{ose} = \\dfrac{1000 \\cdot F_{os}}{C_w (T_s - T_b) + F_{sb} L_v}"} />
            <div className="text-xs text-muted-foreground bg-background/60 rounded p-2 space-y-1">
              <p>Denominador = {formatNumber(denominator, 3)} Btu/lb</p>
              <p>
                F_os = {formatNumber(fos, 4)} →{" "}
                <span className="font-semibold text-primary">
                  F_ose = {formatNumber(fose, 4)}
                </span>
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-2">
        <Accordion>
          <AccordionTrigger>Fundamentação Teórica</AccordionTrigger>
          <AccordionContent className="px-3 pb-3 space-y-2">
              <p className="text-sm">
                <InlineMath math={"F_{ose}"} /> normaliza a ROV para um consumo padrão de 1000 Btu/lb
                de água, permitindo comparar casos com diferentes condições de caldeira.
              </p>
              <p className="text-xs text-muted-foreground">
                Usa entalpia na caldeira: <InlineMath math={"C_w (T_s - T_b) + F_{sb} L_v"} />.
              </p>
            </AccordionContent>
          </Accordion>
        </section>

        <section className="space-y-2">
        <Accordion>
          <AccordionTrigger>Cálculos detalhados</AccordionTrigger>
          <AccordionContent className="px-3 pb-3">
              <div className="text-xs space-y-2">
                <p className="font-semibold">Fórmula expandida</p>
                <div className="rounded border bg-muted/40 p-2 space-y-1 font-mono text-[11px]">
                  <p>F_ose = 1000 · F_os / [C_w · (T_s - T_b) + F_sb · L_v]</p>
                  <p>
                    = 1000 · {formatNumber(fos, 6)} / [{formatNumber(cwDeltaTb, 6)} +
                    {formatNumber(fSbLv, 6)}]
                  </p>
                  <p>
                    = 1000 · {formatNumber(fos, 6)} / {formatNumber(denominator, 6)}
                  </p>
                  <p>
                    C_w(T_s - T_b) = {formatNumber(cwDeltaTb, 6)} · (Btu/lb);{" "}
                    F_sb·L_v = {formatNumber(fSbLv, 6)} · (Btu/lb)
                  </p>
                </div>
                <p>F_os = {formatNumber(fos, 4)}</p>
                <p>Denominador = (CwTs - CwTb) + F_sb·L_v = {formatNumber(cwDeltaTb, 6)} + {formatNumber(fSbLv, 6)}</p>
                <p>F_ose = 1000 · {formatNumber(fos, 6)} / {formatNumber(denominator, 6)} = {formatNumber(fose, 6)}</p>
              </div>
            </AccordionContent>
          </Accordion>
        </section>

        <section className="space-y-2">
          <h3 className="text-base font-semibold">Resultado Final</h3>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-primary">F_ose = {formatNumber(fose, 4)}</p>
            <p className="text-sm text-muted-foreground">
              F_os = {formatNumber(fos, 4)} · Denominador = {formatNumber(cwDeltaTb + fSbLv, 3)} Btu/lb
            </p>
          </div>
        </section>

        <section className="space-y-2">
          <h3 className="text-base font-semibold">Interpretação do Resultado</h3>
          <p className="text-sm text-muted-foreground">
            F_ose facilita comparação entre cenários ao normalizar a energia do vapor; valores mais
            altos indicam melhor retorno de óleo por unidade energética ajustada.
          </p>
        </section>
      </CardContent>
    </Card>
  );
}

function EnergyBalanceCard({
  index,
  gammaO,
  efficiencyBoiler,
}: {
  index: number;
  gammaO: number;
  efficiencyBoiler: number;
}) {
  const coefficient = 13.1 * gammaO + 5.6;
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <CardTitle>Balanço de Energia</CardTitle>
          <Badge variant="secondary">Item H</Badge>
        </div>
        <CardDescription>
          E_d = <span className="font-semibold">{formatNumber(index, 4)}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <section className="space-y-3">
          <h3 className="text-base font-semibold">Fórmula e cálculo principal</h3>
          <div className="bg-primary/10 rounded-lg p-4 border-2 border-primary/20 space-y-2">
            <BlockMath math={"E_d = (13{,}1\\,\\gamma_o + 5{,}6)\\,E_b\\,F_{ose}"} />
            <div className="text-xs text-muted-foreground bg-background/60 rounded p-2 space-y-1">
              <p>γ_o = {formatNumber(gammaO, 3)} · E_b = {formatNumber(efficiencyBoiler, 3)}</p>
              <p>F_ose = {formatNumber(index / (efficiencyBoiler * coefficient), 6)}</p>
              <p>
                E_d = (13,1·{formatNumber(gammaO, 3)} + 5,6) · {formatNumber(efficiencyBoiler, 3)} · F_ose
                = <span className="font-semibold text-primary">{formatNumber(index, 4)}</span>
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-2">
        <Accordion>
          <AccordionTrigger>Fundamentação Teórica</AccordionTrigger>
          <AccordionContent className="px-3 pb-3 space-y-2">
              <p className="text-sm">
                Índice de balanço energético compara a energia contida no óleo produzido com a
                energia requerida no gerador.
              </p>
              <p className="text-xs text-muted-foreground">
                Valores &gt; 1 indicam que a energia do óleo supera a energia térmica injetada,
                ajustada pela eficiência do gerador.
              </p>
            </AccordionContent>
          </Accordion>
        </section>

        <section className="space-y-2">
        <Accordion>
          <AccordionTrigger>Cálculos detalhados</AccordionTrigger>
          <AccordionContent className="px-3 pb-3">
              <div className="text-xs space-y-2">
                <p>Coeficiente = 13,1·γ_o + 5,6 = {formatNumber(coefficient, 6)}</p>
                <p>F_ose (calculado) = {formatNumber(index / (efficiencyBoiler * coefficient), 6)}</p>
                <p>E_d = {formatNumber(coefficient, 6)} · {formatNumber(efficiencyBoiler, 6)} · F_ose = {formatNumber(index, 6)}</p>
              </div>
            </AccordionContent>
          </Accordion>
        </section>

        <section className="space-y-2">
          <h3 className="text-base font-semibold">Resultado Final</h3>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-primary">E_d = {formatNumber(index, 4)}</p>
            <p className="text-sm text-muted-foreground">
              E_d = (13,1·γ_o + 5,6) · E_b · F_ose
            </p>
          </div>
        </section>

        <section className="space-y-2">
          <h3 className="text-base font-semibold">Interpretação do Resultado</h3>
          <p className="text-sm text-muted-foreground">
            Mede o retorno energético do processo. Valores maiores indicam melhor aproveitamento do
            calor injetado, considerando eficiência do gerador.
          </p>
        </section>
      </CardContent>
    </Card>
  );
}
