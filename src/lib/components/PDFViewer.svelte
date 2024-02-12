<script lang="ts">
	import { Tabs, Tab, TabContent, Truncate } from 'carbon-components-svelte';
	import Close from 'carbon-icons-svelte/lib/Close.svelte';
	import { pdfFileIdsStore, sessionStore } from '$lib/stores';
	import PdfReader from './PDFReader.svelte';

	let selected = $sessionStore?.account.activeFileTabIndex ?? 0;

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

		$pdfFileIdsStore = $pdfFileIdsStore.filter((pdfFileId) => pdfFileId !== id);
		setTimeout(() => {
			// selected = index - 1;
			$sessionStore.account.activeFileTabIndex = selected;
		}, 100);
	}

	function convertIdToUniqueString(id: string) {
		return id.replaceAll(/[^a-zA-Z]/g, '');
	}
</script>

{#if $pdfFileIdsStore != null}
	<ul class="nav nav-tabs" id="myTab" role="tablist">
		{#each $pdfFileIdsStore as pdfFileId, index}
			<li class="nav-item" role="presentation">
				<button
					on:click={(event) => onTabClick(event, pdfFileId, index)}
					class="nav-link {index === selected ? 'active' : ''}"
					id="{convertIdToUniqueString(pdfFileId)}-tab"
					data-bs-toggle="tab"
					data-bs-target="#{convertIdToUniqueString(pdfFileId)}"
					type="button"
					role="tab"
					aria-controls="{convertIdToUniqueString(pdfFileId)}"
					aria-selected="true"
				>
					<div class="pdf-tab-pane-text">
						<Truncate>{pdfFileNames[pdfFileId]}</Truncate>
					</div>
					<div class="pdf-tab-pane-close">
						<Close />
					</div>
				</button>
			</li>
		{/each}
	</ul>
	<div class="tab-content" id="myTabContent">
		{#each $pdfFileIdsStore as pdfFileId, index}
			<div
				class="tab-pane fade{index === selected ? ' show active' : ''}"
				id="{convertIdToUniqueString(pdfFileId)}"
				role="tabpanel"
				aria-labelledby="{convertIdToUniqueString(pdfFileId)}-tab"
			>
				<PdfReader {pdfFileId} />
			</div>
		{/each}
	</div>
{/if}
