<script lang="ts">
	import '../app.scss';
	import '../../node_modules/bootstrap/scss/bootstrap.scss';
	import 'carbon-components-svelte/css/g100.css';
	import Loader from '$lib/components/Loader.svelte';
	import { sessionStore, type CustomSession } from '$lib/stores';
	import type { Session } from '@auth/core/types';
	import Header from '$lib/components/Header.svelte';
	import '$scss/index.scss';
	import { onMount } from 'svelte';

	export let loading = true;
	export let data;
	const session: Session | null = data?.session as CustomSession | null;
	//@ts-ignore
	sessionStore.set(session);

	setTimeout(() => {
		loading = false;
	}, 100);
</script>

<!-- if loading show Loader else slot -->
{#if loading ?? true}
	<Loader></Loader>
{:else}
	<header>
		<Header></Header>
	</header>
	<main>
		<slot />
	</main>
{/if}
