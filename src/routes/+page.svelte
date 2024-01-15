<script lang="ts">
	import { sessionStore } from '$lib/stores';
	import { Tabs, Tab, TabContent } from 'carbon-components-svelte';
	import type { ActionData } from './$types';
	import Collections from '$lib/components/Collections.svelte';

	export let form: ActionData;
</script>

<div>
	{#if $sessionStore?.user}
		<div class="container-fluid g-0">
			<div class="row g-0">
				<div class="col-12 col-md-4 col-lg-2">
					<Collections />
				</div>
			</div>
		</div>
	{:else}
		<div class="container">
			<div class="row justify-content-center">
				<h1>Please Login to literally do anything</h1>
			</div>
		</div>
	{/if}
</div>
