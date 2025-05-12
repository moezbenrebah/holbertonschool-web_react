"use client"

import Link from "next/link"
import {
	ChevronUp,
	Home,
	Inbox,
	LogOut,
	MapPin,
	ShoppingCart,
	User2,
	MessageCircle,
	KeyRound
} from "lucide-react"
import { useEffect } from "react"
import { useSession } from "next-auth/react"

// Stores
import { useUserinfoStore } from "@/lib/stores/userinfoStore"

// Components
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"



export function AppSidebar() {
  const { data: session, status } = useSession()

  useEffect(() => {
	console.log('🔵 Status de la session :', status);
  	console.log('🔵 Données de la session :', session);
  }, [status, session])


 // Si la session est en cours de chargement
 if (status === "loading") {
    return <div>Chargement...</div>
  }

   // Si l'utilisateur n'est pas connecté
   if (status === "unauthenticated") {
	console.log("🔴 L'utilisateur n'est pas connecté, redirection vers la page de login")
    window.location.href = "/login"
    return null
  }


  const userInfo = useUserinfoStore((state) => state.userInfo)
  const fetchUserInfo = useUserinfoStore((state) => state.fetchBasicInfo)

  // verifie si utilisateur est connecter
  useEffect(() => {
    if (session?.user?.id) {
      fetchUserInfo(session.user.id.toString())
    }
  }, [session?.user?.id, fetchUserInfo])



  // gestion de deconnexion
  const handleLogout = async () => {
	try {
	  // Appeler l'API de déconnexion
	  const response = await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });

	  if (!response.ok) {
		throw new Error('Erreur lors de la déconnexion');
	  }
	  console.log("🔴 Déconnexion réussie")
	  console.log("🔴 attente de redirection vers la page de login")

	  // Redirection après succès
	  setTimeout(() => {
		window.location.href = '/login';
	  }, 3000);	} catch (error) {
	  console.error('Erreur lors de la déconnexion :', error);
	}
  };

// Menu items
const items = [
	{
	  title: "Dashboard",
	  url: "/dashboard",
	  icon: Home,
	},
	{
	  title: "Logement",
	  url: "/dashboard/property",
	  icon: Inbox,
	},
	{
	  title: "Carte information",
	  url: "/dashboard/infoCard",
	  icon: MapPin,
	},
	{
	  title: "Boutique",
	  url: "/dashboard/ShopManage",
	  icon: ShoppingCart,
	},
	{
	  title: "Code Access",
	  url: "/dashboard/acessCode",
	  icon: KeyRound,
	},
	{
	  title: "Messagerie",
	  url: "/dashboard/Messages",
	  icon: MessageCircle,
	},
	{
	  title: "Deconnexion",
	  url: "#",
	  icon: LogOut,
	  className: "text-red-500",
	  onClick: handleLogout,
	}
  ]


  return (
    <Sidebar
      collapsible="icon"
      className="w-64 h-full bg-slate-100"
      style={{ "--sidebar-width-icon": "4rem" } as React.CSSProperties}
    >
      <SidebarContent>
        <SidebarHeader>
        </SidebarHeader>
        <SidebarGroup className="flex px-4 py-8">
          <SidebarGroupLabel className="text-lg font-bold text-black">Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="flex py-4 items-center text-xl gap-4">
                    {item.onClick ? (
                      <button onClick={item.onClick} className="flex items-center gap-4 w-full">
                        <item.icon width={64} height={64} className="text-amber-500"/>
                        <span>{item.title}</span>
                      </button>
                    ) : (
                      <Link href={item.url} className="flex items-center gap-4 w-full">
                        <item.icon width={64} height={64} className="text-amber-500"/>
                        <span>{item.title}</span>
                      </Link>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="flex flex-col gap-4 p-2 h-18 group-data-[collapsible=icon]:items-center">
        <SidebarMenu className="w-full h-full">
          <SidebarMenuItem className="w-full h-full">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="w-full h-full p-4">
                  <div className="flex items-center gap-3 w-full ">
                    {userInfo?.photo_url ? (
                      <Avatar>
                        <AvatarImage src={userInfo.photo_url} />
                      </Avatar>
                    ) : (
                      <User2 className="w-10 h-10 p-2 bg-gray-100 rounded-xl" />
                    )}
                    <div className="flex flex-col text-left">
                      <span className="text-sm text-gray-500">{session?.user?.email || "Email"}</span>
                    </div>
                    <ChevronUp className="ml-auto" />
                  </div>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width]"
              >
                <DropdownMenuItem className="text-sm bg-white text-gray-700 hover:bg-amber-200">
                  <Link href="/dashboard/account/profile">
                    <span>Mon compte</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="text-sm text-gray-700 hover:bg-amber-200">
                  <Link href="/dashboard/account/settings">
                    <span>Paramètres</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="text-sm text-gray-700 hover:bg-amber-200">
                  <button onClick={handleLogout}>
                    <span>Déconnexion</span>
                  </button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
