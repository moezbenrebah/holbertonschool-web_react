// Server Component
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function DashboardMetrics() {
  const metrics = await getMetrics() // Fonction à créer dans /lib/dashboard.ts

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Commandes</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{metrics.orders}</p>
        </CardContent>
      </Card>
      {/* ... autres métriques ... */}
    </div>
  )
}
