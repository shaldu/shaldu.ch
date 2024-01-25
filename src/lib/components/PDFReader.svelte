<script lang="ts">
	import { onMount } from 'svelte';


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
</script>

{#if pdfFile != null}
	<iframe src="/pdfjs/web/viewer.html" title="{pdfFile.title}" frameborder="0"></iframe>
{/if}
