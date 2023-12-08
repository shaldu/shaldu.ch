<script lang="ts">
    import "../../node_modules/bootstrap/scss/bootstrap.scss";
    import "carbon-components-svelte/css/g100.css";
    import Loader from "$lib/components/Loader.svelte";

    export let data: { loading: boolean};
    
</script>
<!-- if loading show Loader else slot -->
{#if data?.loading ?? true}
    <Loader />
{:else}
    <slot />
{/if}