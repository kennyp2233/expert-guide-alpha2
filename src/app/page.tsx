// app/page.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Sheet, SheetTrigger, SheetContent } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Truck, Users, FileCheck, Rocket, ChevronRight, Menu } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Features />
        <Process />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}

function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">

      <nav className="flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-2xl">
          <Rocket className="h-6 w-6 text-primary" />
          <span className="text-primary">EHC ERP</span>
        </Link>

        <div className="hidden lg:flex items-center gap-8">
          <Link href="#features" className="text-sm font-medium transition-colors hover:text-primary">
            Características
          </Link>
          <Link href="#process" className="text-sm font-medium transition-colors hover:text-primary">
            Proceso
          </Link>
          <Link href="/auth/login" className="text-sm font-medium transition-colors hover:text-primary">
            Acceso Clientes
          </Link>
          <Button asChild className="bg-primary hover:bg-primary/90">
            <Link href="/auth/register/client">Prueba Gratis</Link>
          </Button>
        </div>

        <Sheet>
          <SheetTrigger className="lg:hidden">
            <Menu className="h-6 w-6" />
          </SheetTrigger>
          <SheetContent side="right">
            <div className="flex flex-col gap-4 pt-6">
              <Link href="#features" className="py-2 font-medium">
                Características
              </Link>
              <Link href="#process" className="py-2 font-medium">
                Proceso
              </Link>
              <Link href="/auth/login" className="py-2 font-medium">
                Acceso Clientes
              </Link>
              <Button asChild className="w-full mt-4">
                <Link href="/auth/register/client">Prueba Gratis</Link>
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  );
}

function Hero() {
  return (
    <section className="bg-gradient-to-b from-primary/10 to-background py-20">
      <div className="flex flex-col lg:flex-row items-center gap-16">
        <div className="flex-1 space-y-8">
          <Badge variant="secondary" className="text-sm px-4 py-1">
            Plataforma especializada en floricultura
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Optimiza tu exportación de flores con
            <span className="text-primary"> inteligencia operativa</span>
          </h1>
          <p className="text-xl text-muted-foreground">
            Integración completa para gestión logística, documentación certificada y
            fidelización de clientes en tiempo real.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
              <Link href="/auth/register/client">Comenzar ahora</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="#features" className="flex items-center gap-2">
                Ver características <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        <div className="flex-1">
          <Image
            src="/hero-dashboard.png"
            alt="Dashboard de gestión EHC ERP"
            width={800}
            height={600}
            className="rounded-xl shadow-2xl border"
            priority
          />
        </div>
      </div>
    </section>
  );
}

function Features() {
  const features = [
    {
      icon: Truck,
      title: "Seguimiento Logístico",
      description: "Monitoreo en tiempo real de AWB/HAWB con actualizaciones automáticas"
    },
    {
      icon: FileCheck,
      title: "Gestión Documental",
      description: "Validación inteligente de certificados y documentos legales"
    },
    {
      icon: Users,
      title: "Clientes VIP",
      description: "Sistema de puntos integrado y programa de fidelización"
    }
  ];

  return (
    <section id="features" className="py-20 bg-secondary/10">
      <div className="mx-auto max-w-2xl text-center mb-16">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Potencia tu operación exportadora
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Soluciones especializadas para los desafíos únicos de la industria floral
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {features.map((feature) => (
          <Card key={feature.title} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="mb-4 flex justify-center">
                <feature.icon className="h-12 w-12 text-primary" />
              </div>
              <CardTitle>{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>{feature.description}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

function Process() {
  const steps = [
    { title: "Registro Express", description: "Creación de cuenta en menos de 1 minuto" },
    { title: "Validación Automática", description: "Subida y verificación de documentos" },
    { title: "Integración Logística", description: "Conexión con tus proveedores actuales" },
    { title: "Operación Activa", description: "Comienza a gestionar tus exportaciones" }
  ];

  return (
    <section id="process" className="py-20">
      <div className="mx-auto max-w-4xl">
        <h2 className="text-3xl font-bold text-center mb-16">
          Implementación en 4 pasos
        </h2>

        <div className="relative">
          <div className="absolute left-1/2 h-full w-0.5 bg-border -translate-x-1/2 hidden lg:block" />

          <div className="grid lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={step.title} className="relative">
                <div className="flex flex-col items-center text-center">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white font-bold">
                    {index + 1}
                  </div>
                  <h3 className="text-lg font-semibold">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="bg-primary text-primary-foreground py-20">
      <div className="rounded-xl bg-gradient-to-r from-primary/90 to-primary/70 p-8 shadow-2xl">
        <div className="flex flex-col items-center text-center gap-6">
          <h2 className="text-3xl font-bold sm:text-4xl">
            ¿Listo para transformar tu operación?
          </h2>
          <p className="max-w-2xl text-lg">
            Únete a las principales empresas florícolas que ya optimizan sus procesos
          </p>
          <Button
            asChild
            size="lg"
            variant="secondary"
            className="mt-4 hover:bg-background"
          >
            <Link href="/auth/register/client" className="flex items-center gap-2">
              Comenzar Ahora <ChevronRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t">
      <div className="py-12 flex flex-col items-center gap-8 text-center">
        <div className="flex items-center gap-2">
          <Rocket className="h-6 w-6 text-primary" />
          <span className="font-bold">EHC ERP</span>
        </div>
        <div className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Experts Handling Cargo. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}