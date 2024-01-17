<script lang="ts">
	import { sessionStore } from '$lib/stores';
	import { Tabs, Tab, TabContent, ToastNotification } from 'carbon-components-svelte';
	import type { ActionData } from './$types';
	import Collections from '$lib/components/Collections.svelte';
	
	export let form: ActionData;

	let toast: HTMLDivElement | undefined | null;
	let kind: 'error' | 'info' | 'success' | 'warning' = 'error';	
	let title = 'Error';
	let subtitle = 'An internal server error occurred.';
	let caption = 'Something went wrong.';
	
	if (form !== null) {
		subtitle = form.body.message;
		caption = form.body.caption;
		if (form.status === 200) {
			kind = 'success';
			title = 'Success';
		} else if (form.status === 400) {
			kind = 'warning';
			title = 'Warning';
		} else if (form.status === 500) {
			kind = 'error';
			title = 'Error';
		} else {
			kind = 'info';
			title = 'Info';
		}

		setTimeout(() => {
			toast?.classList.remove('hide');
		}, 100);
	}

	let formElmRef: HTMLFormElement;
</script>

<div>
	{#if $sessionStore?.user}
		<div class="toast-notification hide" bind:this={toast}>
			<ToastNotification
				title={title}
				subtitle={subtitle}
				caption={caption}
				kind={kind}
				timeout={5000}
				lowContrast
				on:close={(e) => {
					e.preventDefault();
					e.stopPropagation();
					toast?.classList.add('hide');
				}}
			/>
		</div>
		<div class="container-fluid g-0">
			<div class="row g-0">
				<div class="left-side-panel col-12 col-md-2">
					<form action="?/createCollection" method="post" bind:this={formElmRef}>
						<Collections createFormElm={formElmRef} />
					</form>
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
