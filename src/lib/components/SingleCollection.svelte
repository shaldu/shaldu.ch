<script lang="ts">
   import { Button } from 'carbon-components-svelte';

   export let title = "undefined";
   export let selection: Function;
   export let id = '';
</script>

<Button kind={'secondary'} class="mt-4 w-100" on:click={selection(id)}>{title}</Button>