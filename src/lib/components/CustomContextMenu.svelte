<script lang="ts">
	import {
		ContextMenu,
		ContextMenuDivider,
		ContextMenuGroup,
		ContextMenuOption,
		Modal,
		TextInput
	} from 'carbon-components-svelte';
	import CopyFile from 'carbon-icons-svelte/lib/CopyFile.svelte';
	import { onMount } from 'svelte';
	import JishoModal from './JishoModal.svelte';
	import WordCollectionModal from './WordCollectionModal.svelte';
	
	type CustomContextMenuProps = {
		selectedText: string;
		page: number;
		position: { x: number; y: number };
		pdfFileId: string | null;
	};

	export let customContextMenuProps: CustomContextMenuProps;
	export let open: boolean;

	let wordCollectionModalRef: null | any = null;
	let wordCollectionPromptShow = false;

	function wordCollectionPrompt() {
		wordCollectionPromptShow = true;
	}

	function closeWordCollectionModal() {
		wordCollectionPromptShow = false;
	}

	let bookmarkModalRef: null | any = null;
	let bookmarkPromptShow = false;

	function bookMarkPrompt() {
		bookmarkPromptShow = true;
	}

	async function addBookmark() {
		bookmarkPromptShow = false;
		const form = document.querySelector('.addBookmark') as HTMLFormElement;
		if (!form) return;
		const formData = new FormData(form);
		const url = '/api/auth/bookmark';
		const bookmarkTitle = formData.get('bookmarkTitle') as string;
		const bookmarkDescription = formData.get('bookmarkDescription') as string;

		const data = {
			bookmarkTitle,
			bookmarkDescription,
			pdfFileId: customContextMenuProps.pdfFileId,
			page: customContextMenuProps.page
			
		};

		await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		})
			.then((response) => response.json())
			.then((data) => {
				//TODO: add toast ?
			})
			.catch((error) => {
				//TODO: add toast ?
			});
	}

	let isJapanese = false;
	function detectJapaneseSelection() {
		const selectedText = customContextMenuProps.selectedText;
		const japaneseRegex = /[\u3040-\u30FF\u3400-\u4DBF\u4E00-\u9FFF\uF900-\uFAFF]/;
		isJapanese = japaneseRegex.test(selectedText);
	}

	let jishoModalOpen = false;
	let jishoData: any = null;
	let wordDefinition = '';
	async function jishoLookUp() {
		const url = '/api/auth/jisho?word=' + customContextMenuProps.selectedText;
		const response = await fetch(url, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		});

		const data = await response.json();
		if (data.status === 200) {
			jishoData = data.body.result;
			jishoModalOpen = true;
		} else {
			console.log(data);
		}
	}

	async function addWordDefinitionFromJisho(wordDefinitionString: string) {
		wordDefinition = wordDefinitionString;		
		wordCollectionPromptShow = true;		
	}

	detectJapaneseSelection();
</script>

{#if jishoModalOpen}
	<JishoModal {jishoData} addWordDefinition={addWordDefinitionFromJisho} />
{/if}

{#if bookmarkPromptShow}
	<Modal
		bind:this={bookmarkModalRef}
		bind:open
		modalHeading="Create Bookmark"
		primaryButtonText="Create"
		secondaryButtonText="Cancel"
		on:click:button--secondary={() => (open = false)}
		on:click:button--primary={(e) => {
			addBookmark();
		}}
		on:open
		on:close
		on:submit
	>
		<form method="post" class="addBookmark">
			<div>
				<TextInput
					labelText="Bookmark title"
					name="bookmarkTitle"
					placeholder="Enter Bookmark title..."
				/>
			</div>
			<div class="mt-2">
				<TextInput
					light
					labelText="Bookmark description"
					name="bookmarkDescription"
					placeholder="Enter Bookmark description..."
				></TextInput>
			</div>
		</form>
	</Modal>
{/if}

{#if wordCollectionPromptShow}
	<WordCollectionModal title={customContextMenuProps.selectedText} closeModal={closeWordCollectionModal} page={customContextMenuProps.page} definition={wordDefinition} />
{/if}

<ContextMenu {open} x={customContextMenuProps.position.x} y={customContextMenuProps.position.y}>
	<ContextMenuOption
		indented
		labelText="Copy"
		icon={CopyFile}
		on:click={() => {
			navigator.clipboard.writeText(customContextMenuProps.selectedText);
		}}
	/>
	<ContextMenuDivider />
	<ContextMenuOption selectable labelText="Jisho Look Up" on:click={jishoLookUp} />
	<ContextMenuDivider />
	<ContextMenuOption indented labelText="Add Bookmark" on:click={bookMarkPrompt} />
	<ContextMenuOption indented labelText="Create Word" on:click={wordCollectionPrompt} />
</ContextMenu>
