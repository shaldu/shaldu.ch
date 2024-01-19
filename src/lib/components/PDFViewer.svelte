<script lang="ts">
	import { Button } from 'carbon-components-svelte';
	import ArrowRight from 'carbon-icons-svelte/lib/ArrowRight.svelte';
	import { pdfFileIdsStore } from '$lib/stores';

	let pdfFile: {
		title: string;
		path: string;
		progress: number;
		bookmarks: {
			title: string;
			link: string;
			description: string;
			page: number;
		}[];
	} | null = null;
    
	fetchPdfFile();

	function fetchPdfFile() {
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
				pdfFile = data;
			})
			.catch((error) => {
				console.error('Error:', error);
			});
	}
</script>

{#if pdfFile != null}
	<h3>{pdfFile.title}</h3>
{/if}
