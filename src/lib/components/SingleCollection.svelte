<script lang="ts">
   export let title = "undefined";
   export let selection: Function;
   export let id = 0;
</script>

<button class="btn btn-secondary w-100 mt-4" on:click={selection(id)}>
    <span>{title}</span>
</button>
