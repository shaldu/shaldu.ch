<script lang="ts">
	import { Button } from 'carbon-components-svelte';
    import Notebook from "carbon-icons-svelte/lib/Notebook.svelte";
    import Edit from "carbon-icons-svelte/lib/Edit.svelte";
	import CreateCard from '$lib/components/Cards/CreateCard.svelte';
	import LearnCard from '$lib/components/Cards/LearnCard.svelte';

	let showCardsContentPanel: boolean = true;

	function switchCardsContentPanel(isContent: boolean) {
        showCardsContentPanel = isContent;
	}
</script>

<div>
	<div class="container-fluid g-0">
		<div class="row g-0">
			<div class="left-side-panel col-12 col-md-2">
				<div class="learncards card">
					<div class="card-body">
						<div class="w-100 h-100 position-relative">
                            <div class="mb-4 w-100">
                                <Button
                                    icon={Notebook}
                                    kind={'secondary'}
                                    class={showCardsContentPanel ? 'active' : ''}
                                    on:click={() => {switchCardsContentPanel(true)}}
                                >Learning</Button>
                            </div>
                            <div class="mb-4 w-100">
                                <Button
                                    icon={Edit}
                                    kind={'secondary'}
                                    class={!showCardsContentPanel ? 'active' : ''}
                                    on:click={() => {switchCardsContentPanel(false)}}
                                >Create Card</Button>
                            </div>
						</div>
					</div>
				</div>
			</div>
            <div class="col">
                {#if showCardsContentPanel}
                    <div class="card-box h-100">
                        <LearnCard />
                    </div>
                {:else}
                    <div class="card-box">
                        <CreateCard />
                    </div>
                {/if}
            </div>
		</div>
	</div>
</div>
