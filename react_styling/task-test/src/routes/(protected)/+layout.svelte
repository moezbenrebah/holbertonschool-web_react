<script lang="ts">
import '../../app.css';
import 'flowbite';
import { onMount } from 'svelte';
import Header from "$lib/components/header/Header.svelte";
import SideNavBar from "$lib/components/sidebar/SideNavBar.svelte";
import { userStore,Role } from "$lib/stores/userFrontStore"

let { children,data } = $props();

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

onMount(async () => {
	const { initFlowbite } = await import('flowbite');
  initFlowbite();	
});


userStore.set({role: roleTrad(data.useRole)});
console.log("userRole",userStore.get().role);

</script>

<Header/>
<SideNavBar/>
<main class="py-2 px-4 sm:ml-64 mt-18">
	{@render children()}
</main>