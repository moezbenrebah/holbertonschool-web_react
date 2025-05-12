<script lang="ts">

    let {
        shifts
    }= $props();
 

</script>

<div class="border size-fit border-th-black-light rounded-lg flex flex-col sm:flex-row mt-10 sm:mt-4">
    <div class="flex flex-col">
        <div class="p-4 border-b border-th-black-light bg-white rounded-t-lg">
            <h2 class="ts-text-sub-title text-th-blue">Mes périodes de travail cette semaine</h2>
        </div>
        <div class="flex flex-col p-4">
            {#each shifts as shift}
            <div class="flex flex-col items-center sm:justify-start sm:flex-row py-3 gap-4 border-b border-th-black-light">
                <span class="ts-text-bold text-th-blue">{shift.shiftStartDateFormat}</span>
                <span class="capitalize">{shift.activity}</span>
                <span class="ts-text-bold text-th-blue">{shift.shiftStartHourFormat} - {shift.shiftEndHourFormat}</span>
                <span>Mission <span class="text-th-red">{shift.missionId}</span></span>
            </div>
            {/each}
        </div>
    </div>
</div>
