// src/lib/stores/authUserStore.ts
import { writable, get } from 'svelte/store';

export interface AuthUser {
    userId: string;
    role: Role;
}

export enum Role {
  ADMIN = 'admin',
  MANAGER = 'manager',
  TEAM_MANAGER = 'team_manager',
  USER = 'agent',
}

const roleHierarchy = {
  [Role.ADMIN]: 100,
  [Role.MANAGER]: 90,
  [Role.TEAM_MANAGER]: 50,
  [Role.USER]: 10
};

const createAuthUserStore = () => {
  const { subscribe, set, update } = writable<AuthUser>({
    userId: "",
    role: Role.USER
  });

  const hasRole = (requiredRole: Role) => {
    const user = get({ subscribe });
    return roleHierarchy[user.role] >= roleHierarchy[requiredRole];
  };

  const hasAnyRole = (...roles: Role[]) => {
    return roles.some(role => hasRole(role));
  };

  return {
    subscribe,
    set,
    update,
    reset: () => set({ userId: "", role: Role.USER }),
    get: () => get({ subscribe }),
    getUserId: () => get({ subscribe }).userId,
    hasRole,
    hasAnyRole
  };
};

export const authUserStore = createAuthUserStore();