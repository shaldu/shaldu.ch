<script lang="ts">
	import { Tabs, Tab, TabContent, Truncate } from 'carbon-components-svelte';
	import Close from 'carbon-icons-svelte/lib/Close.svelte';
	import { pdfFileIdsStore, selectedPdfFileIdStore, sessionStore } from '$lib/stores';
	import PdfReader from './PDFReader.svelte';
	import { updateLastUrl } from '$lib/auth';

	let selected = 0;

	type PdfFile = {
		id: string;
		title: string;
		path: string;
		progress: number;
		bookmarks: {
			id: string;
			title: string;
			progress: string;
			description: string;
			page: number;
		}[];
	} | null;

	let pdfFileNames: string[] = [];

	//subscribe to the store
	$: $pdfFileIdsStore;

	//check if the store has changed
	$: if ($pdfFileIdsStore != null && $pdfFileIdsStore != undefined) {
		//fetch the pdf file names
		fetchPdfFileName().then((data) => {
			//set the pdf file names
			//create id, name mapping

			data.forEach((pdfFile: PdfFile) => {
				if (pdfFile == null) return;
				pdfFileNames[pdfFile.id] = pdfFile.title;
			});

			updateLastUrl();
		});
	}

	async function fetchPdfFileName() {
		//fetch the collections from the server
		const url = '/api/auth/pdffile?fileId=' + $pdfFileIdsStore ?? '';

		const response = await fetch(url, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		});

		const data = await response.json();
		return data;
	}

	function onTabClick(event: MouseEvent, id: string) {
		if ($pdfFileIdsStore == null) return;
		event.preventDefault();
		const target = event.target as HTMLElement;
		if (!target?.classList.contains('pdf-tab-pane-close')){
			$selectedPdfFileIdStore = id;
			
			return;
		};
		closeTab(id);
	}

	function closeTab(id: string) {
		if ($pdfFileIdsStore == null) return;
		const temp = $pdfFileIdsStore.filter((pdfFileId) => pdfFileId !== id);
		$pdfFileIdsStore = null;

		setTimeout(() => {
			$pdfFileIdsStore = temp;
			$selectedPdfFileIdStore = $pdfFileIdsStore[0];
			updateUrl();
		}, 12);
	}

	function updateUrl() {
		const url = new URL(window.location.href);
		if ($pdfFileIdsStore == null || $pdfFileIdsStore.length == 0) {
			url.searchParams.delete('file');
			window.history.pushState({}, '', url.toString());
			return;
		} else {
			//loop through the pdfFileIdsStore and add to the url
			const fileArrayString: string = $pdfFileIdsStore.join(',');
			url.searchParams.set('file', fileArrayString);
			window.history.pushState({}, '', url.toString());
		}
		//update to DB to save url
		updateLastUrl();
	}
	

	function convertIdToUniqueString(id: string) {
		return id.replaceAll(/[^a-zA-Z]/g, '');
	}

	//add keyevent to close tab
	window.addEventListener('keydown', (event) => {
		//delete key or backspace key
		if (
			(event.key === 'w' && event.ctrlKey) ||
			(event.key === 'w' && event.metaKey) ||
			(event.key === 'w' && event.altKey) ||
			event.key === 'Backspace'
		) {
			//close the tab
			if ($pdfFileIdsStore == null) return;
			if (document.activeElement?.classList.contains('bx--tabs__nav-link')) {
			}
			closeTab($pdfFileIdsStore[selected]);
		}
	});
</script>

{#if $pdfFileIdsStore != null}
	<Tabs type="container" bind:selected>
		{#each $pdfFileIdsStore as pdfFileId, index}
			<Tab on:click={(event) => onTabClick(event, pdfFileId)}>
				<span class="pdf-tab-pane" data-pdffile-tab={convertIdToUniqueString(pdfFileId)}>
					<div class="pdf-tab-pane-text">
						<Truncate>{pdfFileNames[pdfFileId]}</Truncate>
					</div>
					<div class="pdf-tab-pane-close">
						<Close />
					</div>
				</span>
			</Tab>
		{/each}
		<svelte:fragment slot="content">
			{#each $pdfFileIdsStore as pdfFileId}
				<TabContent class="pdf-tab-content">
					<div class="w-100 h-100">
						<PdfReader {pdfFileId} pdfFileIdEscaped={convertIdToUniqueString(pdfFileId)} />
					</div>
				</TabContent>
			{/each}
		</svelte:fragment>
	</Tabs>
{/if}
