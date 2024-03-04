<script lang="ts">
	import ArrowLeft from 'carbon-icons-svelte/lib/ArrowLeft.svelte';
	import { collectionIdStore, pdfFileIdsStore, selectedPdfFileIdStore } from '$lib/stores';
	import { Modal, Button, TextInput, SkeletonText, FileUploader } from 'carbon-components-svelte';
	import Add from 'carbon-icons-svelte/lib/Add.svelte';
	import SingleFileCollection from './SingleFileCollection.svelte';
	import { updateLastUrl } from '$lib/auth';

	let open = false;

	export let addFileFormElm: HTMLFormElement;
	fetchFileCollections();

	let fileCollection: { id: string; title: string }[] | null | undefined = undefined;

	function fetchFileCollections() {
		//fetch the collections from the server
		const url = '/api/auth/filecollection?collectionId=' + $collectionIdStore ?? '';

		fetch(url, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		})
			.then((response) => response.json())
			.then((data) => {
				fileCollection = data;
				$selectedPdfFileIdStore = data[0].id;
			})
			.catch((error) => {
				console.error('Error:', error);
			});
	}

	const selection = (id: string, isSelected: boolean) => () => {
		//set the selected collection as a parameter in the url
		const baseState = `?collection=${$collectionIdStore}`;

		// history.pushState(null, '', `&file=${id}`);
		const pdfIdCollection: any = $pdfFileIdsStore ?? [];

		//is array

		//check if array
		if (pdfIdCollection != null && pdfIdCollection != undefined && Array.isArray(pdfIdCollection)) {
			//check if id inside list
			if (pdfIdCollection.includes(id)) {
				if (!isSelected) {
					//slice
					const index = pdfIdCollection.indexOf(id);
					pdfIdCollection.splice(index, 1);
				}
			} else {
				if (isSelected) {
					pdfIdCollection.push(id);
				}
			}
		}

		setTimeout(() => {
			$pdfFileIdsStore = pdfIdCollection;
			history.pushState(null, '', baseState + `&file=${pdfIdCollection.join(',')}`);
			//update to DB to save url
			updateLastUrl();
		}, 10);
	};
</script>

<div class="collection card">
	<div class="card-body">
		<div class="w-100 position-relative h-100">
			<Button
				class="w-100 back-to"
				size="small"
				icon={ArrowLeft}
				on:click={() => {
					$collectionIdStore = null;

				}}>Back to collections</Button
			>
			<h5 class="card-title mb-4 mt-4">File Collection</h5>
			<div class="collection-holder w-100">
				{#if fileCollection != null && fileCollection.length > 0}
					{#each fileCollection as file, index}
						<SingleFileCollection title={file.title} id={file.id} {selection} selected={$pdfFileIdsStore?.includes(file.id)} />
					{/each}
				{:else if fileCollection == undefined}
					<SkeletonText heading />
				{:else}
					<div class="text-center">
						<p>You don't have any Files yet.</p>
					</div>
				{/if}
			</div>
		</div>
		<Button class="w-100" icon={Add} on:click={() => (open = true)}>Upload PDF File</Button>
		<Modal
			bind:open
			modalHeading="Upload PDF File"
			primaryButtonText="Create"
			secondaryButtonText="Cancel"
			on:click:button--secondary={() => (open = false)}
			on:click:button--primary={() => {
				open = false;
				addFileFormElm.submit();
			}}
			on:open
			on:close
			on:submit
		>
			<div>
				<input type="hidden" name="collectionId" value={$collectionIdStore} />
				<TextInput
					light
					labelText="Document title"
					name="fileTitle"
					placeholder="Enter document title..."
				/>
				<FileUploader
					class="mt-4"
					multiple={false}
					labelTitle="Upload PDF File"
					buttonLabel="Add PDF"
					labelDescription="Only PDF files are accepted."
					accept={['.pdf']}
					status="complete"
					name="fileUpload"
				/>
			</div>
		</Modal>
	</div>
</div>
