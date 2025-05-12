import { getUnreadMessages } from '@/lib/dashboard'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageCircle } from "lucide-react"
import { formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'

export default async function UnreadMessages() {
  const messages = await getUnreadMessages()

  return (
    <Card className="hover:shadow-xl transition-all duration-300">
      <CardHeader className="p-6 bg-gradient-to-r from-amber-400/10 to-amber-500/10">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold">Messages Non Lus</CardTitle>
          <MessageCircle className="w-6 h-6 text-amber-500" />
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {messages.length === 0 ? (
          <p className="text-gray-500">Aucun message non lu</p>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.id} className="flex items-start space-x-4">
                <div className="flex-1 space-y-1">
                  <p className="font-medium">{message.sender}</p>
                  <p className="text-sm text-gray-500">{message.comment}</p>
                  <p className="text-xs text-gray-400">
                    {message.created_at ? formatDistanceToNow(new Date(message.created_at), {
                      addSuffix: true,
                      locale: fr
                    }) : 'Date inconnue'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
