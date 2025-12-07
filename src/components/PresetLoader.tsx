import { Button } from "./ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"

interface PresetLoaderProps {
  onLoadPreset: () => void
  presetName?: string
}

export function PresetLoader({ onLoadPreset, presetName }: PresetLoaderProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Preset Serigado IV</CardTitle>
            <CardDescription>
              Carregue os valores pré-definidos do caso Serigado IV
            </CardDescription>
          </div>
          {presetName && (
            <Badge variant="outline" className="ml-4">
              {presetName}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <Button onClick={onLoadPreset} variant="default" className="w-full">
          Carregar Preset Serigado IV
        </Button>
      </CardContent>
    </Card>
  )
}

