<script lang="ts">
	import type { Cards } from '@prisma/client';
	import { Button, TextArea, TextInput, ToastNotification } from 'carbon-components-svelte';
    import Save from "carbon-icons-svelte/lib/Save.svelte";

    let toast: HTMLDivElement | undefined | null;
	let kind: 'error' | 'info' | 'success' | 'warning' = 'error';
	let toastTitle = 'Error';
	let subtitle = 'An internal server error occurred.';
	let caption = 'Something went wrong.';

	export let title: string = '';
	export let definition: string = '';

	async function createCard() {
		const url = '/api/auth/cards';

        const title = (document.querySelector('textarea[name="wordTitle"]') as HTMLTextAreaElement).value;
        const definition = (document.querySelector('textarea[name="wordDefinition"]') as HTMLTextAreaElement).value;

        if (!title || !definition) {
            toastTitle = 'Error';
            subtitle = 'Please fill in all fields';
            caption = 'Card not created';
            kind = 'error';
            toast?.classList.remove('hide');
            return;
        }

		const data = { title, definition };
		const options = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		};

		const response = await fetch(url, options);
		if (response.ok) {
			console.log('Card created');
            //reset the form
            (document.querySelector('textarea[name="wordTitle"]') as HTMLTextAreaElement).value = '';
            (document.querySelector('textarea[name="wordDefinition"]') as HTMLTextAreaElement).value = '';

            //show toast
            caption = 'Card created successfully';
            toastTitle = 'Card created';
            kind = 'success';
            toast?.classList.remove('hide');

		} else {
			console.error('Failed to create card');
            caption = 'Failed to create card';
            toastTitle = 'Card not created';
            kind = 'error';
            toast?.classList.remove('hide');
		}
	}
</script>
<div class="toast-notification hide" bind:this={toast}>
    <ToastNotification
        title={toastTitle}
        {subtitle}
        {caption}
        {kind}
        timeout={5000}
        lowContrast
        on:close={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toast?.classList.add('hide');
        }}
    />
</div>
<div class="card">
	<div class="card-body">
		<div class="row justify-content-between">
			<div class="col-12 col-md-6 mt-2">
				<TextArea
					light
					labelText="Word title"
					name="wordTitle"
					placeholder="Enter Word title..."
					value={title}
				>{title}</TextArea>
			</div>
			<div class="col-12 col-md-6 mt-2">
				<TextArea
					light
					labelText="Word definition"
					name="wordDefinition"
					placeholder="Enter Word definition..."
					value={definition}
				>{definition}</TextArea>
			</div>
		</div>
		<div class="row mt-4 justify-content-center">
			<div class="col-12 col-md-6 text-center">
				<Button icon={Save} kind="primary" on:click={() => createCard()}>Create Card</Button>
			</div>
		</div>
	</div>
</div>
