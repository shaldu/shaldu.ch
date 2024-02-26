<script lang="ts">
	import Bookmark from './Bookmark.svelte';

	export let bookmarks: {
		id: string;
		title: string;
		progress: string;
		description: string;
		page: number;
		bookmark: string;
	}[] = [];
</script>

{#if bookmarks.length > 0}
	<div class="left-side-panel col-12 col-md-2">
		{#each bookmarks as bookmark, i}
			<Bookmark
				title={bookmark.title}
				description={bookmark.description}
				page={bookmark.page}
				selected={false}
				selection={() => {}}
				id={bookmark.id}
			/>
		{/each}
	</div>
{/if}
