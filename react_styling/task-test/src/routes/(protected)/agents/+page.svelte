<script lang="ts">
    import { Tabs, TabItem, Button } from 'flowbite-svelte';
    import { CirclePlusSolid } from 'flowbite-svelte-icons';
    import SidebarForm from "$lib/components/sidebar/SidebarForm.svelte";
    import FormAgent from "$lib/components/form/agents/FormAgent.svelte"
    import FormTeam from "$lib/components/form/Team/FormTeam.svelte"
    import TableUser from "$lib/components/tables/TableUser.svelte";
    import TeamCard from "$lib/components/card/TeamCard.svelte"
    import type { ActionData,PageData } from './$types';
    import { resetUserSelectedStore } from "$lib/stores/form/agentStore";
	import type {  ComponentType } from 'svelte';

    let { form,data } : { form: ActionData,data: PageData}  = $props();
 
    let drawerHidden: boolean = $state(true);
    let FormComponent: ComponentType = $state(FormAgent);
    let sidbarTitle :string = $state("");

    function openDrawer(component: ComponentType,DrawerTitle :string): void {
        FormComponent = component;
        drawerHidden = false;
        sidbarTitle = DrawerTitle
        form = null
    }

    const tabsTitleAgent="Agents"
    const tabsTitleTeam="Équipes"
    const tabsClass="mt-4";
    
    const tabItemTitleRow="flex flex-col items-center sm:flex-row sm:justify-between gap-4 py-4"
    const tabItemActiveClass="inline-block ts-text-bold text-center disabled:cursor-not-allowed p-4 text-th-blue border-b-2 border-th-blue active"
    const tabItemInactiveClass="inline-block ts-text text-center disabled:cursor-not-allowed p-4 border-b-2 border-transparent hover:text-th-black text-th-black"
    const btnClass="text-th-white bg-th-blue ts-text-bold"
    const btnIconClass="mr-2"
    const tabItemTitle="ts-title-2" 

    const userList=data.userList;
    const teamList = data.teamList
    const teamsUsers = data.teamWhiteUsers;
    const unassignedUsers=data.teamUnassignedUsers;

</script>
  
<Tabs contentClass={tabsClass} tabStyle="underline" >
    <TabItem open title={tabsTitleAgent} activeClasses={tabItemActiveClass} inactiveClasses={tabItemInactiveClass}>
        <div class={tabItemTitleRow}>
            <h1 class={tabItemTitle}>{tabsTitleAgent}</h1>
            <Button size="lg" class={btnClass} on:click={() => {openDrawer(FormAgent,"Nouvel agent"),resetUserSelectedStore()}}><CirclePlusSolid class={btnIconClass} />Ajouter un agent</Button>
        </div>
        <TableUser userList={userList}  openDrawer={openDrawer} />
    </TabItem>
    <TabItem title={tabsTitleTeam} activeClasses={tabItemActiveClass} inactiveClasses={tabItemInactiveClass}>
        <div class={tabItemTitleRow}>
            <h1 class={tabItemTitle}>{tabsTitleTeam}</h1>
            <Button size="lg" class={btnClass} on:click={() => (openDrawer(FormTeam,"Nouvelle équipe"))}><CirclePlusSolid class={btnIconClass} />Ajouter une équipe</Button>
        </div>
        <div class="grid sm:grid-cols-2 lg:grid-cols-3 grid-cols-1 gap-x-8 gap-y-4">
            {#each teamsUsers as teamUsers (teamUsers.id)}
                <TeamCard teamName={teamUsers.teamName} users={teamUsers.users} openDrawer={openDrawer}/>
            {/each}
        </div>
    </TabItem>
</Tabs>
<SidebarForm bind:hidden={drawerHidden} formProps={{teamList:teamList,teamWhiteUsers:teamsUsers,unassignedUsers:unassignedUsers}} {sidbarTitle} {form} {FormComponent} />