import Image from "next/image"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { MenuItem } from "@/components/menu/menu-item"

export default function MenuPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Menu Hero */}
        <section className="relative">
          <div className="absolute inset-0 bg-black/60 z-10" />
          <Image
            src="/images/menu-hero.jpg"
            alt="Our delicious food"
            width={1920}
            height={600}
            className="w-full h-[300px] object-cover"
          />
          <div className="container relative z-20 mx-auto px-4 py-16 text-center text-white">
            <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">Nuestro Menú</h1>
            <p className="text-lg md:text-xl max-w-2xl mx-auto">
              Descubre nuestra selección de platos preparados con ingredientes frescos y de temporada
            </p>
          </div>
        </section>

        {/* Menu Categories */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <Tabs defaultValue="breakfast" className="w-full">
              <TabsList className="w-full max-w-md mx-auto grid grid-cols-4 mb-8">
                <TabsTrigger value="breakfast">Desayunos</TabsTrigger>
                <TabsTrigger value="lunch">Almuerzos</TabsTrigger>
                <TabsTrigger value="dinner">Cenas</TabsTrigger>
                <TabsTrigger value="drinks">Bebidas</TabsTrigger>
              </TabsList>

              <TabsContent value="breakfast" className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <MenuItem
                    name="French Toast"
                    description="Pan brioche bañado en una mezcla de huevo y canela, servido con frutas frescas y jarabe de arce."
                    price={12.99}
                    image="/images/french-toast.jpg"
                  />
                  <MenuItem
                    name="Avocado Toast"
                    description="Pan de masa madre tostado con aguacate, huevo pochado y semillas de sésamo."
                    price={10.99}
                    image="/images/avocado-toast.jpeg"
                  />
                  <MenuItem
                    name="Pancakes de Arándanos"
                    description="Esponjosos pancakes con arándanos frescos, servidos con mantequilla y jarabe de arce."
                    price={9.99}
                    image="/placeholder.svg?height=200&width=300"
                  />
                  <MenuItem
                    name="Huevos Benedictinos"
                    description="Muffin inglés tostado con jamón, huevos pochados y salsa holandesa."
                    price={13.99}
                    image="/images/huevos-benedictinos.jpeg"
                  />
                </div>
              </TabsContent>

              <TabsContent value="lunch" className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <MenuItem
                    name="Croquetas"
                    description="Nuestras deliciosas croquetas en variedad de sabores: Bacalao, Pollo Pepperoni, Corned Beef y Mamposteao."
                    price={14.99}
                    image="/images/croquetas.jpg"
                  />
                  <MenuItem
                    name="Ensalada César"
                    description="Lechuga romana, crutones, parmesano y pollo a la parrilla con aderezo César."
                    price={12.99}
                    image="/images/ensalada-cesar.webp"
                  />
                  <MenuItem
                    name="Hamburguesa Gourmet"
                    description="Carne de res Angus, queso cheddar, bacon, lechuga, tomate y cebolla caramelizada."
                    price={16.99}
                    image="/images/hamburguesa-gourmet.jpeg"
                  />
                  <MenuItem
                    name="Wrap de Pollo"
                    description="Tortilla de trigo con pollo a la parrilla, aguacate, lechuga y salsa de yogur."
                    price={11.99}
                    image="/placeholder.svg?height=200&width=300"
                  />
                </div>
              </TabsContent>

              <TabsContent value="dinner" className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <MenuItem
                    name="Salmón a la Parrilla"
                    description="Filete de salmón a la parrilla con puré de patatas y espárragos."
                    price={22.99}
                    image="/placeholder.svg?height=200&width=300"
                  />
                  <MenuItem
                    name="Risotto de Setas"
                    description="Cremoso risotto con variedad de setas silvestres y parmesano."
                    price={18.99}
                    image="/placeholder.svg?height=200&width=300"
                  />
                  <MenuItem
                    name="Filete Mignon"
                    description="Tierno filete mignon con salsa de vino tinto, acompañado de puré de patatas y verduras asadas."
                    price={28.99}
                    image="/placeholder.svg?height=200&width=300"
                  />
                  <MenuItem
                    name="Pasta al Pesto"
                    description="Pasta fresca con salsa pesto casera, tomates cherry y piñones tostados."
                    price={16.99}
                    image="/placeholder.svg?height=200&width=300"
                  />
                </div>
              </TabsContent>

              <TabsContent value="drinks" className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <MenuItem
                    name="Limonada Casera"
                    description="Refrescante limonada con menta fresca y un toque de miel."
                    price={4.99}
                    image="/placeholder.svg?height=200&width=300"
                  />
                  <MenuItem
                    name="Smoothie de Frutas"
                    description="Batido de frutas frescas de temporada con yogur natural."
                    price={6.99}
                    image="/placeholder.svg?height=200&width=300"
                  />
                  <MenuItem
                    name="Café Especial"
                    description="Nuestro café de especialidad, preparado con granos seleccionados."
                    price={3.99}
                    image="/placeholder.svg?height=200&width=300"
                  />
                  <MenuItem
                    name="Vino de la Casa"
                    description="Copa de nuestro vino seleccionado, tinto o blanco."
                    price={7.99}
                    image="/placeholder.svg?height=200&width=300"
                  />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
