<script lang="ts">
	import {
		Button,
		Modal,
		Accordion,
		AccordionItem,
		ExpandableTile,
        TextArea,
		TextInput

	} from 'carbon-components-svelte';    
    import ColorPicker from 'svelte-awesome-color-picker';
    import { collectionIdStore } from '$lib/stores';

    let hex = "#f6f0dc"

    let rgb = {
    "r": 246,
    "g": 240,
    "b": 220,
    "a": 1
    }

    let hsv = {
    "h": 46,
    "s": 11,
    "v": 96,
    "a": 1
    }

    let color: any = undefined;

    export let title: string;
    export let definition: string = '';
    export let closeModal: () => void;
    export let page: number;

    async function addWordCollection() {
        
		const form = document.querySelector('.addWordCollection') as HTMLFormElement;
		if (!form) return;
		const formData = new FormData(form);
		const url = '/api/auth/wordcollection';
		const wordTitle = formData.get('wordTitle') as string ;
		const wordDefinition = formData.get('wordDefinition') as string || '';

		const data = {
            wordTitle,
			wordDefinition,
			learnCollectionId: $collectionIdStore,
			page: page,
            color: hex
		};

        await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		})
			.then((response) => response.json())
			.then((data) => {
				//TODO: add toast ?
			})
			.catch((error) => {
				//TODO: add toast ?
			});

        closeModal();
    }

</script>
<Modal
	open
	modalHeading="Word for: {title}"
	preventCloseOnClickOutside
    primaryButtonText="Create"
    secondaryButtonText="Cancel"
    on:click:button--primary={(e) => {
        addWordCollection();
    }}
    on:click:button--secondary={(e) => {
        closeModal();
    }}
    on:open
    on:close
    on:submit
>

<form method="post" class="addWordCollection">
    <div>
        <TextInput
            labelText="Word title"
            name="wordTitle"
            placeholder="Enter Word title..."
        />
    </div>
    <div class="mt-2">
        <TextArea
            light
            labelText="Word definition"
            name="WordDefinition"
            placeholder="Enter Word definition..."
            value={definition}
        ></TextArea>
    </div>
    <div class="mt-2 color-picker-group">
        <p class="bx--label">Highlight color</p>
        <ColorPicker
            
            isAlpha={false}
            label=""
            bind:hex
            bind:rgb
            bind:hsv
            bind:color
        />
    </div>
</form>

</Modal>