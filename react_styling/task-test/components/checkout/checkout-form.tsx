"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { useCart } from "@/hooks/use-cart"
import { submitOrder } from "@/actions/order-actions"

const formSchema = z.object({
  name: z.string().min(2, {
    message: "El nombre debe tener al menos 2 caracteres.",
  }),
  email: z.string().email({
    message: "Por favor, introduce un email válido.",
  }),
  phone: z.string().min(9, {
    message: "Por favor, introduce un número de teléfono válido.",
  }),
  specialInstructions: z.string().optional(),
})

export function CheckoutForm() {
  const { toast } = useToast()
  const router = useRouter()
  const { items, cartTotal, clearCart } = useCart()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      specialInstructions: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (items.length === 0) {
      toast({
        title: "Carrito vacío",
        description: "No hay productos en tu carrito para realizar el pedido.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const orderData = {
        customerInfo: {
          name: values.name,
          email: values.email,
          phone: values.phone,
          specialInstructions: values.specialInstructions || "",
        },
        items: items,
        total: cartTotal,
      }

      const { success, orderId, error } = await submitOrder(orderData)

      if (success && orderId) {
        clearCart()
        // Redirect directly to the receipt page instead of order confirmation
        router.push(`/receipt/${orderId}`)
      } else {
        throw new Error(error || "Error al procesar el pedido")
      }
    } catch (error) {
      console.error("Error submitting order:", error)
      toast({
        title: "Error",
        description: "Ha ocurrido un error al procesar tu pedido. Por favor, inténtalo de nuevo.",
        variant: "destructive",
      })
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Información de contacto</CardTitle>
        <CardDescription>Introduce tus datos para completar el pedido</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre completo</FormLabel>
                  <FormControl>
                    <Input placeholder="Tu nombre" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="tu@email.com" type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Teléfono</FormLabel>
                  <FormControl>
                    <Input placeholder="+34 600 000 000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="specialInstructions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Instrucciones especiales (opcional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Alergias, preferencias dietéticas, o cualquier otra información relevante"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Indícanos cualquier necesidad especial para tu pedido.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={isSubmitting}>
              {isSubmitting ? "Procesando..." : "Confirmar Pedido"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
