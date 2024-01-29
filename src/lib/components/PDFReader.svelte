<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageServerLoad } from '../../routes/$types';

	export let pdfFile: {
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
	} | null = null;

	onMount(() => {
		if (pdfFile != null) {
			const iframe = document.querySelector('#file-open-' + pdfFile.id) as HTMLIFrameElement;		

			iframe.onload = () => {
		
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
			};
		}
	});
</script>

{#if pdfFile != null}
	<iframe
		src="/pdfjs/web/viewer.html"
		id="file-open-{pdfFile.id}"
		title={pdfFile.title}
		data-url={pdfFile.path}
		frameborder="0"
	></iframe>
{/if}
