<script lang="ts">
    import { authUserStore, type Role } from '$lib/stores/authUserStore';
    import { userStore } from "$lib/stores/userFrontStore"
  
    let {
      role,
      anyRole
    } = $props<{
      role?: Role;
      anyRole?: Role[];
    }>();
    
    const hasAccess = $derived(
      role ? userStore.hasRole(role) :
      anyRole?.length ? userStore.hasAnyRole(...anyRole) :
      true
    );
  </script>
  
  {#if hasAccess}
    <slot />
  {/if}