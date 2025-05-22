import { format } from "date-fns"
import { es } from "date-fns/locale"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { getOrderById } from "@/actions/order-actions"

interface OrderDetailsProps {
  orderId: string
}

export async function OrderDetails({ orderId }: OrderDetailsProps) {
  const { success, order, error } = await getOrderById(orderId)

  if (!success || !order) {
    return <div className="p-4 bg-red-50 text-red-700 rounded-md">Error al cargar los detalles del pedido: {error}</div>
  }

  const formattedDate = format(new Date(order.created_at), "PPP 'a las' p", { locale: es })
  const statusMap: Record<string, { label: string; color: string }> = {
    pending: { label: "Pendiente", color: "bg-yellow-100 text-yellow-800" },
    processing: { label: "En proceso", color: "bg-blue-100 text-blue-800" },
    completed: { label: "Completado", color: "bg-green-100 text-green-800" },
    cancelled: { label: "Cancelado", color: "bg-red-100 text-red-800" },
  }

  const status = statusMap[order.status] || statusMap.pending

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Fecha del pedido</p>
          <p>{formattedDate}</p>
        </div>
        <div className="mt-2 sm:mt-0 sm:text-right">
          <p className="text-sm text-muted-foreground">Estado</p>
          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${status.color}`}>
            {status.label}
          </span>
        </div>
      </div>

      <div className="flex justify-end">
        <Button asChild variant="outline" size="sm">
          <Link href={`/receipt/${orderId}`}>Ver Recibo</Link>
        </Button>
      </div>

      <Separator />

      <div>
        <h3 className="font-medium mb-2">Información de contacto</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Nombre</p>
            <p>{order.customer_name}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Email</p>
            <p>{order.customer_email}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Teléfono</p>
            <p>{order.customer_phone || "No proporcionado"}</p>
          </div>
        </div>
      </div>

      {order.special_instructions && (
        <>
          <Separator />
          <div>
            <h3 className="font-medium mb-2">Instrucciones especiales</h3>
            <p>{order.special_instructions}</p>
          </div>
        </>
      )}

      <Separator />

      <div>
        <h3 className="font-medium mb-4">Productos</h3>
        <div className="space-y-4">
          {order.items.map((item: any) => (
            <div key={item.id} className="flex items-center gap-4">
              <div className="relative w-16 h-16 rounded-md overflow-hidden bg-gray-100">
                <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                  {item.name.charAt(0)}
                </div>
              </div>
              <div className="flex-1">
                <h4 className="font-medium">{item.name}</h4>
                <p className="text-sm text-muted-foreground">
                  ${item.price.toFixed(2)} x {item.quantity}
                </p>
              </div>
              <div className="text-right">
                <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      <div className="space-y-2">
        <div className="flex justify-between">
          <span>Subtotal:</span>
          <span>${(order.total / 1.1).toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Impuestos (10%):</span>
          <span>${(order.total - order.total / 1.1).toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-bold">
          <span>Total:</span>
          <span>${order.total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  )
}
