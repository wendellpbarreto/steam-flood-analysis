import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Separator } from "./ui/separator"
import type { PresetData } from "../data/presets"

interface ReservoirFormProps {
  data: PresetData
  onDataChange: (data: PresetData) => void
}

export function ReservoirForm({ data, onDataChange }: ReservoirFormProps) {
  const updateCommon = (field: keyof PresetData["common"], value: number) => {
    onDataChange({
      ...data,
      common: {
        ...data.common,
        [field]: value,
      },
    })
  }


  return (
    <Card>
      <CardHeader>
        <CardTitle>Parâmetros do Reservatório</CardTitle>
        <CardDescription>
          Edite os valores abaixo para recalcular os resultados
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-4">Temperaturas e Pressão</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="Ts">Temperatura do Vapor (Ts)</Label>
              <Input
                id="Ts"
                type="number"
                value={data.common.Ts}
                onChange={(e) => updateCommon("Ts", parseFloat(e.target.value) || 0)}
              />
              <p className="text-xs text-muted-foreground">°F</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="Tr">Temperatura Reservatório (Tr)</Label>
              <Input
                id="Tr"
                type="number"
                value={data.common.Tr}
                onChange={(e) => updateCommon("Tr", parseFloat(e.target.value) || 0)}
              />
              <p className="text-xs text-muted-foreground">°F</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="Tb">Temperatura Caldeira (Tb)</Label>
              <Input
                id="Tb"
                type="number"
                value={data.common.Tb}
                onChange={(e) => updateCommon("Tb", parseFloat(e.target.value) || 0)}
              />
              <p className="text-xs text-muted-foreground">°F</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="Ps">Pressão do Vapor (Ps)</Label>
              <Input
                id="Ps"
                type="number"
                value={data.common.Ps}
                onChange={(e) => updateCommon("Ps", parseFloat(e.target.value) || 0)}
              />
              <p className="text-xs text-muted-foreground">psia</p>
            </div>
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="text-lg font-semibold mb-4">Gerador de Vapor</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="Eb">Eficiência do Gerador (Eb)</Label>
              <Input
                id="Eb"
                type="number"
                step="0.01"
                min="0"
                max="1"
                value={data.common.Eb}
                onChange={(e) => updateCommon("Eb", parseFloat(e.target.value) || 0)}
              />
              <p className="text-xs text-muted-foreground">
                {(data.common.Eb * 100).toFixed(1)}%
              </p>
            </div>
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="text-lg font-semibold mb-4">Propriedades do Reservatório</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="zn">Espessura Líquida (zn)</Label>
              <Input
                id="zn"
                type="number"
                value={data.common.zn}
                onChange={(e) => updateCommon("zn", parseFloat(e.target.value) || 0)}
              />
              <p className="text-xs text-muted-foreground">ft</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="zt">Espessura Total (zt)</Label>
              <Input
                id="zt"
                type="number"
                value={data.common.zt}
                onChange={(e) => updateCommon("zt", parseFloat(e.target.value) || 0)}
              />
              <p className="text-xs text-muted-foreground">ft</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phi">Porosidade (φ)</Label>
              <Input
                id="phi"
                type="number"
                step="0.01"
                value={data.common.phi}
                onChange={(e) => updateCommon("phi", parseFloat(e.target.value) || 0)}
              />
              <p className="text-xs text-muted-foreground">-</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="tYears">Tempo de Injeção</Label>
              <Input
                id="tYears"
                type="number"
                step="0.1"
                value={data.common.tYears}
                onChange={(e) => updateCommon("tYears", parseFloat(e.target.value) || 0)}
              />
              <p className="text-xs text-muted-foreground">anos</p>
            </div>
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="text-lg font-semibold mb-4">Propriedades do Óleo</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="So">Saturação Inicial de Óleo (So)</Label>
              <Input
                id="So"
                type="number"
                step="0.01"
                min="0"
                max="1"
                value={data.common.So}
                onChange={(e) => updateCommon("So", parseFloat(e.target.value) || 0)}
              />
              <p className="text-xs text-muted-foreground">-</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="Sor">Saturação Residual de Óleo (Sor)</Label>
              <Input
                id="Sor"
                type="number"
                step="0.01"
                min="0"
                max="1"
                value={data.common.Sor}
                onChange={(e) => updateCommon("Sor", parseFloat(e.target.value) || 0)}
              />
              <p className="text-xs text-muted-foreground">-</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="gammaO">Densidade Relativa do Óleo (γo)</Label>
              <Input
                id="gammaO"
                type="number"
                step="0.01"
                value={data.common.gammaO}
                onChange={(e) => updateCommon("gammaO", parseFloat(e.target.value) || 0)}
              />
              <p className="text-xs text-muted-foreground">-</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="fPVRef">Fração de Poro Injetado (fPVRef)</Label>
              <Input
                id="fPVRef"
                type="number"
                step="0.01"
                min="0"
                max="1"
                value={data.common.fPVRef}
                onChange={(e) => updateCommon("fPVRef", parseFloat(e.target.value) || 0)}
              />
              <p className="text-xs text-muted-foreground">-</p>
            </div>
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="text-lg font-semibold mb-4">Propriedades Térmicas</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="rho1C1">Capacidade Calorífica Zona Vapor (ρ1C1)</Label>
              <Input
                id="rho1C1"
                type="number"
                step="0.1"
                value={data.common.rho1C1}
                onChange={(e) => updateCommon("rho1C1", parseFloat(e.target.value) || 0)}
              />
              <p className="text-xs text-muted-foreground">Btu/ft³·°F</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="rho2C2">Capacidade Calorífica Camadas (ρ2C2)</Label>
              <Input
                id="rho2C2"
                type="number"
                step="0.1"
                value={data.common.rho2C2}
                onChange={(e) => updateCommon("rho2C2", parseFloat(e.target.value) || 0)}
              />
              <p className="text-xs text-muted-foreground">Btu/ft³·°F</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="K2">Condutividade Térmica (K2)</Label>
              <Input
                id="K2"
                type="number"
                step="0.1"
                value={data.common.K2}
                onChange={(e) => updateCommon("K2", parseFloat(e.target.value) || 0)}
              />
              <p className="text-xs text-muted-foreground">Btu/ft·h·°F</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="Lv">Calor de Vaporização (Lv)</Label>
              <Input
                id="Lv"
                type="number"
                step="0.1"
                value={data.common.Lv}
                onChange={(e) => updateCommon("Lv", parseFloat(e.target.value) || 0)}
              />
              <p className="text-xs text-muted-foreground">Btu/lb</p>
            </div>
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="text-lg font-semibold mb-4">Propriedades do Vapor e Água</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fsd">Qualidade Vapor Reservatório (fsd)</Label>
              <Input
                id="fsd"
                type="number"
                step="0.01"
                min="0"
                max="1"
                value={data.common.fsd}
                onChange={(e) => updateCommon("fsd", parseFloat(e.target.value) || 0)}
              />
              <p className="text-xs text-muted-foreground">-</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="Fsb">Qualidade Vapor Caldeira (Fsb)</Label>
              <Input
                id="Fsb"
                type="number"
                step="0.01"
                min="0"
                max="1"
                value={data.common.Fsb}
                onChange={(e) => updateCommon("Fsb", parseFloat(e.target.value) || 0)}
              />
              <p className="text-xs text-muted-foreground">-</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="CwTs">Entalpia Água a Ts (CwTs)</Label>
              <Input
                id="CwTs"
                type="number"
                step="0.01"
                value={data.common.CwTs}
                onChange={(e) => updateCommon("CwTs", parseFloat(e.target.value) || 0)}
              />
              <p className="text-xs text-muted-foreground">Btu/lb</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="CwTr">Entalpia Água a Tr (CwTr)</Label>
              <Input
                id="CwTr"
                type="number"
                step="0.01"
                value={data.common.CwTr}
                onChange={(e) => updateCommon("CwTr", parseFloat(e.target.value) || 0)}
              />
              <p className="text-xs text-muted-foreground">Btu/lb</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="CwTb">Entalpia Água a Tb (CwTb)</Label>
              <Input
                id="CwTb"
                type="number"
                step="0.01"
                value={data.common.CwTb}
                onChange={(e) => updateCommon("CwTb", parseFloat(e.target.value) || 0)}
              />
              <p className="text-xs text-muted-foreground">Btu/lb</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="rhoW">Densidade da Água (ρw)</Label>
              <Input
                id="rhoW"
                type="number"
                step="0.1"
                value={data.common.rhoW}
                onChange={(e) => updateCommon("rhoW", parseFloat(e.target.value) || 0)}
              />
              <p className="text-xs text-muted-foreground">lb/ft³</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
