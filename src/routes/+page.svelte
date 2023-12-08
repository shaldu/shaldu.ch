<script lang="ts">
	import { Form, TextInput, Button, Loading } from 'carbon-components-svelte';

	export let jsonData: {} | null = null;
	export let searching: boolean | null = null;
	export let error: boolean = false;

	async function subscribe(event: Event) {
		event.preventDefault();

		const form = event.target as HTMLFormElement;
		const data = new FormData(form);
		searching = true;
		error = false;

		const response = await fetch('/api/getCharacter', {
			method: 'POST',
			body: data
		});

		let jsonDataResp = await response.json();

		if (response.status == 200) {
			const jsonResponseData = jsonDataResp.data;

			searching = false;
			jsonData = jsonResponseData;
		} else {
			searching = false;
			error = true;
		}
	}
</script>

<div class="container mb-5">
	<div class="row justify-content-center">
		<div class="col-12 col-md-6">
			<div class="mt-5">
				<h1 class="text-center">Character stats</h1>
				<p style="font-size:14px;font-style:italic;margin-top:40px;max-width:480px">Displays data of the given character from the server <strong>Crusader Strike</strong> on the <strong>Season of Discovery</strong> server.</p>
			</div>
			<Form
				class="mt-3"
				on:submit={(e) => {
					subscribe(e);
				}}
			>
				<TextInput
					labelText="Character Name"
					name="characterName"
					placeholder="Enter Character Name"
					class="mb-3"
				></TextInput>
				<Button type="submit">Search</Button>
			</Form>
		</div>
		{#if error}
			<div class="col-12 mt-5">
				<div class="row justify-content-center flex-column">
					<div class="col-auto d-flex justify-content-center align-items-center flex-column">
						<h3 class="mt-2">Error fetching data</h3>
					</div>
				</div>
			</div>
		{:else if searching !== null}
			{#if searching}
				<div class="col-12 mt-5">
					<div class="row justify-content-center flex-column">
						<div class="col-auto d-flex justify-content-center align-items-center flex-column">
							<Loading withOverlay={false} />
							<p class="mt-2">Fetching Data ...</p>
						</div>
					</div>
				</div>
			{:else if jsonData !== null}
				<div class="col-12 col-8"></div>
				<h2 class="mt-3 mb-3">Data:</h2>
				<pre style="overflow:visible">{JSON.stringify(jsonData, null, 2)}</pre>
			{/if}
		{/if}
	</div>
</div>
