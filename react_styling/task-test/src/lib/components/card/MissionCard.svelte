<script lang="ts">
    import { ClockSolid,UserSolid,LabelSolid,MapPinAltSolid,UsersGroupSolid } from 'flowbite-svelte-icons';

    let {mission} = $props();


    const dateTitleClass="text-th-black-light ts-text-bold";
    const dateClass="text-th-blue ts-text-string ts-text-title";
    const hourClass="text-th-red ts-text-strong ts-text-title";

    const dataClass="ts-text-sub-title flex flex-row justify-start items-center"
    const iconClass="mr-2"

    

    
</script>
<div class="full-w border border-th-black-light rounded-lg flex flex-col sm:flex-row mt-10 sm:mt-4">
    <div class="flex flex-col flex-none bg-white rounded-l-lg border-th-black-light sm:border-r">
        <div class="flex flex-col items-center justify-center p-4 border-b border-th-black-light gap-2">
            <span class={dateTitleClass}>Début</span>
            <span class={dateClass}>{mission.startDateFormat}</span>
            <span class={hourClass}>{mission.startHourFormat}</span>
        </div>
        <div class="flex flex-col items-center justify-center p-4 gap-2 border-b border-th-black-light sm:border-none">
            <span class={dateTitleClass}>Fin</span>
            <span class={dateClass}>{mission.endDateFormat}</span>
            <span class={hourClass}>{mission.endHourFormat}</span>
        </div>
    </div>
    <div class="flex-auto">
        <div class="flex justify-center p-4 sm:p-8">
            <span class="ts-title-2">Mission <span class="text-th-red">{mission.id}</span></span>
        </div>
        <div class="flex flex-col items-center justify-center gap-4 py-4 sm:flex-row sm:items-start sm:flex-wrap sm:gap-25">
            <div class="flex flex-col gap-4">
                <span class={dataClass}><ClockSolid size="lg" class={iconClass} />Durée: <span class="ml-2 uppercase">{mission.duration}</span></span>
                <span class={dataClass}><UserSolid size="lg" class={iconClass} />Client: <span class="ml-2 capitalize">{mission.customer}</span></span>
                <span class={dataClass}><LabelSolid size="lg" class={iconClass} />Produit: <span class="ml-2 capitalize">{mission.product}</span></span>
            </div>
            <div class="flex flex-col gap-4">
                <span class={dataClass}><MapPinAltSolid size="lg" class={iconClass} />Lieu: <span class="ml-2 capitalize">{mission.location}</span></span>
                <span class={dataClass}><UsersGroupSolid size="lg" class={iconClass} />Equipe: <span class="ml-2 capitalize">{mission.team}</span></span>
            </div>
        </div>
    </div>
</div>