<script lang="ts">
	import SingleCollection from '$lib/components/SingleCollection.svelte';
	import ArrowLeft from 'carbon-icons-svelte/lib/ArrowLeft.svelte';

    const singeleCollectionData_test = ['Collection 1', 'Collection 2', 'Collection 3'];

    let selectedCollection: { id: number; title: string } | null = null;

    //get the url parameters
    const urlParams = new URLSearchParams(window.location.search);
    const collectionId = urlParams.get('collection');

    //if the url has a collection parameter, set the selected collection
    if (collectionId != null) {
        selectedCollection = {
            id: parseInt(collectionId),
            title: singeleCollectionData_test[parseInt(collectionId)]
        };
    }
	

	function selectedId(id: number | null) {
		if (id == null) {
			selectedCollection = null;
		} else {
			selectedCollection = {
				id: id,
				title: singeleCollectionData_test[id]
			};
		}
        //set the selected collection as a parameter in the url
        history.pushState(null, '', `?collection=${id}`);
	}

	
</script>

{#if selectedCollection == null}
	<div class="collection card">
		<div class="card-body">
			<div class="w-100">
				<h5 class="card-title">Collections</h5>
				<div class="collection-holder w-100">
					{#each singeleCollectionData_test as collection, index}
						<SingleCollection title={collection} id={index} selection={selectedId} />
					{/each}
				</div>
			</div>
			<a href="/collections/new" class="btn btn-primary">Create a new collection</a>
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
