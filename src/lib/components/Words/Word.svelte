<script lang="ts">
	import { Tile } from 'carbon-components-svelte';
	import { Button, SelectableTile, TextArea } from 'carbon-components-svelte';

	export let title = 'undefined';
	export let page = 0;
	export let definition = 'undefined';
	export let id: string;
	export let selection: Function;
	export let color: string;
	export let selected = false;
</script>

<SelectableTile
	class="mb-4 w-100 single-word"
	light
	on:click={selection({title, definition, color, id}, !selected)}
	bind:selected
>
	<div class="inner">
		<div class="color-display true-mark-color" style="background-color: {color};"></div>
		<div class="word-title">
			{title}
		</div>
	</div>
	{#if definition && definition.length > 0 && selected}
		<div class="word-definition">
            <TextArea
                value={definition}
                readonly
            />
		</div>
	{/if}
</SelectableTile>
