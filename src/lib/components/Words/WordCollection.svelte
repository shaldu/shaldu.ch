<script lang="ts">
	import Word from './Word.svelte';
	import { selectedPdfFileIdStore } from '$lib/stores';

	export let words: {
		id: string;
		title: string;
		definition: string;
		color: string;
		page: number;
		learnCollection: string;
	}[] = [];

	function convertIdToUniqueString(id: string) {
		return id.replaceAll(/[^a-zA-Z]/g, '');
	}

	//create selection function
	const select = (word: any, isSelected: boolean) => () => {
		if (
			$selectedPdfFileIdStore === '' ||
			$selectedPdfFileIdStore === null ||
			$selectedPdfFileIdStore === undefined
		) {
			return;
		}

		//send to pdf viewer to mark them
		const pdfFileIdEscaped = convertIdToUniqueString($selectedPdfFileIdStore);
		const iframe = document.querySelector('#file-open-' + pdfFileIdEscaped) as HTMLIFrameElement;

		let type = isSelected ? 'MARK_WORD' : 'UNMARK_WORD';
		iframe.contentWindow?.postMessage(
			{
				type: type,
				data: {
					title: word.title,
					definition: word.definition,
					color: word.color,
					id: convertIdToUniqueString(word.id)
				}
			},
			'*'
		);
	};
</script>

{#if words.length > 0}
	<div class="words-panel">
		<div class="card">
			<div class="card-body">
				<div class="w-100 position-relative">
					<h5 class="card-title mb-4 mt-4">Words</h5>
					<div class="word-collection">
						{#each words as word}
							<Word
								title={word.title}
								definition={word.definition}
								page={word.page}
								id={word.id}
								color={word.color}
								selection={select}
							/>
						{/each}
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}
