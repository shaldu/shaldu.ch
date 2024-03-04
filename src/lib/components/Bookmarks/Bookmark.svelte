<script lang="ts">
    import { Tile } from "carbon-components-svelte";

 
    export let title = "undefined";
    export let selection: Function;
    export let description = '';
    export let page = 0;
    export let id = '';
 </script>
 
 <Tile class="mb-4 w-100" light on:click={selection()} >{title}</Tile>