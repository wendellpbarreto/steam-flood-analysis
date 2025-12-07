import { Badge } from "./ui/badge"

export function Header() {
  return (
    <header className="border-b bg-card">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Serigado IV
            </h1>
            <p className="text-muted-foreground mt-1">
              Steamflood Analytical Assessment
            </p>
          </div>
          <Badge variant="secondary" className="text-sm">
            Calculadora Analítica
          </Badge>
        </div>
      </div>
    </header>
  )
}

