<script lang="ts">
	import { Tabs, Tab, TabContent, Truncate } from 'carbon-components-svelte';
	import Close from 'carbon-icons-svelte/lib/Close.svelte';
	import { pdfFileIdsStore, sessionStore } from '$lib/stores';
	import PdfReader from './PDFReader.svelte';

	let selected = 0;

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

	let pdfFiles: PdfFile[] | null = null;

	fetchPdfFiles();

	//subscribe to the store
	$: $pdfFileIdsStore;

	//check if the store has changed
	$: if ($pdfFileIdsStore != null && $pdfFileIdsStore != undefined) {
		fetchPdfFiles();
		//TODO: update the url with the new pdfFileIdsStore
		tabChange();
	}

	async function fetchPdfFiles() {
		//fetch the collections from the server
		const url = '/api/auth/pdffile?fileId=' + $pdfFileIdsStore ?? '';

		await fetch(url, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		})
			.then((response) => response.json())
			.then((data) => {
				// pdfFiles = data;
				//loop through the data and check if the pdfFiles is already in data if not add it to the end
				if (pdfFiles == null) {
					pdfFiles = data;
				} else {
					data.forEach((item: PdfFile) => {
						if (item == null) return;
						const index = pdfFiles?.findIndex((pdfFile) => pdfFile?.id === item.id);
						if (index == -1) {
							pdfFiles?.push(item);
						}
					});
					const containingIds: string[] = []
					pdfFiles?.forEach((item) => {
						if (item == null) return;
						const index = data.findIndex((pdfFile) => pdfFile?.id === item.id);
						if (index == -1) {
							containingIds.push(item.id);
						}
					});
					containingIds.forEach((id) => {
						const index = pdfFiles?.findIndex((pdfFile) => pdfFile?.id === id);
						if (index != -1) {
							pdfFiles?.splice(index, 1);
						}
					});
					const tempPdfFiles = pdfFiles;
					pdfFiles = [];
					setTimeout(() => {
						pdfFiles = tempPdfFiles;
					}, 100);
				}
			})
			.catch((error) => {
				console.error('Error:', error);
			});
	}

	function onTabClick(event: MouseEvent, id: string, index: string) {
		event.preventDefault();
		let tmpSelected = '';
		const close: HTMLDivElement | null = event.target as HTMLDivElement;
		if (close && close.classList.contains('pdf-tab-pane-close')) {
			//close tab remove from storage and url, splice
			$pdfFileIdsStore = $pdfFileIdsStore?.filter((item) => item !== id);
		} else {
			//open tab
			tmpSelected = index;
		}
		saveCurrentSelectedToSession(tmpSelected);
	}

	async function tabChange() {
		await fetchPdfFiles();
		setUrl();
		loadCurrentSelectedFromSession();
	}

	function setUrl() {
		const url = new URL(window.location.href);
		url.searchParams.set('file', $pdfFileIdsStore?.join(','));
		window.history.pushState({}, '', url.toString());
	}

	function saveCurrentSelectedToSession(selected: string = '') {
		$sessionStore.selectedTab = selected;
	}

	function loadCurrentSelectedFromSession() {
		selected = $sessionStore.selectedTab;
	}

</script>

{#if pdfFiles != null}
	<Tabs type="container" selected={selected}>
		{#each pdfFiles as pdfFile, index}
			<Tab on:click={(e) => onTabClick(e, pdfFile.id, index)} tabindex={pdfFile.id}>
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
