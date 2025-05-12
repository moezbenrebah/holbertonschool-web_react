<script lang="ts">
    import UserBadge from "$lib/components/badge/UserBadge.svelte";

    let {missionShifts} = $props();

    const shifts=missionShifts.shifts;
    const shiftCo=shifts.connexion.shift[0];
    const shiftSurv=shifts.surveillance.shift;
    const shiftDeco=shifts.deconnexion.shift[0];

    const shiftDivClass="flex flex-col items-center justify-center ts-text gap-4";
    const shiftDateClass="text-th-black ts-text-bold";
    const shiftActivityClass="text-th-black-light";
    const shiftDivInnerClass="flex flex-col sm:flex-row justify-center items-center gap-4 mb-5 sm:mr-5";
    const shiftHourClass="text-th-black ts-text-bold";

</script>
<div class="full-w border border-th-black-light rounded-lg flex flex-col sm:flex-row mt-10 sm:mt-4">
    <div class="flex flex-col items-center justify-center flex-none bg-white rounded-l-lg border-th-black-light sm:border-r">
        <div class="flex flex-col items-center justify-center p-4 gap-2">
            <span class="ts-text-title text-th-blue capitalize">{missionShifts.location}</span>
            <span class="text-th-red ts-text-sub-title">{missionShifts.startDateFormat}</span>
            {#if missionShifts.startDateFormat !== missionShifts.endDateFormat}
            <hr class="border border-th-black-light w-full">
            <span class="text-th-red ts-text-sub-title">{missionShifts.endDateFormat}</span>
            {/if}
        </div>
    </div>
    <div class="flex-auto">
        <div class="flex justify-center py-4 sm:py-6">
            <span class="ts-title-2">Mission <span class="text-th-red">{missionShifts.id}</span></span>
        </div>
        <div class="flex items-center justify-center">
            <div class="flex flex-col sm:flex-row items-center justify-around gap-4 w-full py-8 flex-wrap">
                <div class={shiftDivClass+" border-b lg:border-b-0 lg:border-r border-th-black-light"}>
                    <span class={shiftDateClass}>{shiftCo.startDateFormat}</span>
                    <span class={shiftActivityClass}>Connexion</span>
                    <div class={shiftDivInnerClass}>
                        <span class={shiftHourClass}>{shiftCo.startHourFormat}</span>
                        {#each shiftCo.users as user}
                        <UserBadge userName={user.userFullname} role={user.userRole} />
                        {/each}
                    </div>
                </div>
                {#if shiftSurv}
                {#each shiftSurv as shift}
                <div class={shiftDivClass+" border-b lg:border-b-0 lg:border-r border-th-black-light"}>
                    <span class={shiftDateClass}>{shift.startDateFormat}</span>
                    <span class={shiftActivityClass}>Surveillance</span>
                    <div class={shiftDivInnerClass}>
                        <span class={shiftHourClass}>{shift.startHourFormat}</span>
                        {#each shift.users as user}
                        <UserBadge userName={user.userFullname} role={user.userRole} />
                        {/each}
                    </div>
                </div>
                {/each}
                {/if}
                <div class={shiftDivClass}>
                    <span class={shiftDateClass}>{shiftDeco.startDateFormat}</span>
                    <span class={shiftActivityClass}>Déconnexion</span>
                    <div class={shiftDivInnerClass}>
                        <span class={shiftHourClass}>{shiftDeco.startHourFormat}</span>
                        {#each shiftDeco.users as user}
                        <UserBadge userName={user.userFullname} role={user.userRole} />
                        {/each}
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>