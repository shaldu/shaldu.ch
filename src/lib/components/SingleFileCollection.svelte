<script lang="ts">
   import { Button, SelectableTile } from 'carbon-components-svelte';
   import ArrowRight from 'carbon-icons-svelte/lib/ArrowRight.svelte';

   export let title = "undefined";
   export let selection: Function;
   export let selected = false;
   export let id = '';
</script>

<SelectableTile class="mb-4 w-100" light on:click={selection(id, !selected)} bind:selected>{title}</SelectableTile>