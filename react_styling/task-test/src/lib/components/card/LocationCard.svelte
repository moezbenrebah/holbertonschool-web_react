<script lang="ts">
    import { AccordionItem, Accordion,Button} from 'flowbite-svelte';
    import { MapPinAltSolid } from 'flowbite-svelte-icons';
    import Map from "$lib/components/map/Map.svelte";

    let {
        location
    }=$props()

    const accordionItemClass= "flex items-center justify-between w-full ts-text text-left group-first:rounded-t-xl border-b border-th-black-light py-5 text-th-black"

</script>
<div class="full-w border border-th-black-light rounded-lg flex flex-col sm:flex-row mt-10 sm:mt-4">
    <div class="flex flex-none bg-white rounded-l-lg border-th-black-light sm:border-r">
        <div class="flex flex-col h-full items-center justify-center p-4">
            <span class="ts-text-title text-th-blue capitalize">{location.name}</span>
        </div>
    </div>
    <div class="flex-auto">
        <div class="p-4 sm:py-8">
            <span class="flex py-2 text-th-black ts-text-bold"><MapPinAltSolid size="lg" class="mr-1" />Adresse:<span class="ml-1 text-th-blue ts-text">{location.address}</span></span>
            <Accordion>
                <AccordionItem class={accordionItemClass}>
                    <span slot="header">Afficher la carte</span>
                    <Map address={location.address} />
                </AccordionItem>
                {#if location.locationNote.length != 0}
                <AccordionItem class={accordionItemClass}>
                    <span slot="header">Afficher les notes</span>
                    {#each location.locationNote as note}
                    <div class="p-2 flex flex-col">
                        <span class="text-th-blue ts-text-bold">{note.title}</span>
                        <p class="text-th-black ts-text">{note.note}</p>
                    </div>
                    {/each}
                </AccordionItem>
                {/if}
            </Accordion>
        </div>
    </div>
</div>