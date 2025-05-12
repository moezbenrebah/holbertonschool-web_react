import { authUserStore } from "$lib/stores/authUserStore"


export function load() {
    
    console.log("auth",authUserStore.get().role);
    
    const useRole: string = authUserStore.get().role;

    return { useRole };
}
