import { Badge } from "./ui/badge"
import icon from "../assets/icon.jpg"

export function Header() {
  return (
    <header className="border-b bg-card">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={icon}
              alt="Serigado IV"
              className="h-12 w-12 rounded-full border border-primary/50 shadow-sm"
            />
            <div>
              <h1 className="text-3xl font-bold text-foreground">
              Serigado IV
              </h1>
              <p className="text-muted-foreground mt-1">
                Steamflood Analytical Assessment
              </p>
            </div>
          </div>
          <Badge variant="secondary" className="text-sm">
            Calculadora Analítica
          </Badge>
        </div>
      </div>
    </header>
  )
}
