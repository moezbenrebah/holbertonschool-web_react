<script lang="ts">
  type Status = '0' | '1';

  let { status, indicator=null }: { status: Status,indicator?: string|null } = $props();

  const statusStyles: Record<Status, string> = {
    0: 'bg-red-100 text-red-800',
    1: 'bg-green-100 text-green-800',
  };

  const statusText: Record<Status, string> = {
    0: 'indisponible',
    1: 'disponible',
  };

  let statusTextDisplay = $derived.by(()=>{
    if(indicator){
      return statusText[status]+" "+indicator
    }
    return statusText[status]
  })
</script>

<span class={`ts-text-bold me-2 px-2.5 py-0.5 text-center size-fit capitalize rounded-full ${statusStyles[status]}`}>
  {statusTextDisplay}
</span>
