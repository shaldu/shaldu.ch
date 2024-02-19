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


	onMount(async () => {
		//read local storage
		const lastUrl = localStorage.getItem('lastUrl');
		if (lastUrl != window.location.href) {
			const pageAccessedByReload =
				(window.performance.navigation && window.performance.navigation.type === 1) ||
				window.performance
					.getEntriesByType('navigation')
					.map((nav) => nav.type)
					.includes('reload');

			if (!pageAccessedByReload) {
				//fetch the lastUrl
				const url = '/api/auth/account';
				const response = await fetch(url, {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json'
					}
				});

				const data = await response.json();

				//if the page isnt accesed by reload, then redirect to the last url
				//uri decode data.lastUrl
				const redirectUrl = decodeURIComponent(data.lastUrl);
				//set the storage
				localStorage.setItem('lastUrl', redirectUrl);

				window.location.href = redirectUrl;
			}
		}
	});

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
