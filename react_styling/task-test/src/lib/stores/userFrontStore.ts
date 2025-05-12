import { writable,get} from 'svelte/store';

export interface UserStore {
    role: Role | '';
}

export enum Role {
    ADMIN = 'admin',
    MANAGER = 'manager',
    TEAM_MANAGER = 'team_manager',
    USER = 'agent',
}

const roleHierarchy: Record<Role, number> = {
  [Role.ADMIN]: 100,
  [Role.MANAGER]: 90,
  [Role.TEAM_MANAGER]: 50,
  [Role.USER]: 10
};

const createUserStore = () => {
  const { subscribe, set, update } = writable<UserStore>({
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
    reset: () => set({ role: Role.USER }),
    get: () => get({ subscribe }),
    hasRole,
    hasAnyRole
  };
};

export const userStore = createUserStore();