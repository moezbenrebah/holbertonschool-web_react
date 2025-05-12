<script lang="ts">
  type Roles = 'admin' | 'manager' | 'team_manager' | 'user';

  let { role }: { role: Roles } = $props();

  const roleStyles: Record<Roles, string> = {
    admin: 'bg-pink-100 text-pink-800',
    manager: 'bg-purple-100 text-purple-800',
    team_manager: 'bg-blue-100 text-blue-800',
    user: 'bg-indigo-100 text-indigo-800'
  };

  const roleText: Record<Roles, string> = {
    admin: 'administrateur',
    manager: "directeur d'agence",
    team_manager: "chef d'équipe",
    user: 'agent'
  };
</script>

<span class={`ts-text-bold me-2 px-2.5 py-0.5 text-center size-fit rounded-full capitalize ${roleStyles[role]}`}>
  {roleText[role]}
</span>
