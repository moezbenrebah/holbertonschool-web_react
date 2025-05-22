import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Clock, MapPin, Utensils } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative">
          <div className="absolute inset-0 bg-black/30 z-10" />
          <Image
            src="/images/hero-background.jpg"
            alt="Restaurant interior"
            width={1920}
            height={1080}
            className="w-full h-[600px] object-cover"
            priority
          />
          <div className="container relative z-20 mx-auto px-4 py-24 text-center text-white">
            <h1 className="font-serif text-4xl md:text-6xl font-bold mb-6 inline-block bg-black/70 px-6 py-3 rounded-lg">
              La terapia de Carolina
            </h1>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Button asChild size="lg" className="bg-amber-500 hover:bg-amber-600 text-white">
                <Link href="/menu">Ver Menú</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="text-white border-black bg-black/50 hover:bg-black/70 hover:border-black"
              >
                <Link href="/reservations">Reservar Mesa</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="border-none shadow-sm">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                    <Utensils className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">Exquisita gastronomía</h3>
                  <p className="text-muted-foreground">
                    Disfruta de nuestros platos preparados con ingredientes frescos y locales
                  </p>
                </CardContent>
              </Card>
              <Card className="border-none shadow-sm">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                    <Clock className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">Horario amplio</h3>
                  <p className="text-muted-foreground">Abierto todos los días de 9:00 AM a 11:00 PM</p>
                </CardContent>
              </Card>
              <Card className="border-none shadow-sm">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                    <MapPin className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">Ubicación céntrica</h3>
                  <p className="text-muted-foreground">Fácil acceso en el corazón de la ciudad</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Featured Dishes */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Desde el 2023</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col md:flex-row gap-6 items-center">
                <Image
                  src="/images/french-toast.jpg"
                  alt="French Toast"
                  width={300}
                  height={300}
                  className="rounded-lg object-cover w-full md:w-1/2 h-[250px]"
                />
                <div>
                  <h3 className="text-xl font-bold mb-2">French Toast</h3>
                  <p className="text-muted-foreground mb-4">
                    Nuestro French Toast es una delicia cubierta con frutas frescas, jarabe de arce y decorada con
                    flores comestibles.
                  </p>
                  <Button variant="outline" className="group">
                    Ver en el menú
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition" />
                  </Button>
                </div>
              </div>
              <div className="flex flex-col md:flex-row gap-6 items-center">
                <Image
                  src="/images/croquetas.jpg"
                  alt="Croquetas"
                  width={300}
                  height={300}
                  className="rounded-lg object-cover w-full md:w-1/2 h-[250px]"
                />
                <div>
                  <h3 className="text-xl font-bold mb-2">Croquetas</h3>
                  <p className="text-muted-foreground mb-4">
                    Nuestras deliciosas croquetas en variedad de sabores: Bacalao, Pollo Pepperoni, Corned Beef y
                    Mamposteao.
                  </p>
                  <Button variant="outline" className="group">
                    Ver en el menú
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Private Events */}
        <section className="py-16 bg-gradient-to-r from-amber-50 to-rose-50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-4">¿Buscas reuniones privadas?</h2>
                <p className="text-muted-foreground mb-6">
                  Contamos con un amplio espacio para hasta 25 personas. El más íntimo de Madrid, también disponible
                  para eventos exclusivos.
                </p>
                <Button className="bg-amber-500 hover:bg-amber-600 text-white">Reservar ahora</Button>
              </div>
              <div className="bg-white p-8 rounded-lg shadow-md">
                <div className="bg-gradient-to-r from-amber-100 to-rose-100 p-8 rounded-lg">
                  <h3 className="text-2xl font-serif font-bold text-center mb-4">Reuniones Privadas</h3>
                  <p className="text-center text-muted-foreground">
                    El espacio perfecto para tus celebraciones especiales
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Lo que dicen nuestros clientes</h2>
            <Tabs defaultValue="tab1" className="w-full max-w-3xl mx-auto">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="tab1">María G.</TabsTrigger>
                <TabsTrigger value="tab2">Carlos P.</TabsTrigger>
                <TabsTrigger value="tab3">Laura S.</TabsTrigger>
              </TabsList>
              <TabsContent value="tab1" className="p-6 bg-gray-50 rounded-lg mt-4">
                <p className="italic text-muted-foreground mb-4">
                  "La comida es espectacular y el ambiente muy acogedor. El French Toast es simplemente divino. Volveré
                  pronto."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                    <span className="font-medium text-green-600">MG</span>
                  </div>
                  <div>
                    <p className="font-medium">María González</p>
                    <p className="text-sm text-muted-foreground">Cliente frecuente</p>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="tab2" className="p-6 bg-gray-50 rounded-lg mt-4">
                <p className="italic text-muted-foreground mb-4">
                  "Celebré mi cumpleaños en el espacio privado y fue una experiencia increíble. El servicio es
                  impecable."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                    <span className="font-medium text-green-600">CP</span>
                  </div>
                  <div>
                    <p className="font-medium">Carlos Pérez</p>
                    <p className="text-sm text-muted-foreground">Evento privado</p>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="tab3" className="p-6 bg-gray-50 rounded-lg mt-4">
                <p className="italic text-muted-foreground mb-4">
                  "El Mac & Cheese es adictivo. La presentación de los platos es hermosa y el sabor supera las
                  expectativas."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                    <span className="font-medium text-green-600">LS</span>
                  </div>
                  <div>
                    <p className="font-medium">Laura Sánchez</p>
                    <p className="text-sm text-muted-foreground">Reseña en Google</p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-green-700 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Conviértete en nuestro cliente</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Reserva una mesa hoy mismo y disfruta de una experiencia culinaria única
            </p>
            <Button asChild size="lg" className="bg-white text-green-700 hover:bg-gray-100">
              <Link href="/reservations">Reservar Ahora</Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
