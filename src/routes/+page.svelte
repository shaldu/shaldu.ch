<script lang="ts">
	import { sessionStore, collectionIdStore, pdfFileIdsStore } from '$lib/stores';
	import { ToastNotification } from 'carbon-components-svelte';
	import type { ActionData } from './$types';
	import Collections from '$lib/components/Collections.svelte';
	import FileCollection from '$lib/components/FileCollection.svelte';
	import { enhance } from '$app/forms';
	import { Pdf } from 'carbon-icons-svelte';
	import PdfViewer from '$lib/components/PDFViewer.svelte';

	//get the url parameters
	const urlParams = new URLSearchParams(window.location.search);
	const tempCollectionId = urlParams.get('collection');

	if (tempCollectionId != null && tempCollectionId != undefined && tempCollectionId != '') {
		$collectionIdStore = tempCollectionId;
	}

	const tempFileId = urlParams.get('file');
	if (tempFileId != null && tempFileId != undefined && tempFileId != '') {
		$pdfFileIdsStore = tempFileId.split(',') ?? [];
	}

	export let form: ActionData;

	let toast: HTMLDivElement | undefined | null;
	let kind: 'error' | 'info' | 'success' | 'warning' = 'error';
	let title = 'Error';
	let subtitle = 'An internal server error occurred.';
	let caption = 'Something went wrong.';

	if (form !== null) {
		if (form.body.collectionId != null && form.body.collectionId != '') {
			collectionIdStore.set(form.body.collectionId);
			//set url parameter
			history.pushState(null, '', `?collection=${form.body.collectionId}`);
		}

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
	let addFileFormElm: HTMLFormElement;
</script>

<div>
	{#if $sessionStore?.user}
		<div class="toast-notification hide" bind:this={toast}>
			<ToastNotification
				{title}
				{subtitle}
				{caption}
				{kind}
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
					{#if $collectionIdStore == null || $collectionIdStore == undefined || $collectionIdStore == ''}
						<form action="?/createCollection" method="post" bind:this={formElmRef}>
							<Collections createFormElm={formElmRef} />
						</form>
					{:else}
						<form
							use:enhance
							enctype="multipart/form-data"
							action="?/createFileCollection"
							method="post"
							bind:this={addFileFormElm}
						>
							<FileCollection {addFileFormElm} />
						</form>
					{/if}
				</div>
				<div class="col">
					{#if $pdfFileIdsStore != null}
						<div class="pdf-viewer">
							<PdfViewer />
						</div>
					{/if}
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
