// Server Component
import { getStats } from '@/lib/dashboard'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Package, TrendingUp, Home, Users } from "lucide-react"


export default async function StatsCards() {
  const stats = await getStats()

  return (
    <div className="grid grid-cols-2 md:grid-cols-6 gap-6">
      <Card className="hover:shadow-xl transition-all duration-300">
        <CardHeader className="p-6 bg-gradient-to-r from-amber-400/10 to-amber-500/10">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold">Commandes</CardTitle>
            <Package className="w-6 h-6 text-amber-500" />
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <p className="text-3xl font-bold">{stats.orders}</p>
          <p className="text-gray-600 mt-1">Commandes à traiter</p>
        </CardContent>
      </Card>
      {/* ... autres cartes ... */}
    </div>
  )
}
