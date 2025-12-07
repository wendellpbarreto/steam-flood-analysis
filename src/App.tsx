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
import { Separator } from "./components/ui/separator";
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

  useEffect(() => {
    const preset = serigadoIVPreset.data;
    setData(preset);
    setPresetLoaded(true);
  }, []);

  useEffect(() => {
    if (data) {
      const calculatedResults = calculateAllCases(data);
      setResults(calculatedResults);
    }
  }, [data]);

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
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <ReservoirForm data={data} onDataChange={handleDataChange} />
              </div>
              <div className="lg:col-span-1">
                <SteamRateCases
                  cases={data.cases}
                  onCasesChange={handleCasesChange}
                />
              </div>
            </div>
          )}

          {presetLoaded && results.length > 0 && data && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Resultados dos Cálculos</h2>

              {results.map((result, index) => (
                <div key={index} className="mb-12 space-y-6">
                  <div className="bg-primary/10 p-6 rounded-lg border-2 border-primary/20">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-2xl font-bold">{result.caseName}</h3>
                      <Badge variant="default" className="text-base px-3 py-1">
                        Vazão: {result.rateBblPerDay} bbl/d
                        {result.rateTonsPerDay && ` / ${result.rateTonsPerDay.toFixed(1)} t/d`}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Análise para vazão de injeção de vapor de{" "}
                      <span className="font-semibold">{result.rateBblPerDay} bbl/d</span>
                      {result.rateTonsPerDay && (
                        <>
                          {" "}
                          (
                          <span className="font-semibold">
                            {result.rateTonsPerDay.toFixed(1)} t/d
                          </span>
                          )
                        </>
                      )}
                    </p>
                  </div>

                  <IntermediateCalculations result={result} presetData={data} />

                  <AreaHeatedDetail result={result} presetData={data} />

                  <CriticalTimeDetail result={result} presetData={data} />

                  <ThermalEfficiencyDetail result={result} presetData={data} />

                  <EnergyCards result={result} presetData={data} />

                  {index < results.length - 1 && <Separator className="my-8" />}
                </div>
              ))}
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
