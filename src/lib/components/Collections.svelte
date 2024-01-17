<script lang="ts">
	import SingleCollection from '$lib/components/SingleCollection.svelte';
	import ArrowLeft from 'carbon-icons-svelte/lib/ArrowLeft.svelte';
	import { Modal, Button, TextInput, SkeletonText } from 'carbon-components-svelte';
	import Add from "carbon-icons-svelte/lib/Add.svelte";
	
	let open = false;
	export let createFormElm: HTMLFormElement;

	fetchCollections();

	let selectedCollection: { id: string; title: string } | null | undefined = null;
	let collections: { id: string; title: string }[] | null | undefined = undefined;

	//get the url parameters
	const urlParams = new URLSearchParams(window.location.search);
	const collectionId = urlParams.get('collection');

	//if the url has a collection parameter, set the selected collection
	if (collectionId != null) {
		
	}

	function selectedId(id: string | null) {
		if (id == null) {
			selectedCollection = null;
		} else {
			//find the collection with the id
			if (collections == null || collections == undefined) return;
			selectedCollection = collections.find((collection) => collection.id == id);
		}
		//set the selected collection as a parameter in the url
		history.pushState(null, '', `?collection=${id}`);
	}

	function fetchCollections() {
		//fetch the collections from the server
		const url = '/api/auth/collections';

		fetch(url, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		})
			.then((response) => response.json())
			.then((data) => {
				collections = data;
			})
			.catch((error) => {
				console.error('Error:', error);
			});
	}
</script>

{#if selectedCollection == null}
	<div class="collection card">
		<div class="card-body">
			<div class="w-100">
				<h5 class="card-title mb-4">Collections</h5>
				<div class="collection-holder w-100">
					{#if collections != null && collections.length > 0}
						{#each collections as collection, index}
							<SingleCollection title={collection.title} id={collection.id} selection={selectedId} />
						{/each}
					{:else if collections == undefined }
						<SkeletonText heading />
					{:else}
					<div class="text-center">						
						<p>You don't have any collections yet.</p>
					</div>
					{/if}

				</div>
			</div>
			<Button class="w-100" icon={Add} on:click={() => (open = true)}>Create collection</Button>
			<Modal
				bind:open
				modalHeading="Create collection"
				primaryButtonText="Create"
				secondaryButtonText="Cancel"
				on:click:button--secondary={() => (open = false)}
				on:click:button--primary={() => {
					open = false;
					createFormElm.submit();
				}}
				on:open
				on:close
				on:submit
			>
				<div>
					<TextInput
						light
						labelText="Collection name"
						name="title"
						placeholder="Enter collection name..."
					/>
				</div>
			</Modal>
		</div>
	</div>
{:else}
	<div class="collection card transparent">
		<div class="card-body">
			<div class="w-100">
				<div class="mb-4">
					<span
						class="btn-inline"
						on:click={() => {
							selectedCollection = null;
						}}><ArrowLeft /> Back to Collections</span
					>
				</div>
				<div>
					<h5 class="card-title">Collection {selectedCollection.title}</h5>
				</div>
			</div>
		</div>
	</div>
{/if}
