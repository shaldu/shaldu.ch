<script lang="ts">
	import { Tabs, Tab, TabContent, Truncate } from 'carbon-components-svelte';
	import Close from 'carbon-icons-svelte/lib/Close.svelte';
	import { pdfFileIdsStore } from '$lib/stores';
	import PdfReader from './PDFReader.svelte';


	let pdfFiles:
		| {
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
		  }[]
		| null = null;

	fetchPdfFiles();

	//subscribe to the store
	$: $pdfFileIdsStore;

	//check if the store has changed
	$: if ($pdfFileIdsStore != null && $pdfFileIdsStore != undefined) {
		fetchPdfFiles();
		//TODO: update the url with the new pdfFileIdsStore
	}

	function fetchPdfFiles() {
		//fetch the collections from the server
		const url = '/api/auth/pdffile?fileId=' + $pdfFileIdsStore ?? '';

		fetch(url, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		})
			.then((response) => response.json())
			.then((data) => {
				pdfFiles = data;
			})
			.catch((error) => {
				console.error('Error:', error);
			});
	}

	function onTabClick(event: MouseEvent, id: string) {
		event.preventDefault();
		const close: HTMLDivElement | null = event.target as HTMLDivElement
		if (close && close.classList.contains('pdf-tab-pane-close')) {
			//close tab remove from storage and url, splice
			$pdfFileIdsStore = $pdfFileIdsStore?.filter((item) => item !== id);

		}
	}


</script>

{#if pdfFiles != null}
	<Tabs type="container">
		{#each pdfFiles as pdfFile}
			<Tab on:click={(e) => onTabClick(e, pdfFile.id)}>
				<span class="pdf-tab-pane">
					<div class="pdf-tab-pane-text">
						<Truncate>{pdfFile.title}</Truncate>
					</div>
					<div class="pdf-tab-pane-close">
						<Close />
					</div>
				</span>
			</Tab>
		{/each}
		<svelte:fragment slot="content">
			{#each pdfFiles as pdfFile}
				<TabContent class="pdf-tab-content">
					<div class="w-100 h-100">					
						<PdfReader {pdfFile} />
					</div>
				</TabContent>
			{/each}
		</svelte:fragment>
	</Tabs>
{/if}
