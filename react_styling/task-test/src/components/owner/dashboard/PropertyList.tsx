import { getProperties } from '@/lib/dashboard'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Home } from "lucide-react"
import Image from "next/image"

export default async function PropertyList() {
  const properties = await getProperties()

  return (
    <Card className="hover:shadow-xl transition-all duration-300">
      <CardHeader className="p-6 bg-gradient-to-r from-amber-400/10 to-amber-500/10">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold">Mes Propriétés</CardTitle>
          <Home className="w-6 h-6 text-amber-500" />
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {properties.length === 0 ? (
          <p className="text-gray-500">Aucune propriété</p>
        ) : (
          <div className="space-y-4">
            {properties.map((property) => (
              <div key={property.id} className="flex items-center space-x-4">
                <div className="relative w-16 h-16">
                  <Image
                    src={property.photo_url || '/placeholder.jpg'}
                    alt={property.name}
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
                <div>
                  <p className="font-medium">{property.name}</p>
                  <p className="text-sm text-gray-500">{property.city}</p>
                </div>
				<div className="flex items-center justify-between">
					<p className="text-sm text-gray-500">{property.city}</p>
					<p className="text-sm text-gray-500">{property.city}</p>
				</div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
