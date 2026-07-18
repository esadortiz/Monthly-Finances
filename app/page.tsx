import Link from "next/link"
import { Logo } from "@/components/logo"

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <header className="flex items-center justify-between border-b border-border/40 bg-background/30 backdrop-blur-md px-4 sm:px-6 py-3 sticky top-0 z-30">
        <Logo />
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Iniciar Sesión
          </Link>
          <Link
            href="/register"
            className="inline-flex h-8 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/80 transition-colors"
          >
            Registrarse
          </Link>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center px-4 sm:px-6">
        <div className="mx-auto max-w-lg text-center glass rounded-2xl p-6 sm:p-10">
          <div className="mx-auto mb-6">
            <Logo size="lg" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight">
            Controla tus finanzas personales
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Registra ingresos y gastos, crea presupuestos y visualiza
            estadísticas claras para tomar mejores decisiones
            financieras.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <Link
              href="/register"
              className="inline-flex h-10 items-center justify-center rounded-lg bg-primary px-6 text-sm font-medium text-primary-foreground hover:bg-primary/80 transition-colors"
            >
              Comenzar Gratis
            </Link>
            <Link
              href="/login"
              className="inline-flex h-10 items-center justify-center rounded-lg border border-border/50 bg-background/40 backdrop-blur-sm px-6 text-sm font-medium hover:bg-background/60 transition-colors"
            >
              Iniciar Sesión
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
