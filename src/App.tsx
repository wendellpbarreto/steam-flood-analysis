import { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { PresetLoader } from "./components/PresetLoader";
import { ReservoirForm } from "./components/ReservoirForm";
import { SteamRateCases } from "./components/SteamRateCases";
import { AreaHeatedDetail } from "./components/AreaHeatedDetail";
import { CriticalTimeDetail } from "./components/CriticalTimeDetail";
import { ThermalEfficiencyDetail } from "./components/ThermalEfficiencyDetail";
import { IntermediateCalculations } from "./components/IntermediateCalculations";
import { EnergyCards } from "./components/EnergyCards";
import { Alert, AlertDescription, AlertTitle } from "./components/ui/alert";
import { Badge } from "./components/ui/badge";
import { serigadoIVPreset, type PresetData } from "./data/presets";
import {
  calculateAllCases,
  type AreaCalculationResult,
} from "./lib/calculations/area";

function App() {
  const [presetLoaded, setPresetLoaded] = useState(false);
  const [data, setData] = useState<PresetData | null>(null);
  const [results, setResults] = useState<AreaCalculationResult[]>([]);
  const [caseWindowStart, setCaseWindowStart] = useState(0);

  useEffect(() => {
    const preset = serigadoIVPreset.data;
    setData(preset);
    setPresetLoaded(true);
  }, []);

  useEffect(() => {
    if (data) {
      const calculatedResults = calculateAllCases(data);
      setResults(calculatedResults);
      if (caseWindowStart >= calculatedResults.length) {
        setCaseWindowStart(Math.max(0, calculatedResults.length - 2));
      }
    }
  }, [data, caseWindowStart]);

  const loadPreset = () => {
    const preset = serigadoIVPreset.data;
    setData(preset);
    setPresetLoaded(true);
  };

  const handleDataChange = (newData: PresetData) => {
    setData(newData);
  };

  const handleCasesChange = (cases: PresetData["cases"]) => {
    if (data) {
      setData({ ...data, cases });
    }
  };

  const visibleCases = results.slice(
    caseWindowStart,
    Math.min(results.length, caseWindowStart + 2)
  );

  const handlePrevWindow = () => {
    if (results.length <= 2) return;
    setCaseWindowStart((prev) =>
      prev - 2 >= 0 ? prev - 2 : Math.max(0, results.length - 2)
    );
  };

  const handleNextWindow = () => {
    if (results.length <= 2) return;
    setCaseWindowStart((prev) =>
      prev + 2 < results.length ? prev + 2 : 0
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <PresetLoader
            onLoadPreset={loadPreset}
            presetName={presetLoaded ? "Serigado IV" : undefined}
          />

          {presetLoaded && data && (
            <div className="grid gap-6 xl:grid-cols-[1.6fr_1.2fr]">
              <ReservoirForm data={data} onDataChange={handleDataChange} />
              <SteamRateCases
                cases={data.cases}
                onCasesChange={handleCasesChange}
              />
            </div>
          )}

          {presetLoaded && results.length > 0 && data && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Resultados dos Cálculos</h2>

              <div className="bg-primary/10 p-6 rounded-lg border-2 border-primary/20 mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="text-xl font-bold mb-1">Comparação de casos</h3>
                  <p className="text-sm text-muted-foreground">
                    Visualize dois casos lado a lado; use as setas para alternar quando houver mais de 2.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    className="px-3 py-2 rounded border bg-background hover:bg-muted transition"
                    onClick={handlePrevWindow}
                    aria-label="Casos anteriores"
                  >
                    ←
                  </button>
                  <span className="text-sm font-semibold">
                    Casos {caseWindowStart + 1}
                    {visibleCases.length === 2 && ` e ${caseWindowStart + 2}`} de {results.length}
                  </span>
                  <button
                    className="px-3 py-2 rounded border bg-background hover:bg-muted transition"
                    onClick={handleNextWindow}
                    aria-label="Próximos casos"
                  >
                    →
                  </button>
                </div>
              </div>

              <div className="space-y-10">
                {visibleCases.map((result, idx) => (
                  <div key={`${result.caseName}-${idx}`} className="space-y-8">
                    <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
                      <div className="flex flex-wrap items-center gap-3">
                        <h4 className="text-lg font-bold">{result.caseName}</h4>
                        <Badge variant="default" className="text-sm px-3 py-1">
                          Vazão: {result.rateBblPerDay} bbl/d
                          {result.rateTonsPerDay && ` / ${result.rateTonsPerDay.toFixed(1)} t/d`}
                        </Badge>
                      </div>
                    </div>

                    <IntermediateCalculations result={result} presetData={data} />
                    <AreaHeatedDetail result={result} presetData={data} />
                    <CriticalTimeDetail result={result} presetData={data} />
                    <ThermalEfficiencyDetail result={result} presetData={data} />
                    <EnergyCards result={result} presetData={data} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {presetLoaded && results.length === 0 && (
            <Alert>
              <AlertTitle>Nenhum caso de vazão definido</AlertTitle>
              <AlertDescription>
                Adicione pelo menos um caso de vazão para ver os resultados
                calculados.
              </AlertDescription>
            </Alert>
          )}

          {!presetLoaded && (
            <Alert>
              <AlertTitle>
                Bem-vindo ao Serigado IV Steamflood Analysis
              </AlertTitle>
              <AlertDescription>
                Clique em "Carregar Preset Serigado IV" para começar. Você
                poderá editar os valores após carregar o preset e ver os
                resultados calculados em tempo real.
              </AlertDescription>
            </Alert>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
