<script lang="ts">
    import "../../node_modules/bootstrap/scss/bootstrap.scss";
    import "carbon-components-svelte/css/g100.css";
    import Loader from "$lib/components/Loader.svelte";

    export let loading = true;

    setTimeout(() => {
        loading = false;
    }, 200);


</script>
<!-- if loading show Loader else slot -->
{#if loading ?? true}
    <Loader />
{:else}
    <slot />
{/if}