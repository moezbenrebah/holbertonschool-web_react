import Image from "next/image"
import Link from "next/link"
import { Check } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"

export default function PrivateEventsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-600/80 to-rose-600/80 z-10" />
          <Image
            src="/placeholder.svg?height=600&width=1200"
            alt="Private event space"
            width={1920}
            height={600}
            className="w-full h-[400px] object-cover"
          />
          <div className="container relative z-20 mx-auto px-4 py-16 text-center text-white">
            <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">Reuniones Privadas</h1>
            <p className="text-lg md:text-xl max-w-2xl mx-auto">
              El espacio perfecto para tus celebraciones especiales y eventos corporativos
            </p>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6">Un espacio exclusivo para tus eventos</h2>
                <p className="text-lg text-muted-foreground mb-6">
                  Contamos con un amplio espacio para hasta 25 personas. El más íntimo de Madrid, también disponible
                  para eventos exclusivos.
                </p>
                <p className="text-lg text-muted-foreground mb-6">
                  Ya sea una celebración de cumpleaños, una reunión corporativa o una cena privada, nuestro equipo se
                  encargará de que tu evento sea inolvidable.
                </p>
                <ul className="space-y-2 mb-8">
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-600 mt-0.5" />
                    <span>Espacio privado y exclusivo</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-600 mt-0.5" />
                    <span>Menús personalizados</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-600 mt-0.5" />
                    <span>Decoración adaptada a tu evento</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-600 mt-0.5" />
                    <span>Equipo audiovisual disponible</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-600 mt-0.5" />
                    <span>Atención personalizada</span>
                  </li>
                </ul>
                <Button asChild size="lg" className="bg-amber-500 hover:bg-amber-600 text-white">
                  <Link href="/contact">Solicitar información</Link>
                </Button>
              </div>
              <div className="bg-gradient-to-r from-amber-50 to-rose-50 p-8 rounded-lg">
                <div className="bg-white p-8 rounded-lg shadow-md">
                  <h3 className="text-2xl font-serif font-bold text-center mb-6">Reuniones Privadas</h3>
                  <Image
                    src="/placeholder.svg?height=400&width=600"
                    alt="Private event space"
                    width={600}
                    height={400}
                    className="w-full h-auto rounded-md mb-6"
                  />
                  <p className="text-center text-muted-foreground mb-6">
                    El espacio perfecto para tus celebraciones especiales
                  </p>
                  <div className="text-center">
                    <p className="font-medium">Capacidad: hasta 25 personas</p>
                    <p className="text-muted-foreground">Disponible para reserva todos los días</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Event Types */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center">Tipos de Eventos</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card>
                <CardContent className="p-6">
                  <div className="h-48 bg-amber-100 rounded-md mb-4 flex items-center justify-center">
                    <Image
                      src="/placeholder.svg?height=200&width=300"
                      alt="Celebraciones"
                      width={300}
                      height={200}
                      className="w-full h-full object-cover rounded-md"
                    />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Celebraciones</h3>
                  <p className="text-muted-foreground mb-4">
                    Cumpleaños, aniversarios, graduaciones y todo tipo de celebraciones personales.
                  </p>
                  <ul className="space-y-1 mb-4">
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Menús personalizados</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Decoración temática</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Pastel personalizado</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="h-48 bg-green-100 rounded-md mb-4 flex items-center justify-center">
                    <Image
                      src="/placeholder.svg?height=200&width=300"
                      alt="Eventos Corporativos"
                      width={300}
                      height={200}
                      className="w-full h-full object-cover rounded-md"
                    />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Eventos Corporativos</h3>
                  <p className="text-muted-foreground mb-4">
                    Reuniones de trabajo, presentaciones, cenas de empresa y team buildings.
                  </p>
                  <ul className="space-y-1 mb-4">
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Equipo audiovisual</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Wifi de alta velocidad</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Menús ejecutivos</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="h-48 bg-rose-100 rounded-md mb-4 flex items-center justify-center">
                    <Image
                      src="/placeholder.svg?height=200&width=300"
                      alt="Eventos Sociales"
                      width={300}
                      height={200}
                      className="w-full h-full object-cover rounded-md"
                    />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Eventos Sociales</h3>
                  <p className="text-muted-foreground mb-4">
                    Cenas privadas, reuniones familiares, despedidas y encuentros sociales.
                  </p>
                  <ul className="space-y-1 mb-4">
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Ambiente exclusivo</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Servicio personalizado</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Opciones de menú variadas</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-amber-500 to-rose-500 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">¿Listo para organizar tu evento?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Contáctanos hoy mismo y te ayudaremos a planificar un evento inolvidable
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-white text-amber-600 hover:bg-gray-100">
                <Link href="/contact">Solicitar Información</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-white border-white hover:bg-white/10">
                <Link href="/reservations">Reservar Ahora</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
