<script lang="ts">
   import { Button } from 'carbon-components-svelte';
   import ArrowRight from 'carbon-icons-svelte/lib/ArrowRight.svelte';

   export let title = "undefined";
   export let selection: Function;
   export let id = '';
</script>

<Button icon={ArrowRight} kind={'secondary'} class="mb-4 w-100" on:click={selection(id)}>{title}</Button>