import { redirect } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { AdminOrdersList } from "@/components/admin/admin-orders-list"

export default async function AdminOrdersPage() {
  const supabase = createServerSupabaseClient()

  // Check if user is authenticated and has admin role
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    // Redirect to login if not authenticated
    redirect("/login")
  }

  // In a real app, you would check for admin role here
  // For now, we'll assume the authenticated user is an admin

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8 text-center">Administración de Pedidos</h1>

          <div className="max-w-6xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Todos los Pedidos</CardTitle>
                <CardDescription>Gestiona los pedidos de los clientes</CardDescription>
              </CardHeader>
              <CardContent>
                <AdminOrdersList />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
