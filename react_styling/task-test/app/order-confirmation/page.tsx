import { Suspense } from "react"
import { notFound } from "next/navigation"
import Link from "next/link"
import { CheckCircle2 } from "lucide-react"

import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { OrderDetails } from "@/components/order/order-details"

interface OrderConfirmationPageProps {
  searchParams: { id?: string }
}

export default function OrderConfirmationPage({ searchParams }: OrderConfirmationPageProps) {
  const orderId = searchParams.id

  if (!orderId) {
    notFound()
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
              <h1 className="text-3xl font-bold">¡Pedido Confirmado!</h1>
              <p className="text-muted-foreground mt-2">Tu pedido ha sido recibido y está siendo procesado.</p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Detalles del Pedido</CardTitle>
                <CardDescription>Pedido #{orderId}</CardDescription>
              </CardHeader>
              <CardContent>
                <Suspense fallback={<div>Cargando detalles del pedido...</div>}>
                  <OrderDetails orderId={orderId} />
                </Suspense>
              </CardContent>
            </Card>

            <div className="mt-8 text-center">
              <p className="text-muted-foreground mb-4">
                Recibirás un correo electrónico con los detalles de tu pedido.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild className="bg-green-600 hover:bg-green-700">
                  <Link href="/menu">Volver al Menú</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/">Ir al Inicio</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
