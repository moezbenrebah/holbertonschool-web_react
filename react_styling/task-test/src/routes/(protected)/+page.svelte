<script lang="ts">
import WeekShiftWidget from "$lib/components/widget/WeekShiftWidget.svelte";
import AchivmentWidget from "$lib/components/widget/AchivmentWidget.svelte";
import MonthShiftsMetricWidget from "$lib/components/widget/MonthShiftsMetricWidget.svelte";
import type { PageData } from './$types';
AchivmentWidget

let { data } : { data: PageData}  = $props();

const user = data.user;
const weekShifts = data.currentWeekShifts.shifts;
const shiftMetric = data.currentMonthShiftsMetric;
const shiftMetricActivities=shiftMetric.activitiesCount;
</script>

<div class="py-4">
    <h1 class="ts-title-2 text-th-red">Bonjour, {user.firstName+" "+user.lastName}</h1>
</div>
<div class="grid grid-cols-3 gap-4">
    <AchivmentWidget value={shiftMetric.totalHours} text="Nombre d’heures effectuées ce mois-ci" />
    <AchivmentWidget value={shiftMetric.totalShifts} text="Total des quarts travaillés ce mois-ci" />
    <MonthShiftsMetricWidget activities={shiftMetricActivities}/>
</div>
<div class="grid grid-cols-2 gap-4">
    <WeekShiftWidget shifts={weekShifts} />
    
</div>