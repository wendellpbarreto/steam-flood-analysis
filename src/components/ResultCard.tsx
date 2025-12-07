import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Separator } from "./ui/separator"

interface ResultCardProps {
  title: string
  description: string
  value: number | string
  unit?: string
  formula?: string
  badge?: string
}

export function ResultCard({ title, description, value, unit, formula, badge }: ResultCardProps) {
  const formatValue = (val: number | string): string => {
    if (typeof val === "number") {
      return new Intl.NumberFormat("pt-BR", {
        maximumFractionDigits: 2,
      }).format(val)
    }
    return val
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <CardTitle className="text-xl">{title}</CardTitle>
              {badge && (
                <Badge variant="secondary" className="text-xs">
                  {badge}
                </Badge>
              )}
            </div>
            <CardDescription>{description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-foreground">
              {formatValue(value)}
            </span>
            {unit && (
              <span className="text-sm text-muted-foreground">{unit}</span>
            )}
          </div>
        </div>
        {formula && (
          <>
            <Separator />
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-2">
                Fórmula:
              </p>
              <code className="text-xs bg-muted px-2 py-1 rounded block font-mono">
                {formula}
              </code>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}

