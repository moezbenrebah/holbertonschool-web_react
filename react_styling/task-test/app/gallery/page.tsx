"use client"

import { useState } from "react"
import Image from "next/image"
import { X } from "lucide-react"

import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Gallery images data
const galleryImages = {
  food: [
    { src: "/images/french-toast.jpg", alt: "French Toast", title: "French Toast" },
    { src: "/images/croquetas.jpg", alt: "Croquetas", title: "Croquetas" },
    { src: "/images/avocado-toast.jpeg", alt: "Avocado Toast", title: "Avocado Toast" },
    { src: "/images/hamburguesa-gourmet.jpeg", alt: "Hamburguesa Gourmet", title: "Hamburguesa Gourmet" },
    { src: "/images/ensalada-cesar.webp", alt: "Ensalada César", title: "Ensalada César" },
    { src: "/images/huevos-benedictinos.jpeg", alt: "Huevos Benedictinos", title: "Huevos Benedictinos" },
  ],
  restaurant: [
    { src: "/images/hero-background.jpg", alt: "Interior del restaurante", title: "Nuestro espacio" },
    { src: "/placeholder.svg?height=400&width=600", alt: "Terraza", title: "Terraza" },
    { src: "/placeholder.svg?height=400&width=600", alt: "Barra", title: "Barra" },
    { src: "/placeholder.svg?height=400&width=600", alt: "Salón principal", title: "Salón principal" },
  ],
  events: [
    { src: "/placeholder.svg?height=400&width=600", alt: "Evento corporativo", title: "Evento corporativo" },
    {
      src: "/placeholder.svg?height=400&width=600",
      alt: "Celebración de cumpleaños",
      title: "Celebración de cumpleaños",
    },
    { src: "/placeholder.svg?height=400&width=600", alt: "Reunión privada", title: "Reunión privada" },
  ],
}

export default function GalleryPage() {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [currentImage, setCurrentImage] = useState<{ src: string; alt: string; title: string } | null>(null)

  const openLightbox = (image: { src: string; alt: string; title: string }) => {
    setCurrentImage(image)
    setLightboxOpen(true)
    document.body.style.overflow = "hidden"
  }

  const closeLightbox = () => {
    setLightboxOpen(false)
    document.body.style.overflow = "auto"
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8 text-center">Nuestra Galería</h1>

          <Tabs defaultValue="food" className="w-full">
            <TabsList className="w-full max-w-md mx-auto grid grid-cols-3 mb-8">
              <TabsTrigger value="food">Platos</TabsTrigger>
              <TabsTrigger value="restaurant">Restaurante</TabsTrigger>
              <TabsTrigger value="events">Eventos</TabsTrigger>
            </TabsList>

            <TabsContent value="food" className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {galleryImages.food.map((image, index) => (
                  <div
                    key={index}
                    className="relative aspect-square cursor-pointer overflow-hidden rounded-lg"
                    onClick={() => openLightbox(image)}
                  >
                    <Image
                      src={image.src || "/placeholder.svg"}
                      alt={image.alt}
                      fill
                      className="object-cover transition-transform hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-end">
                      <div className="p-4 w-full text-white">
                        <h3 className="font-medium">{image.title}</h3>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="restaurant" className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {galleryImages.restaurant.map((image, index) => (
                  <div
                    key={index}
                    className="relative aspect-square cursor-pointer overflow-hidden rounded-lg"
                    onClick={() => openLightbox(image)}
                  >
                    <Image
                      src={image.src || "/placeholder.svg"}
                      alt={image.alt}
                      fill
                      className="object-cover transition-transform hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-end">
                      <div className="p-4 w-full text-white">
                        <h3 className="font-medium">{image.title}</h3>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="events" className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {galleryImages.events.map((image, index) => (
                  <div
                    key={index}
                    className="relative aspect-square cursor-pointer overflow-hidden rounded-lg"
                    onClick={() => openLightbox(image)}
                  >
                    <Image
                      src={image.src || "/placeholder.svg"}
                      alt={image.alt}
                      fill
                      className="object-cover transition-transform hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-end">
                      <div className="p-4 w-full text-white">
                        <h3 className="font-medium">{image.title}</h3>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />

      {/* Lightbox */}
      {lightboxOpen && currentImage && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 text-white hover:bg-white/10"
            onClick={closeLightbox}
          >
            <X className="h-6 w-6" />
            <span className="sr-only">Close</span>
          </Button>
          <div className="relative w-full max-w-4xl h-[80vh]">
            <Image
              src={currentImage.src || "/placeholder.svg"}
              alt={currentImage.alt}
              fill
              className="object-contain"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-4">
              <h3 className="text-white text-xl font-medium">{currentImage.title}</h3>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
