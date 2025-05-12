<script lang="ts">
    import { Tabs, TabItem, Button } from 'flowbite-svelte';
    import { CirclePlusSolid } from 'flowbite-svelte-icons';
    import { Role } from "$lib/stores/authUserStore"
    import AccessControl from "$lib/components/AccessControl.svelte";
    import type { ActionData,PageData } from './$types'
	import type {  ComponentType } from 'svelte';
    import SidebarForm from "$lib/components/sidebar/SidebarForm.svelte";
    import MissionCard from "$lib/components/card/MissionCard.svelte";
    import MissionShiftCard from "$lib/components/card/MissionShiftCard.svelte";
    import LocationCard from "$lib/components/card/LocationCard.svelte";
    import FormLocation from "$lib/components/form/location/FormLocation.svelte";

    // sup
    import FormAgent from "$lib/components/form/agents/FormAgent.svelte"

    type Mission = {
        id: number;
        start: string;
        end: string;
        customer: string;
        product: string;
        location: string;
        address: string;
        team: string;
    };

    let { form,data } : { form: ActionData,data: PageData}  = $props();
 
    let drawerHidden: boolean = $state(true);
    let FormComponent: ComponentType = $state(FormAgent);
    let sidbarTitle :string = $state("");
    let resetKey = $state(0)

    function openDrawer(component: ComponentType,DrawerTitle :string): void {
        FormComponent = component;
        drawerHidden = false;
        sidbarTitle = DrawerTitle;
    }

    function groupMissionsByDate(missions: Mission[]) {
        const today = new Date();
        const todayMissions: Mission[] = [];
        const upcomingMissions: Mission[] = [];

        for (const mission of missions) {
            const startDate = new Date(mission.start);

            const isSameDay =
            startDate.getDate() === today.getDate() &&
            startDate.getMonth() === today.getMonth() &&
            startDate.getFullYear() === today.getFullYear();

            const isSameMonth =
            startDate.getDate() > today.getDate() &&
            startDate.getMonth() === today.getMonth() &&
            startDate.getFullYear() === today.getFullYear();

            if (isSameDay) {
            todayMissions.push(mission);
            } else if (isSameMonth) {
            upcomingMissions.push(mission);
            }
        }

        return {
            today: todayMissions,
            upcoming: upcomingMissions,
        };
    }

    const missionList = groupMissionsByDate(data.missionList);
    const missionShiftsList = data.missionShifts;
    const locationList = data.location;

    const tabsTitleMissions="Missions"
    const tabsTitleShift="Quarts"
    const tabsTitleLocation="Lieux"
    const tabsClass="mt-4";
    const tabItemActiveClass="inline-block ts-text-bold text-center disabled:cursor-not-allowed p-4 text-th-blue border-b-2 border-th-blue active"
    const tabItemInactiveClass="inline-block ts-text text-center disabled:cursor-not-allowed p-4 border-b-2 border-transparent hover:text-th-black text-th-black"
    
    const tabItemTitle="ts-title-2" 
    const tabItemTitleRow="flex flex-col items-center sm:flex-row sm:justify-between gap-4 py-4"
    const btnClass="text-th-white bg-th-blue ts-text-bold"
    const btnIconClass="mr-2"

    const missionListTitleClass="ts-text-title text-th-black-light"

</script>
  
<Tabs contentClass={tabsClass} tabStyle="underline" >
    <TabItem open title={tabsTitleMissions} activeClasses={tabItemActiveClass} inactiveClasses={tabItemInactiveClass}>
        <div class={tabItemTitleRow}>
            <h1 class={tabItemTitle}>{tabsTitleMissions}</h1>
            <AccessControl anyRole={[Role.ADMIN, Role.MANAGER,Role.TEAM_MANAGER]}>
            <Button size="sm" class={btnClass} on:click={() => {openDrawer(FormAgent,"Nouvel mission")}}><CirclePlusSolid class={btnIconClass} />Ajouter une mission</Button>
            </AccessControl>
        </div>
        {#if missionList.today.length != 0 || missionList.upcoming.length != 0}
            {#if missionList.today.length != 0}
                <h4 class={missionListTitleClass}>En cours</h4>
                {#each missionList.today as mission}
                    <MissionCard {mission}/>
                {/each}
            {/if}
            {#if missionList.upcoming.length != 0}
                <h4 class={missionListTitleClass}>À venir</h4>
                {#each missionList.upcoming as mission}
                    <MissionCard {mission}/>
                {/each}
            {/if}
        {:else}
        <div class="text-center">
            <p class="ts-text-title text-th-red">Pas de mission en vue pour les jours à venir.</p>
        </div>
        {/if}

    </TabItem>
    <TabItem title={tabsTitleShift} activeClasses={tabItemActiveClass} inactiveClasses={tabItemInactiveClass}>
        <div class={tabItemTitleRow}>
            <h1 class={tabItemTitle}>{tabsTitleShift}</h1>
            <AccessControl anyRole={[Role.ADMIN, Role.MANAGER,Role.TEAM_MANAGER]}>
            <Button size="sm" class={btnClass} on:click={() => (openDrawer(FormAgent,"Nouvelle mission"))}><CirclePlusSolid class={btnIconClass} />Ajouter une mission</Button>
            </AccessControl>
        </div>
        {#each missionShiftsList as missionShifts}
        <MissionShiftCard {missionShifts}/>
        {/each}
    </TabItem>
    <TabItem title={tabsTitleLocation} activeClasses={tabItemActiveClass} inactiveClasses={tabItemInactiveClass}>
        <div class={tabItemTitleRow}>
            <h1 class={tabItemTitle}>{tabsTitleLocation}</h1>
            <AccessControl anyRole={[Role.ADMIN, Role.MANAGER,Role.TEAM_MANAGER]}>
            <Button size="sm" class={btnClass} on:click={() => (openDrawer(FormLocation,"Nouveau lieu"))}><CirclePlusSolid class={btnIconClass} />Ajouter un lieux</Button>
            </AccessControl>
        </div>
        {#each locationList as location}
        <LocationCard {location}/>
        {/each}
        
    </TabItem>
</Tabs>
<SidebarForm bind:hidden={drawerHidden} formProps={{teamList:data.teamList}} {sidbarTitle} {form} {FormComponent} />