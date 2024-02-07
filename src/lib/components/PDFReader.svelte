<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageServerLoad } from '../../routes/$types';

	export let pdfFileId: string | null = null;

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

	async function fetchPdfFiles() {
		//fetch the collections from the server
		const url = '/api/auth/pdffile?fileId=' + pdfFileId ?? '';

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

	function iframeOnLoad(pdfFile: PdfFile) {
		if (pdfFile == null) return;
		const iframe = document.querySelector('#file-open-' + pdfFile.id) as HTMLIFrameElement;

		setTimeout(() => {
			iframe.contentWindow?.postMessage(
				{
					type: 'OPEN_PDF',
					data: {
						url: pdfFile?.path,
						bookmarks: pdfFile?.bookmarks
					}
				},
				'*'
			);
		}, 200);
	}
</script>

{#await pdfFilePromise then pdfFile}
	<iframe
		on:load={() => iframeOnLoad(pdfFile)}
		src="/pdfjs/web/viewer.html"
		id="file-open-{pdfFile.id}"
		title={pdfFile.title}
		data-url={pdfFile.path}
		frameborder="0"
	></iframe>
{/await}