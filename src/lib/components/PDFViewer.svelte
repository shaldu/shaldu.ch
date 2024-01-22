<script lang="ts">
	import { Button } from 'carbon-components-svelte';
	import ArrowRight from 'carbon-icons-svelte/lib/ArrowRight.svelte';
	import { Tabs, Tab, TabContent, Truncate } from 'carbon-components-svelte';
	import Close from 'carbon-icons-svelte/lib/Close.svelte';
	import { pdfFileIdsStore } from '$lib/stores';

	let pdfFiles:
		| {
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

	function onTabClick(event: MouseEvent){
		event.preventDefault();
		console.log(event.target);
		
	}

</script>

{#if pdfFiles != null}
	<Tabs type="container">
		{#each pdfFiles as pdfFile}
			<Tab on:click={(e) => onTabClick(e)}>
				<span class="pdf-tab-pane">
					<div class="pdf-tab-pane-text">
						<Truncate>{pdfFile.title}</Truncate>
					</div>
					<Close />
				</span>
			</Tab>
		{/each}
		<svelte:fragment slot="content">
			{#each pdfFiles as pdfFile}
				<TabContent class="pdf-tab-content">
					<div class="w-100 h-100">
						<iframe src={pdfFile.path} frameborder="0"></iframe>
					</div>
				</TabContent>
			{/each}
		</svelte:fragment>
	</Tabs>
{/if}
