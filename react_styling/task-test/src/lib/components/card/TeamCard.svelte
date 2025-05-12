<script lang="ts" >
    import { AccordionItem, Accordion,Button} from 'flowbite-svelte';
    import FormTeam from "$lib/components/form/Team/FormTeam.svelte";
    import RoleBadge from "$lib/components/badge/RoleBadge.svelte"
    import StatusBadge from "$lib/components/badge/StatusBadge.svelte"

    const {
        teamName,
        users,
        openDrawer
    } = $props();

    const countUsersStatus = (users) => {
        let available = 0, unavailable = 0;
        
        users.forEach(user => {
            user.status === "0" ? unavailable++ : available++;
        });

        return { available, unavailable };
    };

    const nbUsers = users.length
    const usersStatus = countUsersStatus(users);

    const btnEditClass="ts-text-bold text-th-blue hover:text-th-white hover:bg-th-blue"
    const accordionItemClass= "flex items-center justify-between w-full ts-text text-left group-first:rounded-t-xl border-b border-th-black-light py-5 text-th-black"

</script>

<div class="max-w-sm h-fit py-6 px-4 border border-th-black-light rounded-lg">
    <div class="flex flex-col">
        <div class="flex flex-col lg:flex-row justify-center lg:justify-between items-center gap-2">
            <span class="ts-text-title md:text-center">Équipe <span class="capitalize">{teamName}</span></span>
            <Button outline size="xs" class={btnEditClass} on:click={() => (openDrawer(FormTeam,`Equipe - ${teamName}`))}>Modifier</Button>
        </div>
    </div>
    <div class="flex justify-center mt-3">
        {#if usersStatus.available > 0}
        <StatusBadge status="1" indicator={usersStatus.available+"/"+nbUsers} />
        {/if}
        {#if usersStatus.unavailable > 0}
        <StatusBadge status="0" indicator={usersStatus.unavailable+"/"+nbUsers} />
        {/if}
    </div>
    <Accordion flush>
        <AccordionItem class={accordionItemClass}>
            <span slot="header">Liste des membres</span>
            <div class="inline-grid grid-cols-3 gap-2 sm:gap-4 text-th-black">
            {#each users as user}
                <span>{user.fullname}</span>
                <RoleBadge role={user.role} />
                <StatusBadge status={user.status} />
            {/each}
            </div>
        </AccordionItem>
    </Accordion>
</div>