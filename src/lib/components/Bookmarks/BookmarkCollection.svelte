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

	function selection(id:string) {
		console.log('selection: ' + id);
	}

</script>

{#if bookmarks.length > 0}
	<div class="right-side-panel col-12 col-md-2">
		<div class="card">
			<div class="card-body">
				{#each bookmarks as bookmark, i}
					<Bookmark
						title={bookmark.title}
						description={bookmark.description}
						page={bookmark.page}
						selection={() => selection(bookmark.id)}
						id={bookmark.id}
					/>
				{/each}
			</div>
		</div>
	</div>
{/if}
