<script lang="ts">
	import { Tabs, Tab, TabContent, Truncate } from 'carbon-components-svelte';
	import Close from 'carbon-icons-svelte/lib/Close.svelte';
	import { pdfFileIdsStore, sessionStore } from '$lib/stores';
	import PdfReader from './PDFReader.svelte';

	let selected = $sessionStore?.account.activeFileTabIndex ?? 0;
	console.log('selected: ' + selected);
	
	type PdfFile = {
		id: string;
		title: string;
		path: string;
		progress: number;
		bookmarks: {
			title: string;
			link: string;
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

	function onTabClick(event: MouseEvent, id: string, index: number) {
		if ($pdfFileIdsStore == null) return;
		event.preventDefault();
		const target = event.target as HTMLElement;
		if (!target?.classList.contains('pdf-tab-pane-close')) return;

		$pdfFileIdsStore.filter((pdfFileId) => pdfFileId !== id);
				
	}

</script>

{#if $pdfFileIdsStore != null}
	<Tabs type="container" bind:selected>
		{#each $pdfFileIdsStore as pdfFileId, index}
			<Tab on:click={(event) => onTabClick(event, pdfFileId, index)}>
				<span class="pdf-tab-pane">
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
						<PdfReader {pdfFileId} />
					</div>
				</TabContent>
			{/each}
		</svelte:fragment>
	</Tabs>
{/if}
