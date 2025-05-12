import { getUnreadMessages } from "@/lib/dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

export default async function RecentMessages() {
  const messages = await getUnreadMessages();

  return (
    <Card className="hover:shadow-xl transition-all duration-300">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 bg-gradient-to-r from-amber-400/10 to-amber-500/10">
        <CardTitle className="text-lg font-medium">Messages Récents</CardTitle>
        <MessageCircle className="w-8 h-8 text-amber-400" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id}
                 className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium">{message.sender}</p>
                <p className="text-sm text-gray-500 line-clamp-1">{message.comment}</p>
                <p className="text-xs text-gray-400">
                  {formatDistanceToNow(message.created_at, { locale: fr, addSuffix: true })}
                </p>
              </div>
              <span className="flex h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
