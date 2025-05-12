<script lang="ts">
    import { enhance } from '$app/forms';
    import { goto } from '$app/navigation';
    import { Section, Register } from "flowbite-svelte-blocks";
    import { Button, Label, Input,Helper } from "flowbite-svelte";
    import logo from "$lib/assets/logo/panoptique_logo_black.svg";
    import type { ActionData } from './$types';

    // Reçoit automatiquement les données retournées par l'action serveur
    let { form } : { form: ActionData } = $props();
    let errors: Partial<Record<string, string[]>> | undefined = $state(undefined);
    let email :string = $state("")

    let helperClass="text-sm text-th-red mt-2"

    $effect(()=>{
      errors = form?.errors;
      email = form?.email ?? ""
      if (form?.success) {
      goto("/");
    }
    })
</script>

<Section name="login" sectionClass="max-w-md mx-auto">
  <Register  href="*" aClass="flex items-center mb-4" divClass="'w-full">
    <svelte:fragment slot="top">
      <img class="h-16" src="{logo}" alt="logo" />
    </svelte:fragment>
    <div class="sm:pt-8 w-full">
      <form class="flex flex-col space-y-6 w-full" use:enhance method="POST">
        <h3 class="ts-title-2 p-0 text-center">Connexion</h3>
        {#if errors?._global}
        <div class="mb-4 p-2 text-center text-th-red rounded">
          {errors._global}
        </div>
        {/if}
        <Label class="space-y-2">
          <span>Email</span>
          <Input type="email" name="email" bind:value={email} placeholder="email@sgs.com" />
          {#if errors?.email}
          <Helper class={helperClass}> 
              {errors.email}
          </Helper>
          {/if}
        </Label>
        <Label class="space-y-2">
          <span>Mot de passe</span>
          <Input type="password" name="password" placeholder="•••••" />
          {#if errors?.email}
          <Helper class={helperClass}> 
              {errors.password}
          </Helper>
          {/if}
        </Label>
        <Button type="submit" class="bg-th-blue color-white">Connexion</Button>
      </form>
    </div>
  </Register>
</Section>