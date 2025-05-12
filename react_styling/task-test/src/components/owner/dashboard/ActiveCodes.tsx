import { getActiveCodes } from '@/lib/dashboard'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { KeyRound } from "lucide-react"
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

export default async function ActiveCodes() {
  const codes = await getActiveCodes()

  return (
    <Card className="hover:shadow-xl transition-all duration-300">
      <CardHeader className="p-6 bg-gradient-to-r from-amber-400/10 to-amber-500/10">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold">Codes d'Accès Actifs</CardTitle>
          <KeyRound className="w-6 h-6 text-amber-500" />
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {codes.length === 0 ? (
          <p className="text-gray-500">Aucun code actif</p>
        ) : (
          <div className="space-y-4">
            {codes.map((code) => (
              <div key={code.id} className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{code.accommodation_name}</p>
                  <p className="text-sm text-gray-500">{code.code}</p>
                </div>
                <p className="text-xs text-gray-400">
                  Expire le {format(new Date(code.expiration_date), 'dd/MM/yyyy', { locale: fr })}
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
