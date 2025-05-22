"use client"

import { Minus, Plus, Trash2 } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/hooks/use-cart"
import { useToast } from "@/hooks/use-toast"

export function Cart() {
  const { items, removeItem, updateItemQuantity, clearCart, cartTotal } = useCart()
  const { toast } = useToast()
  const router = useRouter()

  const handleCheckout = () => {
    if (items.length === 0) {
      toast({
        title: "Carrito vacío",
        description: "Añade algunos productos antes de continuar.",
        variant: "destructive",
      })
      return
    }

    // Redirect to checkout page
    router.push("/checkout")
  }

  return (
    <Card className="max-h-[calc(100vh-10rem)] flex flex-col">
      <CardHeader>
        <CardTitle>Tu Carrito</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 overflow-y-auto flex-1">
        {items.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-muted-foreground">Tu carrito está vacío</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-4">
                <div className="relative w-16 h-16 rounded-md overflow-hidden">
                  <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                </div>
                <div className="flex-1 grid gap-1">
                  <h4 className="font-medium">{item.name}</h4>
                  <div className="text-sm text-muted-foreground">
                    ${item.price.toFixed(2)} x {item.quantity}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => updateItemQuantity(item.id, Math.max(1, item.quantity - 1))}
                  >
                    <Minus className="h-4 w-4" />
                    <span className="sr-only">Decrease quantity</span>
                  </Button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                  >
                    <Plus className="h-4 w-4" />
                    <span className="sr-only">Increase quantity</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 text-red-500"
                    onClick={() => removeItem(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Remove item</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {items.length > 0 && (
          <>
            <Separator />
            <div className="flex justify-between">
              <span className="font-medium">Subtotal:</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Impuestos (10%):</span>
              <span>${(cartTotal * 0.1).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Total:</span>
              <span className="font-bold">${(cartTotal * 1.1).toFixed(2)}</span>
            </div>
          </>
        )}
      </CardContent>
      <CardFooter>
        <Button
          className="w-full bg-green-600 hover:bg-green-700"
          onClick={handleCheckout}
          disabled={items.length === 0}
        >
          Proceder al Pago
        </Button>
      </CardFooter>
    </Card>
  )
}
