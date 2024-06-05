<script lang="ts">
	import Word from './Word.svelte';
	import { selectedPdfFileIdStore } from '$lib/stores';
	import { onMount } from 'svelte';

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

	function deleteWord(wordId: string) {
		//delete the word from the database
		fetch(`/api/auth/wordcollection/?wordid=${wordId}`, {
			method: 'DELETE'
		})
			.then((res) => {
				if (res.ok) {
					//remove the word from the list
					words = words.filter((word) => word.id !== wordId);
				}
			})
			.catch((err) => {
				console.error(err);
			});
	}

	//create selection function
	const select =
		(word: any, isSelected: boolean, isDelete: boolean = false) =>
		() => {
			if (
				$selectedPdfFileIdStore === '' ||
				$selectedPdfFileIdStore === null ||
				$selectedPdfFileIdStore === undefined
			) {
				return;
			}

			if (isDelete) {
				deleteWord(word.id);
				return;
			}

			//send to pdf viewer to mark them
			const pdfFileIdEscaped = convertIdToUniqueString($selectedPdfFileIdStore);
			const iframe = document.querySelector('#file-open-' + pdfFileIdEscaped) as HTMLIFrameElement;

			let type = isSelected ? 'MARK_WORD' : 'UNMARK_WORD';
			if (iframe?.contentWindow === null || iframe?.contentWindow === undefined) {
				return;
			}
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

	//listen to MARK_WORD_CLICK event
	// IMPORTANT !! ALWAYS COMPARE THE FILE ID
	window.addEventListener('message', (event) => {
		if (event.data.type === 'MARK_WORD_CLICK') {
			const wordId = event.data.data.id;
			//find the word element with the id
			const wordElementId = '.' + wordId;
			const wordElement = document.querySelector(wordElementId);

			//set the border color
			if (wordElement !== null && wordElement !== undefined) {
				wordElement.style.borderColor = 'green';
				//scroll to the element
				wordElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
				setTimeout(() => {
					wordElement.style.borderColor = 'white';
				}, 3000);
			}
		}
	});

	onMount(() => {
		//event listener for the word shifter when the user clicks on the arrow
		const wordShifter = document.querySelector('.word-shifter');
		//add active class to the word shifter
		wordShifter?.addEventListener('click', () => {
			const wordPanel = document.querySelector('.words-panel');
			wordPanel?.classList.toggle('active');
		});
	});

</script>

{#if words.length > 0}
	<div class="words-panel">
		<div class="word-shifter"></div>
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
