'use client'

import { StreamChat } from 'stream-chat'
import { Chat, Channel, ChannelList, Window, MessageList, MessageInput } from 'stream-chat-react'
// @ts-ignore
import 'stream-chat-react/dist/css/v2/index.css'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { useState, useEffect } from 'react'
import { useUserinfoStore } from '@/lib/stores/userinfoStore'
import { useAuthStore } from '@/lib/stores/useAuthStore'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useSession } from 'next-auth/react'

const API_KEY = process.env.NEXT_PUBLIC_STREAM_KEY ?? '';
const chatClient = StreamChat.getInstance(API_KEY);

const MessagesPage = () => {
  const [clientReady, setClientReady] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { data: session, status } = useSession()
  const { user } = useAuthStore()
  const { userInfo, fetchBasicInfo } = useUserinfoStore()

  useEffect(() => {
    console.log('🔄 MessagesPage - Status de la session:', status)
    console.log('👤 Session:', session)
    console.log('👤 User:', user)
    console.log('👤 UserInfo:', userInfo)
    console.log('🔄 État du chargement:', {
      hasUser: !!user?.users_id,
      hasChatClient: !!chatClient,
      hasUserInfo: !!userInfo,
      isLoading
    })

    if (status === 'loading') return
    if (status === 'unauthenticated') {
      setError('Veuillez vous connecter pour accéder aux messages')
      setIsLoading(false)
      return
    }

    const loadUserInfo = async () => {
      try {
        if (session?.user?.id) {
          console.log('🔄 Chargement des informations utilisateur pour:', session.user.id)
          await fetchBasicInfo(session.user.id.toString())
        }
      } catch (error) {
        console.error('❌ Erreur lors du chargement des informations:', error)
        setError('Erreur lors du chargement des informations utilisateur')
      } finally {
        setIsLoading(false)
      }
    }

    loadUserInfo()
  }, [session, status, fetchBasicInfo])

  useEffect(() => {
    const initChat = async () => {
      if (!user?.users_id || !chatClient || !userInfo) {
        console.log('❌ Conditions non remplies pour initChat:', {
          hasUser: !!user?.users_id,
          hasChatClient: !!chatClient,
          hasUserInfo: !!userInfo
        })
        return
      }

      try {
        const userId = user.users_id.toString()
        console.log('🔑 Tentative de connexion au chat pour userId:', userId)

        const response = await fetch('/api/stream/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId }),
        })

        if (!response.ok) {
          throw new Error('Erreur lors de la récupération du token')
        }

        const { token } = await response.json()
        if (!token) throw new Error('Token non reçu')

        console.log('✅ Token reçu, connexion au chat...')
        await chatClient.connectUser(
          {
            id: userId,
            name: userInfo.first_name || user.name || 'Utilisateur',
            image: userInfo.photo_url || undefined,
          },
          token
        )

        // Récupérer les canaux basés sur les logements
        const channelsResponse = await fetch(`/api/stream/channels?userId=${userId}&accountType=${user.account_type}`)
        const { channels } = await channelsResponse.json()

        if (!channels || channels.length === 0) {
          console.log('⚠️ Aucun canal trouvé pour l\'utilisateur')
          toast.info('Vous n\'avez pas encore de logements ou de codes d\'accès')
        }

        setClientReady(true)
        setError(null)
        console.log('✅ Connexion au chat réussie')
      } catch (error) {
        console.error('❌ Erreur de connexion au chat:', error)
        setError('Erreur de connexion au chat. Veuillez réessayer plus tard.')
        toast.error('Erreur de connexion au chat')
      }
    }

    if (!isLoading) {
      initChat()
    }

    return () => {
      if (clientReady) {
        console.log('🔌 Déconnexion du chat')
        chatClient?.disconnectUser()
      }
    }
  }, [user, userInfo, clientReady, isLoading])

  if (status === 'loading' || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
          <p className="text-gray-600">Chargement des informations...</p>
        </div>
      </div>
    )
  }

  if (status === 'unauthenticated') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center p-6 bg-red-50 rounded-lg">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Non authentifié</h2>
          <p className="text-gray-600">Veuillez vous connecter pour accéder aux messages</p>
          <button
            onClick={() => window.location.href = '/login'}
            className="mt-4 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
          >
            Se connecter
          </button>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center p-6 bg-red-50 rounded-lg">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Erreur</h2>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    )
  }

  if (!clientReady || !chatClient) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
          <p className="text-gray-600">Initialisation du chat...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="flex items-center gap-4 p-4">
        <SidebarTrigger className="text-xl" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink className="text-xl">Messages</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="grid gap-8 p-4">
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm h-[600px]">
          <Chat client={chatClient}>
            <div className="flex h-full">
              <div className="w-1/4 border-r dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
                <ChannelList
                  filters={{
                    members: { $in: [user.users_id.toString()] }
                  }}
                  sort={{ last_message_at: -1 }}
                  options={{
                    state: true,
                    watch: true,
                    presence: true
                  }}
                />
              </div>
              <div className="w-3/4">
                <Channel>
                  <Window>
                    <MessageList
                      disableQuotedMessages={true}
                    />
                    <MessageInput
                      focus={true}
                      additionalTextareaProps={{
                        placeholder: "Écrivez votre message...",
                        rows: 1
                      }}
                    />
                  </Window>
                </Channel>
              </div>
            </div>
          </Chat>
        </div>
      </div>
    </>
  )
}

export default MessagesPage
