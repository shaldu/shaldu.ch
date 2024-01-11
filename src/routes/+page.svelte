<script lang="ts">
	import { sessionStore } from '$lib/stores';
	import CharacterCreation from '$lib/components/CharacterCreation.svelte';
	import type { ActionData } from './$types';

	export let form: ActionData;

</script>

<div class="container mb-5">
	<div class="row justify-content-center">
		{#if $sessionStore?.user}
			{#if $sessionStore?.account?.profile.characters?.length > 0}
				<h1>Character already exists</h1>
			{:else}
				<form action="?/createCharacter" method="POST">
					<CharacterCreation />
				</form>				
			{/if}
		{:else}
			<h1>Please Login to literally do anything</h1>
		{/if}
	</div>
</div>
