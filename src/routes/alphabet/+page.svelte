<script lang="ts">
	import Hiragana from '$lib/components/AlphabetLearn/Hiragana.svelte';
	import HiraganaKatakana from '$lib/components/AlphabetLearn/HiraganaKatakana.svelte';
	import Katakana from '$lib/components/AlphabetLearn/Katakana.svelte';
	import { Button } from 'carbon-components-svelte';
    import Notebook from "carbon-icons-svelte/lib/Notebook.svelte";

	let panelShown: "hiragana" | "katakana" | "both" = "hiragana";


	function switchCardsContentPanel(type: "hiragana" | "katakana" | "both") {
        panelShown = type;
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
                                    class={panelShown == 'hiragana' ? 'active' : ''}
                                    on:click={() => {switchCardsContentPanel("hiragana")}}
                                >Hiragana</Button>
                            </div>
                            <div class="mb-4 w-100">
                                <Button
                                    icon={Notebook}
                                    kind={'secondary'}
                                    class={panelShown == 'katakana' ? 'active' : ''}
                                    on:click={() => {switchCardsContentPanel("katakana")}}
                                >Katakana</Button>
                            </div>
                            <div class="mb-4 w-100">
                                <Button
                                    icon={Notebook}
                                    kind={'secondary'}
                                    class={panelShown == 'both' ? 'active' : ''}
                                    on:click={() => {switchCardsContentPanel("both")}}
                                >Both</Button>
                            </div>
						</div>
					</div>
				</div>
			</div>
            <div class="col">
                {#if panelShown == 'hiragana'}
                    <div class="card-box h-100">
                        <Hiragana />
                    </div>
                {:else if panelShown == 'katakana'}
                    <div class="card-box h-100">
                        <Katakana />
                    </div>
                {:else if panelShown == 'both'}
                    <div class="card-box h-100">
                        <HiraganaKatakana />
                    </div>
                {/if}
            </div>
		</div>
	</div>
</div>
