import Link from "next/link"
import { format } from "date-fns"
import { es } from "date-fns/locale"

import { Button } from "@/components/ui/button"
import { createServerAdminClient } from "@/lib/supabase/server"

interface OrdersListProps {
  userId: string
}

export async function OrdersList({ userId }: OrdersListProps) {
  const supabase = createServerAdminClient()

  // Fetch user's orders
  const { data: orders, error } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) {
    return <div className="p-4 bg-red-50 text-red-700 rounded-md">Error al cargar los pedidos: {error.message}</div>
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground mb-4">No tienes pedidos anteriores.</p>
        <Button asChild className="bg-green-600 hover:bg-green-700">
          <Link href="/menu">Explorar Menú</Link>
        </Button>
      </div>
    )
  }

  const statusMap: Record<string, { label: string; color: string }> = {
    pending: { label: "Pendiente", color: "bg-yellow-100 text-yellow-800" },
    processing: { label: "En proceso", color: "bg-blue-100 text-blue-800" },
    completed: { label: "Completado", color: "bg-green-100 text-green-800" },
    cancelled: { label: "Cancelado", color: "bg-red-100 text-red-800" },
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => {
        const formattedDate = format(new Date(order.created_at), "PPP", { locale: es })
        const status = statusMap[order.status] || statusMap.pending

        return (
          <div key={order.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-medium">Pedido #{order.id.substring(0, 8)}</h3>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${status.color}`}>
                    {status.label}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{formattedDate}</p>
              </div>
              <div className="mt-2 sm:mt-0 flex items-center gap-4">
                <p className="font-medium">${order.total.toFixed(2)}</p>
                <div className="flex gap-2">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/order-confirmation?id=${order.id}`}>Ver detalles</Link>
                  </Button>
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/receipt/${order.id}`}>Ver Recibo</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
