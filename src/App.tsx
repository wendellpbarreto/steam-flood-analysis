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
  const [activeCaseIndex, setActiveCaseIndex] = useState(0);

  useEffect(() => {
    const preset = serigadoIVPreset.data;
    setData(preset);
    setPresetLoaded(true);
  }, []);

  useEffect(() => {
    if (data) {
      const calculatedResults = calculateAllCases(data);
      setResults(calculatedResults);
      if (activeCaseIndex >= calculatedResults.length) {
        setActiveCaseIndex(Math.max(0, calculatedResults.length - 1));
      }
    }
  }, [data, activeCaseIndex]);

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

  const handlePrevCase = () => {
    setActiveCaseIndex((prev) =>
      prev > 0 ? prev - 1 : Math.max(0, results.length - 1)
    );
  };

  const handleNextCase = () => {
    setActiveCaseIndex((prev) =>
      prev < results.length - 1 ? prev + 1 : 0
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
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-2xl font-bold">
                      {results[activeCaseIndex].caseName}
                    </h3>
                    <Badge variant="default" className="text-base px-3 py-1">
                      Vazão: {results[activeCaseIndex].rateBblPerDay} bbl/d
                      {results[activeCaseIndex].rateTonsPerDay &&
                        ` / ${results[activeCaseIndex].rateTonsPerDay!.toFixed(1)} t/d`}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Selecione um caso para aplicar os mesmos cálculos (A–H) sem repetir as fórmulas.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    className="px-3 py-2 rounded border bg-background hover:bg-muted transition"
                    onClick={handlePrevCase}
                    aria-label="Caso anterior"
                  >
                    ←
                  </button>
                  <span className="text-sm font-semibold">
                    Caso {activeCaseIndex + 1} de {results.length}
                  </span>
                  <button
                    className="px-3 py-2 rounded border bg-background hover:bg-muted transition"
                    onClick={handleNextCase}
                    aria-label="Próximo caso"
                  >
                    →
                  </button>
                </div>
              </div>

              <div className="space-y-8">
                <IntermediateCalculations
                  result={results[activeCaseIndex]}
                  presetData={data}
                />

                <AreaHeatedDetail
                  result={results[activeCaseIndex]}
                  presetData={data}
                />

                <CriticalTimeDetail
                  result={results[activeCaseIndex]}
                  presetData={data}
                />

                <ThermalEfficiencyDetail
                  result={results[activeCaseIndex]}
                  presetData={data}
                />

                <EnergyCards
                  result={results[activeCaseIndex]}
                  presetData={data}
                />
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
