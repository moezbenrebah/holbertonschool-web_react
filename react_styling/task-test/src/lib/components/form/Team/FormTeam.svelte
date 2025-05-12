<script lang="ts">
    import { enhance } from '$app/forms';
    import {AccordionItem, Accordion,Button,Label, Input, Helper,Checkbox} from "flowbite-svelte";

    const { 
        form,
        resetForm,
        formProps
    } = $props();

    const teamsUsers= formProps.teamWhiteUsers;
    const unassignedUsers = formProps.unassignedUsers

    const helperClass="text-sm text-th-red mt-2"
    const btnClass="text-center focus-within:ring-4 focus-within:outline-hidden inline-flex items-center justify-center px-5 py-2.5 text-white bg-th-blue hover:bg-primary-800 rounded-lg"
    const checkboxClass="w-full py-2"
</script>

<form use:enhance method="POST" action="?/add" class="mb-6">
    <div class="mb-6">
        <Label for="teamName" class="ts-text-bold block mb-2">Nom de l'équipe</Label>
        <Input class="text-th-black-light" id="teamName" name="teamName" placeholder="Equipe ..." />
        <Helper class={helperClass}> 
            <p>test</p>
        </Helper>
    </div>
    {#if unassignedUsers.length > 0}
    <div class="mb-6">
        <Accordion flush>
            <AccordionItem open>
                <span slot="header">Agents non affectés</span>
                {#each unassignedUsers as user}
                <Checkbox class={checkboxClass}>{user.fullname}</Checkbox>
                {/each}
            </AccordionItem>
        </Accordion>
    </div>
    {/if}
    {#if teamsUsers.length > 0}
    {#each teamsUsers as teamUsers}
    <div class="mb-6">
        <Accordion flush>
            <AccordionItem>
                <span slot="header">Équipe <span class="capitalize">{teamUsers.teamName}</span></span>
                {#each teamUsers.users as user}
                    <Checkbox class={checkboxClass}>{user.fullname}</Checkbox>
                {/each}
            </AccordionItem>
        </Accordion>
    </div>
    {/each}
    {/if}
    <div class="flex justify-end pb-4 space-x-4 md:px-4">
        <Button type="submit" class={btnClass}>Enregistrer</Button>
    </div>
</form>