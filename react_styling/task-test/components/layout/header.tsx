"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useCart } from "@/hooks/use-cart"
import { CartDrawer } from "@/components/cart/cart-drawer"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { items } = useCart()

  const totalItems = items.reduce((total, item) => total + item.quantity, 0)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-500 via-yellow-500 to-green-500">
                THERAPY
              </span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm font-medium hover:text-green-600 transition-colors">
              Inicio
            </Link>
            <Link href="/menu" className="text-sm font-medium hover:text-green-600 transition-colors">
              Menú
            </Link>
            <Link href="/order" className="text-sm font-medium hover:text-green-600 transition-colors">
              Ordenar
            </Link>
            <Link href="/reservations" className="text-sm font-medium hover:text-green-600 transition-colors">
              Reservaciones
            </Link>
            <Link href="/gallery" className="text-sm font-medium hover:text-green-600 transition-colors">
              Galería
            </Link>
            <Link href="/private-events" className="text-sm font-medium hover:text-green-600 transition-colors">
              Eventos Privados
            </Link>
            <Link href="/contact" className="text-sm font-medium hover:text-green-600 transition-colors">
              Contacto
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <CartDrawer />

            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="outline" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <nav className="flex flex-col gap-4 mt-8">
                  <Link
                    href="/"
                    className="text-lg font-medium hover:text-green-600 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Inicio
                  </Link>
                  <Link
                    href="/menu"
                    className="text-lg font-medium hover:text-green-600 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Menú
                  </Link>
                  <Link
                    href="/order"
                    className="text-lg font-medium hover:text-green-600 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Ordenar
                  </Link>
                  <Link
                    href="/reservations"
                    className="text-lg font-medium hover:text-green-600 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Reservaciones
                  </Link>
                  <Link
                    href="/gallery"
                    className="text-lg font-medium hover:text-green-600 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Galería
                  </Link>
                  <Link
                    href="/private-events"
                    className="text-lg font-medium hover:text-green-600 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Eventos Privados
                  </Link>
                  <Link
                    href="/contact"
                    className="text-lg font-medium hover:text-green-600 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Contacto
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
