<script lang="ts">
	import { Tile } from 'carbon-components-svelte';
	import { Button, SelectableTile, TextArea } from 'carbon-components-svelte';
	import TrashCan from "carbon-icons-svelte/lib/TrashCan.svelte";
	export let title = 'undefined';
	export let page = 0;
	export let definition = 'undefined';
	export let id: string;
	export let selection: Function;
	export let color: string;
	export let selected = false;


	function convertIdToUniqueString(id: string) {
		return id.replaceAll(/[^a-zA-Z]/g, '');
	}

</script>

<SelectableTile
	class="mb-4 w-100 single-word {convertIdToUniqueString(id)}"
	light
	id={convertIdToUniqueString(id)}
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
	{#if selected}
	<div class="close mt-3">
		<Button size="small" kind="danger-tertiary" iconDescription="Delete" icon={TrashCan} on:click={selection({title, definition, color, id}, !selected, true)} />
	</div>
	{/if}
</SelectableTile>
