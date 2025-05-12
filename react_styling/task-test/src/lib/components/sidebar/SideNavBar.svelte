<script lang="ts">
    import { Sidebar, SidebarGroup, SidebarItem, SidebarWrapper, SidebarDropdownItem, SidebarDropdownWrapper } from 'flowbite-svelte';
    import { HomeSolid, BellSolid, UsersGroupSolid, RectangleListSolid, ChartPieSolid, UserSolid, EditOutline } from 'flowbite-svelte-icons';
    import AccessControl from "$lib/components/AccessControl.svelte";
    import { Role} from "$lib/stores/authUserStore"
    import { goto } from '$app/navigation';
    import { page } from "$app/state";
    import { userStore} from "$lib/stores/userFrontStore"

    let activeUrl = $state(page.url.pathname);

    $effect(() => {
        activeUrl = page.url.pathname;
    });

    const spanClass = 'flex-1 ms-3 whitespace-nowrap';
    const activeClass = 'text-th-white bg-th-blue';
    const nonActiveClass ="hover:text-th-white hover:bg-th-blue text-th-black "
    const iconeStyle ='transition duration-75 group-hover:text-th-white';
    

    const handLogOut= async ()=>{
      await fetch('/logout', {
        method: 'POST'
      });
      userStore.reset();
      goto("/login");
    }

  </script>
  
  <Sidebar id="sidebar-nav-menu" {activeUrl} aria-label="Sidebar" class="fixed top-0 left-0 z-40 w-64 h-screen px-2 pt-23 transition-transform -translate-x-full bg-th-white border-r border-th-black-light sm:translate-x-0"
>
  <SidebarWrapper divClass="bg-th-white">
    <SidebarGroup>
      <SidebarItem label="Accueil" href="/" class="flex items-center p-2 ts-text rounded-lg" {nonActiveClass} {activeClass}>
        <svelte:fragment slot="icon">
          <HomeSolid class="w-6 h-6 {iconeStyle}" />
        </svelte:fragment>
      </SidebarItem>

      <AccessControl anyRole={[Role.ADMIN, Role.MANAGER,Role.TEAM_MANAGER]}>
      <SidebarItem label="Agents" href="/agents" class="flex items-center p-2 ts-text rounded-lg" {nonActiveClass} {activeClass}>
        <svelte:fragment slot="icon">
          <UsersGroupSolid class="w-6 h-6 {iconeStyle}" />
        </svelte:fragment>
      </SidebarItem>
      </AccessControl>

      <SidebarItem label="Missions" href="/missions" class="flex items-center p-2 ts-text rounded-lg" {nonActiveClass} {activeClass}>
        <svelte:fragment slot="icon">
          <RectangleListSolid class="w-6 h-6 {iconeStyle}" />
        </svelte:fragment>
      </SidebarItem>

      <SidebarItem label="Notifications" href="#" class="flex items-center p-2 ts-text rounded-lg" {nonActiveClass} {activeClass} {spanClass}>
        <svelte:fragment slot="icon">
          <BellSolid class="w-6 h-6 {iconeStyle}" />
        </svelte:fragment>
        <svelte:fragment slot="subtext">
          <span class="inline-flex justify-center items-center p-3 ms-3 w-3 h-3 text-sm font-bold text-th-white bg-th-red rounded-full">3</span>
        </svelte:fragment>
      </SidebarItem>

      <SidebarItem label="Statistiques" href="#" class="flex items-center p-2 ts-text rounded-lg" {nonActiveClass} {activeClass}>
        <svelte:fragment slot="icon">
          <ChartPieSolid class="w-6 h-6 {iconeStyle}" />
        </svelte:fragment>
      </SidebarItem>

      <SidebarGroup border borderClass="pt-4 mt-4 border-t border-th-black-light">
        <SidebarItem label="Profil" href="/profil" class="flex items-center p-2 ts-text rounded-lg" {nonActiveClass} {activeClass}>
          <svelte:fragment slot="icon">
            <UserSolid class="w-6 h-6 {iconeStyle}" />
          </svelte:fragment>
        </SidebarItem>
        <SidebarItem onclick={handLogOut} label="Déconnexion" href="#" class="flex items-center text-th-red hover:text-th-white hover:bg-th-red hover:p-2 transition duration-75 rounded-lg ts-text-bold" spanClass="" />
      </SidebarGroup>
    </SidebarGroup>
  </SidebarWrapper>
</Sidebar>
