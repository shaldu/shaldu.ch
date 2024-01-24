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

	onMount(() => {

	});
</script>

{#if pdfFile != null}
	<iframe src="{pdfFile.path}" title="{pdfFile.title}" frameborder="0"></iframe>
{/if}
