<script lang="ts">
	import {
		sessionStore,
		collectionIdStore,
		pdfFileIdsStore,
		selectedPdfFileIdStore
	} from '$lib/stores';
	import { Button, ToastNotification } from 'carbon-components-svelte';
	import type { ActionData } from './$types';
	import Collections from '$lib/components/Collections.svelte';
	import FileCollection from '$lib/components/FileCollection.svelte';
	import { enhance } from '$app/forms';
	import { Bookmark, Pdf } from 'carbon-icons-svelte';
	import PdfViewer from '$lib/components/PDFViewer.svelte';
	import { onMount } from 'svelte';
	import BookmarkCollection from '$lib/components/Bookmarks/BookmarkCollection.svelte';
	import WordCollection from '$lib/components/Words/WordCollection.svelte';

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

	let showRedirectToast = false;
	let lastUrlToast: HTMLDivElement | undefined | null;

	function convertIdToUniqueString(id: string) {
		return id.replaceAll(/[^a-zA-Z]/g, '');
	}

	//subscribe to the selectedPdfFileIdStore store
	$: if (selectedPdfFileIdStore != null && selectedPdfFileIdStore != undefined) {
		console.log($selectedPdfFileIdStore);
		pdfFilePromise = fetchPdfFiles();
	}

	async function fetchPdfFiles() {
		if ($selectedPdfFileIdStore == null || $selectedPdfFileIdStore == undefined) return;

		//fetch the collections from the server
		const url = '/api/auth/pdffile?fileId=' + $selectedPdfFileIdStore ?? '';

		const response = await fetch(url, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		});

		const data = await response.json();

		return data[0];
	}

	let pdfFilePromise = fetchPdfFiles();

	onMount(async () => {
		//read local storage
		const lastUrl = localStorage.getItem('lastUrl');

		//and the date is less than 30 seconds
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

				if (redirectUrl == null || redirectUrl == '' || redirectUrl == 'null') return;
				//set the storage
				localStorage.setItem('lastUrl', redirectUrl);
				showRedirectToast = true;
				setTimeout(() => {
					lastUrlToast?.classList.remove('hide');
				}, 100);
			}
		}

		setTimeout(() => {
			const selectedEscapedFileId = convertIdToUniqueString($selectedPdfFileIdStore ?? '');
			const tabElm = document.querySelector('[data-pdffile-tab="' + selectedEscapedFileId + '"]');
			//@ts-ignore
			tabElm.click();
		}, 100);
	});
</script>

<div>
	{#if showRedirectToast}
		<div class="toast-notification hide small" bind:this={lastUrlToast}>
			<ToastNotification
				title="Reopen last files?"
				subtitle="Reopens the last files you were working on."
				caption=""
				kind="info"
				timeout={12000}
				lowContrast
				on:close={(e) => {
					e.preventDefault();
					e.stopPropagation();
					lastUrlToast?.classList.add('hide');
				}}
			>
				<!-- create a yes button to redirect -->
				<Button
					kind="tertiary"
					size="small"
					on:click={() => {
						window.location.href = localStorage.getItem('lastUrl');
					}}>Open tabs</Button
				>
			</ToastNotification>
		</div>
	{/if}
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
							class="file-collection-form"
						>
							<FileCollection {addFileFormElm} />
						</form>
						{#if $selectedPdfFileIdStore !== null}
							{#await pdfFilePromise then pdfFile}
								{#if pdfFile != null}
									<WordCollection words={pdfFile.words} />
								{/if}
							{/await}
						{/if}
					{/if}
				</div>
				<div class="col">
					{#if $pdfFileIdsStore != null}
						<div class="pdf-viewer">
							<PdfViewer />
						</div>
					{/if}
				</div>
				{#if $selectedPdfFileIdStore !== null}
					{#await pdfFilePromise then pdfFile}
						{#if pdfFile != null && $collectionIdStore != null && $collectionIdStore != undefined && $collectionIdStore != ''}
							<BookmarkCollection bookmarks={pdfFile.bookmarks} />
						{/if}
					{/await}
				{/if}
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
