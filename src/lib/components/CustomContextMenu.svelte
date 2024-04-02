<script lang="ts">
	import {
		ContextMenu,
		ContextMenuDivider,
		ContextMenuGroup,
		ContextMenuOption,

		Modal,

		TextInput


	} from 'carbon-components-svelte';
    import CopyFile from "carbon-icons-svelte/lib/CopyFile.svelte";
	import { onMount } from 'svelte';

	type CustomContextMenuProps = {
		selectedText: string;
		page: number;
		position: { x: number; y: number };
	};

	export let customContextMenuProps: CustomContextMenuProps;
    export let open: boolean;
    export let addBookmark: Function;


    let bookmarkPromptShow = false;
    function bookMarkPrompt() {
        bookmarkPromptShow = true;
    }

    onMount(() => {

    });

</script>

{#if bookmarkPromptShow }
    <Modal
        bind:open
        modalHeading="Create Bookmark"
        primaryButtonText="Create"
        secondaryButtonText="Cancel"
        on:click:button--secondary={() => (open = false)}
        on:click:button--primary={() => {
            bookmarkPromptShow = false;
            addBookmark();
        }}
        on:open
        on:close
        on:submit
        >
        <div>
            <TextInput
                labelText="Bookmark title"
                name="bookmarkTitle"
                placeholder="Enter Bookmark title..."
            />
        </div>
        <div class="mt-2">
            <TextInput
            light
            labelText="Bookmark description"
            name="bookmarkDescription"
            placeholder="Enter Bookmark description..."
            ></TextInput>
        </div>
    </Modal>
{/if}


<ContextMenu open={open} x={customContextMenuProps.position.x} y={customContextMenuProps.position.y} >
  <ContextMenuOption
    indented
    labelText="Copy"
    icon={CopyFile}
    on:click={() => {
      navigator.clipboard.writeText(customContextMenuProps.selectedText);
    }}
  />
    <ContextMenuDivider />
    <ContextMenuOption indented labelText="Export as">
      <ContextMenuGroup labelText="Export options" >
        <ContextMenuOption id="pdf" labelText="PDF" />
        <ContextMenuOption id="txt" labelText="TXT" />
        <ContextMenuOption id="mp3" labelText="MP3" />
      </ContextMenuGroup>
    </ContextMenuOption>
    <ContextMenuDivider />
    <ContextMenuOption selectable labelText="Remove metadata" />
    <ContextMenuDivider />
    <ContextMenuGroup labelText="Style options">
      <ContextMenuOption id="0" labelText="Font smoothing" selected />
      <ContextMenuOption id="1" labelText="Reduce noise" />
      <ContextMenuOption id="2" labelText="Auto-sharpen" />
    </ContextMenuGroup>
    <ContextMenuDivider />
    <ContextMenuOption indented labelText="Add Bookmark" on:click={bookMarkPrompt} />
  </ContextMenu>