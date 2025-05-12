<script lang="ts">
    import { enhance } from '$app/forms';
    import {Button,Label, Input, Helper,Select} from "flowbite-svelte";
    import { formStore,userSelectedStore,resetFormStore } from "$lib/stores/form/agentStore";
    import type {SelectInputValue} from "$lib/types"

    let { 
        form,
        resetForm,
        formProps
    } = $props();

    let roleSelected:string = $state("");
    let teamSelected:string = $state("");
    let initialLoad = $state(true);
    const teamList = formProps.teamList

    $effect(() => {
        if (resetForm) {
            resetFormStore()
            roleSelected = "";
            teamSelected = "";
            initialLoad = true;
        }
    });

    $effect(() => {

        if ($userSelectedStore && initialLoad) {
            formStore.update(store => ({
                ...store,
                values: {
                    ...store.values,
                    firstName: $userSelectedStore.firstName || "",
                    lastName: $userSelectedStore.lastName || "",
                    email: $userSelectedStore.email || "",
                    phone: $userSelectedStore.phone || "",
                    role: $userSelectedStore.role || "",
                    team: $userSelectedStore.team || ""
                }
            }));
            
            roleSelected = $userSelectedStore.role || "";
            teamSelected = $userSelectedStore.team || "";

            initialLoad = false
        }
    });

    $effect(() => {

        if (form) {
            formStore.update(store => ({
                errors: form.errors || {},
                values: { ...store.values, ...form.formData }
            }));

            if (form.formData?.role !== roleSelected) {
                roleSelected = form.formData.role;
            }
            if (form.formData?.team !== teamSelected) {
                teamSelected = form.formData.team;
            }
        }
    });

        
    let roleItems :SelectInputValue[] = [
        { value: 'admin', name: 'Administrateur' },
        { value: 'manager', name: "Directeur d'agence" },
        { value: 'team_manager', name: "Chef d'équipe" },
        { value: 'user', name: "Agent" },
    ];
    
    let teamItems :SelectInputValue[] = [];
    teamList.forEach(team => {
        teamItems = [...teamItems, { value: team.teamName, name: team.teamName }];
    });

    const btnClass="text-center focus-within:ring-4 focus-within:outline-hidden inline-flex items-center justify-center px-5 py-2.5 text-white bg-th-blue hover:bg-primary-800 rounded-lg"
    const helperClass="text-sm text-th-red mt-2"

</script>

<form use:enhance method="POST" action="?/add" class="mb-6">
    <div class="mb-6">
        <Label for="firstName" class="ts-text-bold block mb-2">Nom</Label>
        <Input class="text-th-black-light" id="firstName" bind:value={$formStore.values.firstName} name="firstName" placeholder="Jean" />
        {#if $formStore.errors?.firstName}
        <Helper class={helperClass}> 
            {$formStore.errors.firstName}
        </Helper>
        {/if}
    </div>
    <div class="mb-6">
        <Label for="lastName" class="ts-text-bold block mb-2">Prénom</Label>
        <Input class="text-th-black-light" id="lastName" bind:value={$formStore.values.lastName} name="lastName" placeholder="Dupont" />
        {#if $formStore.errors?.lastName}
        <Helper class={helperClass}> 
            {$formStore.errors.lastName}
        </Helper>
        {/if}
    </div>
    <div class="mb-6">
        <Label for="email" class="ts-text-bold block mb-2">Email</Label>
        <Input class="text-th-black-light" id="email" bind:value={$formStore.values.email} name="email" placeholder="j.dupont@sgs.com" />
        {#if $formStore.errors?.email}
        <Helper class={helperClass}> 
            {$formStore.errors.email}
        </Helper>
        {/if}
    </div>
    <div class="mb-6">
        <Label for="phone" class="ts-text-bold block mb-2">Téléphone</Label>
        <Input class="text-th-black-light" id="phone" bind:value={$formStore.values.phone} name="phone" placeholder="0621516978" />
        {#if $formStore.errors?.phone}
        <Helper class={helperClass}> 
            {$formStore.errors.phone}
        </Helper>
        {/if}
    </div>
    <div class="mb-6">
        <Label class="ts-text-bold mb-2">
            Role
            <Select name="role" class="mt-2 ts-text text-th-black-light capitalize" placeholder="Liste des roles" items={roleItems} bind:value={roleSelected} />
        </Label>
        {#if $formStore.errors?.role}
        <Helper class={helperClass}> 
            {$formStore.errors.role}
        </Helper>
        {/if}
    </div>
    <div class="mb-6">
        <Label class="ts-text-bold mb-2">
            Équipe
            <Select name="team" class="mt-2 ts-text text-th-black-light capitalize" placeholder="Liste des équipes" items={teamItems} bind:value={teamSelected} />
        </Label>
        {#if $formStore.errors?.team}
        <Helper class={helperClass}> 
            {$formStore.errors.team}
        </Helper>
        {/if}
    </div>
    <div class="flex justify-end pb-4 space-x-4 md:px-4">
      <Button type="submit" class={btnClass}>Enregistrer</Button>
    </div>
</form>