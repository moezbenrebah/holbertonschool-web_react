import { fail } from '@sveltejs/kit';
import { z } from "zod";
import { getAuthToken } from "$lib/api/auth";
import { authUserStore,Role } from "$lib/stores/authUserStore";
import type { Actions } from './$types';

const schema = z.object({
    email: z.string()
        .min(1, 'Champ obligatoire')
        .max(100,("L'email ne peut pas dépasser 100 caractères"))
        .email("Email invalide")
        // .regex(/^[a-zA-Z0-9._-]+@sgs\.(com|fr)$/,"L'email doit être une adresse sgs")
        ,
    password: z.string()
        .min(1, 'Champ obligatoire')
        .min(8,("Le mot de passe doit faire au moins 8 caractères"))
        .max(32, "Le mot de passe ne doit pas dépasser 32 caractères")
        // .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).*$/,"Le mot de passe doit contenir au moins 1 majuscule, 1 minuscule, 1 chiffre et 1 caractère spécial(!@#$%^&*)")
});

type FormData = z.infer<typeof schema>;


function roleTrad(authRole: string): Role{
  switch (authRole) {
    case "admin":
      return Role.ADMIN
    case "manager":
      return Role.MANAGER
    case "team_manager":
      return Role.TEAM_MANAGER
    case "agent":
      return Role.USER
    default:
      return Role.USER
  }
} 

export const actions : Actions = {
    default: async ({ request, cookies }) => {

    const formData = Object.fromEntries(await request.formData()) as Partial<FormData> ;
    const result = schema.safeParse(formData);

    const email : string = formData.email?.toString() || "";

    if (!result.success) {
        const errors = result.error.flatten().fieldErrors;
        return fail(400, { errors,email});
    }

    try {
      const apiLoginResponse = await getAuthToken(result.data.email, result.data.password)

      if (!apiLoginResponse.ok) {
        return fail(401, { errors: {_global: ['Identifiants invalides']}});
      }
      const {token,userId,userRole} = await apiLoginResponse.json();
  
      if(!token || !userId){
        return fail(400, { error: { _global: ["Un problème technique a été détecté. Si l'erreur persiste après un nouvel essai, merci de signaler l'incident au service informatique."] }});
      }
  
      cookies.set('auth_token', token, { path: '/', httpOnly: true, secure: true, sameSite: 'lax', maxAge: 86400,});
      authUserStore.set({ userId:userId, role: roleTrad(userRole) });
      
      return { success: true };
      
    } catch (error) {
      return fail(500, { error: { _global: ["Erreur serveur"] } 
    });
    }

  }

}