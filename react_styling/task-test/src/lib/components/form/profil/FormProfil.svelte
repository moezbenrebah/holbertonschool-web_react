<script lang="ts">
    import { enhance } from '$app/forms';
    import {Button,Label, Input, Helper} from "flowbite-svelte";

    let { 
        form,
        // resetForm,
        formProps
    } = $props();


    const btnClass="text-center focus-within:ring-4 focus-within:outline-hidden inline-flex items-center justify-center px-5 py-2.5 text-white bg-th-blue hover:bg-primary-800 rounded-lg"
    const helperClass="text-sm text-th-red mt-2"
    const inputClass="text-th-black-light"
    const labelClass="s-text-bold block mb-2"

</script>

<form use:enhance method="POST" action="?/add">
    <div class="mb-6">
        <Label for="phone" class={labelClass}>Téléphone</Label>
        <Input class={inputClass} id="phone"  name="phone"/>
        <!-- {#if form.errors?.phone}
        <Helper class={helperClass}> 
            {form.errors.phone}
        </Helper>
        {/if} -->
    </div>
    <div class="mb-6">
        <Label for="password" class={labelClass}>Modifier le mot de passe</Label>
        <Input type="password" class={inputClass} id="password" name="password" />
        <!-- {#if form.errors?.phone}
        <Helper class={helperClass}> 
            {form.errors.phone}
        </Helper>
        {/if} -->
    </div>

    <div class="flex justify-end pb-4 space-x-4 md:px-4">
      <Button type="submit" class={btnClass}>Enregistrer</Button>
    </div>
</form>