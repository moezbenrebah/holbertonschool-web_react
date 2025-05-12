<script lang="ts">
	import { string } from "zod";

    let {
        value,
        text
    }: {value: string,
        text: string}=$props();


</script>

<div class="border size-fit border-th-black-light rounded-lg flex flex-col sm:flex-row mt-10 sm:mt-4">
    <div class="flex flex-col">
        <div class="w-full h-30   flex flex-row justify-center items-center">
            <span class="ts-title-1 text-th-red">{value}</span>
        </div>
        <div class="border-t bg-white rounded-b-lg border-th-black-light ts-text-sub-title">
            <p class="p-4 text-th-blue">{text}</p>
        </div>
    </div>
</div>