<script lang="ts">
	import Bookmark from './Bookmark.svelte';

	export let bookmarks: {
		id: string;
		title: string;
		progress: string;
		description: string;
		page: number;
		bookmark: string;
		pdfFileId: string;
	}[] = [];

	function selection(id: string) {
		const bookmark = getBookmarkFromId(id);
		if (bookmark) {
			const pdfFileIdEscaped = convertIdToUniqueString(bookmark.pdfFileId);
			const iframe = document.querySelector('#file-open-' + pdfFileIdEscaped) as HTMLIFrameElement;

			iframe.contentWindow?.postMessage(
				{
					type: 'GOTO_BOOKMARK',
					data: {
						page: bookmark.page,
						fileId: bookmark.pdfFileId
					}
				},
				'*'
			);
		}
	}

	function convertIdToUniqueString(id: string) {
		return id.replaceAll(/[^a-zA-Z]/g, '');
	}

	function getBookmarkFromId(id: string) {
		return bookmarks.find((bookmark) => bookmark.id === id);
	}
</script>

{#if bookmarks.length > 0}
	<div class="right-side-panel col-12 col-md-2 faded-out">
		<div class="bookmarks-panel">
			<div class="card h-100">
				<div class="card-body">
					<div class="w-100 h-100 position-relative">
						<h5 class="card-title mb-4 mt-4">Bookmarks</h5>
						{#each bookmarks as bookmark}
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
		</div>
	</div>
{/if}
