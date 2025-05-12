<script lang="ts">
    import { Section } from "flowbite-svelte-blocks";
    import { Drawer, CloseButton } from "flowbite-svelte";
    import { sineIn } from "svelte/easing";

    let { 
        hidden = $bindable(false),
        sidbarTitle,
        form,
        FormComponent,
        formProps = null
    } = $props()

    let resetForm  :boolean = $state(false) 

    let transitionParams = {
      x: 320,
      duration: 200,
      easing: sineIn
    };

    $effect(() => {
        if(!hidden){
            resetForm = true
        }
    });

</script>
    
<Section name="default">
    <Drawer transitionType="fly" placement="right" {transitionParams} bind:hidden id="crudForm">
        <div class="flex items-center">
            <h5 id="drawer-label" class="inline-flex items-center mb-6 text-base font-semibold text-gray-500 uppercase dark:text-gray-400">{sidbarTitle}</h5>
            <CloseButton on:click={() => (hidden = true)} class="mb-4 dark:text-white" />
        </div>
        {#if FormComponent}
           <FormComponent {form} {formProps} {resetForm} />
        {/if}
    </Drawer>
</Section>