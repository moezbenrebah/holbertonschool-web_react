<script lang="ts">

    type ActivityCounts = {
        connexion: number;
        surveillance: number;
        deconnexion: number;
    };

    let {
        activities
    }: {activities: ActivityCounts}= $props();
 

</script>

<div class="border size-fit border-th-black-light rounded-lg flex flex-col sm:flex-row mt-10 sm:mt-4">
    <div class="flex flex-col ">
        <div class="p-4  bg-white  border-b rounded-t-lg border-th-black-light">
            <h2 class="ts-text-sub-title text-th-blue">Répartition des quarts</h2>
        </div>
        <div class="flex flex-col py-3 gap-4 p-4">
            <span class="ts-text-sub-title border-th-black-light">Connexions <span class="text-th-red ml-5">{activities.connexion}</span></span>
            <span class="ts-text-sub-title border-th-black-light">Surveillances <span class="text-th-red ml-3">{activities.surveillance}</span></span>
            <span class="ts-text-sub-title border-th-black-light">Déconnexions <span class="text-th-red ml-3">{activities.deconnexion}</span></span>
        </div>
    </div>
</div>
