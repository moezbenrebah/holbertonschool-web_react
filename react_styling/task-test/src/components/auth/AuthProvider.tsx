//--- Composant AuthProvider ---
//--- Composant pour la gestion de l'authentification ---//


// React imports
import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
// Stores
import { useAuthStore } from '@/lib/stores/useAuthStore';


export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const { setUser } = useAuthStore();

  useEffect(() => {
    console.log('🔄 AuthProvider - Initialisation...');
    console.log('📦 Session:', session);

    if (session?.user) {
      console.log('✅ Utilisateur trouvé dans la session:', session.user);
      setUser({
        users_id: session.user.id,
        email: session.user.email || '',
        name: session.user.name || '',
        user_name: session.user.name || '',
        account_type: session.user.account_type || 'user'
      });
    } else {
      console.log('❌ Aucun utilisateur dans la session');
    }
  }, [session, setUser]);

  return <>{children}</>;
}
