<script lang="ts">
    import { Tile } from "carbon-components-svelte";

 
    export let title = "undefined";
    export let selection: Function;
    export let page = 0;
    export let description = "undefined";
    export let id: string;
 </script>
 
 <Tile class="mb-4 w-100 bookmark-tile" light on:click={selection(id)} >
<div>
    <h5>{title}</h5>
    <p class="small-text">{description}</p>
    <p class="info text-end mt">Page: {page}</p>
</div>
</Tile>  