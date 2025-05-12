<script lang="ts">
    import type { SelectInputValue } from "$lib/types"
    import { enhance } from '$app/forms';
    import { CloseCircleSolid } from 'flowbite-svelte-icons';
    import { Button, Label, Input, Helper, Select, Textarea } from "flowbite-svelte";

    let { 
        form,
        formProps
    }= $props();

    // Champs fixes
    let name = $state(form?.data?.name || '');
    let address = $state(form?.data?.address || '');
    let teamSelected = $state(form?.data?.team || '');

    // Champs dynamiques (notes)
    let dynamicFields = $state<Array<{
        id: number;
        title: string;
        note: string;
    }>>(form?.data?.notes?.map((note, index) => ({
        id: index,
        title: note.title || '',
        note: note.content || ''
    })) || []);

    let nextId = $state(dynamicFields.length > 0 ? Math.max(...dynamicFields.map(f => f.id)) + 1 : 0);

    // Team list
    let teamList = formProps.teamList || []
    let teamItems: SelectInputValue[] = teamList.map(team => ({
        value: team.teamName,
        name: team.teamName
    }));

    // Fonctions pour gérer les champs dynamiques
    const addField = () => {
        dynamicFields = [...dynamicFields, {
            id: nextId++,
            title: '',
            note: ''
        }];
    };

    const removeField = (id: number) => {
        dynamicFields = dynamicFields.filter(field => field.id !== id);
    };

    const btnClass = "text-center focus-within:ring-4 focus-within:outline-hidden inline-flex items-center justify-center px-5 py-2.5 text-white bg-th-blue hover:bg-primary-800 rounded-lg";
    const helperClass = "flex flex-col text-sm text-th-red mt-2";

</script>

<form use:enhance method="POST" action="?/addLocation" class="mb-6">
    <!-- Champs fixes -->
    <div class="mb-6">
        <Label for="name" class="ts-text-bold block mb-2">Nom courant du lieu</Label>
        <Input class="text-th-black-light" id="name" bind:value={name} name="name" required />
        {#if form?.errors?.name}
        <Helper class={helperClass}>
        {#each form.errors.name as nameError}
            <span>{nameError}</span>
        {/each} 
        </Helper>
        {/if}
    </div>

    <div class="mb-6">
        <Label for="address" class="ts-text-bold block mb-2">Adresse complète</Label>
        <Input class="text-th-black-light" id="address" bind:value={address} name="address" required />
        {#if form?.errors?.address}
        <Helper class={helperClass}>
        {#each form.errors.address as addressError}
            <span>{addressError}</span>
        {/each} 
        </Helper> 
        {/if}
    </div>

    <div class="mb-6">
        <Label class="ts-text-bold mb-2">
            Équipe
            <Select name="team" class="mt-2 ts-text text-th-black-light capitalize" placeholder="Liste des équipes" items={teamItems} bind:value={teamSelected} required />
        </Label>
        {#if form?.errors?.team}
        <Helper class={helperClass}>
        {#each form.errors.team as teamError}
            <span>{teamError}</span>
        {/each} 
        </Helper>
        {/if}
    </div>
    <!-- Champs dynamiques pour les notes -->
    <div class="mb-6">
        <Label class="ts-text-bold block mb-2">Notes</Label>
        {#each dynamicFields as field, i (field.id)}
            <div class="mb-6 p-4 border border-th-black-light rounded-lg relative">
                <button type="button" onclick={() => removeField(field.id)} class="absolute top-2 right-2 text-th-red hover:text-red-700 text-xl" title="Supprimer cette note">
                    <CloseCircleSolid class="fill-th-red" size="lg"/>
                </button>
                
                <div class="mb-4">
                    <Label for={`title-${field.id}`} class="ts-text-bold block mb-2">Titre</Label>
                    <Input id={`title-${field.id}`} class="text-th-black-light" bind:value={field.title} name={`notes[${i}].title`} required />
                    {#if form?.errors?.notes?.[i]?.title}
                    <Helper class={helperClass}>
                    {#each form.errors.notes[i].title as titleError}
                        <span>{titleError}</span>
                    {/each} 
                    </Helper>
                    {/if}
                </div>
                
                <div class="mb-4">
                    <Label for={`note-${field.id}`} class="ts-text-bold block mb-2">Contenu</Label>
                    <Textarea id={`note-${field.id}`} class="text-th-black-light" bind:value={field.note} name={`notes[${i}].content`} rows={4} required />
                    {#if form?.errors?.notes?.[i]?.content}
                    <Helper class={helperClass}>
                    {#each form.errors.notes[i].content as contentError}
                        <span>{contentError}</span>
                    {/each} 
                    </Helper>
                    {/if}
                </div>
            </div>
        {/each}
        
        <div class="flex justify-end pb-4 space-x-4 md:px-4">
            <Button type="button" onclick={addField} class="ts-text-bold border focus-within:ring-0 border-th-red text-th-red hover:text-th-white hover:bg-th-red">
                Ajouter une Note
            </Button>
        </div>
    </div>

    <div class="flex justify-end pb-4 space-x-4 md:px-4">
        <Button type="submit" class={btnClass}>Enregistrer</Button>
    </div>
</form>