"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { format } from "date-fns"
import { es } from "date-fns/locale"

import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getSupabaseClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"

export function AdminOrdersList() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()
  const supabase = getSupabaseClient()

  useEffect(() => {
    fetchOrders()
  }, [])

  async function fetchOrders() {
    try {
      setLoading(true)

      // For client-side, we'll use the regular client but make sure the user has admin rights
      // In a real app, you'd check for admin role here
      const { data, error } = await supabase.from("orders").select("*").order("created_at", { ascending: false })

      if (error) throw error

      setOrders(data || [])
    } catch (err: any) {
      setError(err.message)
      toast({
        title: "Error",
        description: "No se pudieron cargar los pedidos",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  async function updateOrderStatus(orderId: string, status: string) {
    try {
      const { error } = await supabase.from("orders").update({ status }).eq("id", orderId)

      if (error) throw error

      // Update local state
      setOrders(orders.map((order) => (order.id === orderId ? { ...order, status } : order)))

      toast({
        title: "Estado actualizado",
        description: `Pedido #${orderId.substring(0, 8)} actualizado a ${status}`,
      })
    } catch (err: any) {
      toast({
        title: "Error",
        description: "No se pudo actualizar el estado del pedido",
        variant: "destructive",
      })
    }
  }

  const statusMap: Record<string, { label: string; color: string }> = {
    pending: { label: "Pendiente", color: "bg-yellow-100 text-yellow-800" },
    processing: { label: "En proceso", color: "bg-blue-100 text-blue-800" },
    completed: { label: "Completado", color: "bg-green-100 text-green-800" },
    cancelled: { label: "Cancelado", color: "bg-red-100 text-red-800" },
  }

  if (loading) {
    return <div className="text-center py-8">Cargando pedidos...</div>
  }

  if (error) {
    return <div className="p-4 bg-red-50 text-red-700 rounded-md">Error: {error}</div>
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No hay pedidos disponibles.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => {
        const formattedDate = format(new Date(order.created_at), "PPP 'a las' p", { locale: es })
        const status = statusMap[order.status] || statusMap.pending

        return (
          <div key={order.id} className="border rounded-lg p-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-medium">Pedido #{order.id.substring(0, 8)}</h3>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${status.color}`}>
                    {status.label}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{formattedDate}</p>
                <p className="text-sm mt-1">
                  <span className="font-medium">Cliente:</span> {order.customer_name} ({order.customer_email})
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <div className="w-full sm:w-auto">
                  <Select defaultValue={order.status} onValueChange={(value) => updateOrderStatus(order.id, value)}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue placeholder="Cambiar estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pendiente</SelectItem>
                      <SelectItem value="processing">En proceso</SelectItem>
                      <SelectItem value="completed">Completado</SelectItem>
                      <SelectItem value="cancelled">Cancelado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <p className="font-medium">${order.total.toFixed(2)}</p>
                  <div className="flex gap-2">
                    <Button asChild variant="outline" size="sm" className="w-full sm:w-auto">
                      <Link href={`/order-confirmation?id=${order.id}`}>Ver detalles</Link>
                    </Button>
                    <Button asChild variant="outline" size="sm" className="w-full sm:w-auto">
                      <Link href={`/receipt/${order.id}`}>Ver Recibo</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
