<script lang="ts">
	import '../../node_modules/bootstrap/scss/bootstrap.scss';
	import 'carbon-components-svelte/css/g100.css';
	import Loader from '$lib/components/Loader.svelte';
	import { sessionStore } from '$lib/stores';
	import type { Session } from '@auth/core/types';
	import Header from '$lib/components/Header.svelte';
	import '$scss/index.scss';

	export let loading = true;
	export let data;
	const session: Session | null = data?.session ?? null;
	sessionStore.set(session);
	
	setTimeout(() => {
		loading = false;
	}, 200);
</script>

<!-- if loading show Loader else slot -->
{#if loading ?? true}
	<Loader />
{:else}
	<header>
		<Header/>
	</header>
	<main>
		<slot />
	</main>
{/if}
