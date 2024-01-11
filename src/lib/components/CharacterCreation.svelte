<script lang="ts">
	import { Button, Slider, TextInput } from 'carbon-components-svelte';
</script>

<div class="row justify-content-center">
	<div class="col-12 col-md-6">
		<div class="card">
			<div class="card-header text-center">
				<h3>Create new Character</h3>
			</div>
			<div class="card-body">
				<div class="text-center w-100">
					<TextInput
						class="mb-5"
						name="characterName"
						labelText="Character Name"
						placeholder="Character Name"
						type="text"
					/>
					<Button class="text-center" kind="secondary" size="field" type="submit"
						>Create Character</Button
					>
				</div>
			</div>
		</div>
	</div>
</div>
