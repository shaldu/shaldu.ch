<script lang="ts">
	import CustomContextMenu from "./CustomContextMenu.svelte";

	export let pdfFileId: string | null = null;
	export let pdfFileIdEscaped: string | null = null;
	let contextMenuOpen = false;
	let iframeRef: HTMLIFrameElement | null = null;

	type PdfFile = {
		id: string;
		title: string;
		path: string;
		progress: number;
		bookmarks: {
			id: string;
			title: string;
			progress: string;
			description: string;
			page: number;
		}[];
	} | null;

	type CustomContextMenuProps = {
		selectedText: string;
		page: number;
		position: { x: number; y: number };
	};

	let customContextMenuProps: CustomContextMenuProps;

	async function fetchPdfFiles() {
		//fetch the collections from the server
		const url = '/api/auth/pdffile?fileId=' + pdfFileId ?? '';

		const response = await fetch(url, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		});

		const data = await response.json();

		return data[0];
	}

	let pdfFilePromise = fetchPdfFiles();

	function iframeOnLoad(pdfFile: PdfFile) {
		if (pdfFile == null) return;

		const iframe = document.querySelector('#file-open-' + pdfFileIdEscaped) as HTMLIFrameElement;

		setTimeout(() => {
			iframe.contentWindow?.postMessage(
				{
					type: 'OPEN_PDF',
					data: {
						id: pdfFile?.id,
						url: pdfFile?.path,
						bookmarks: pdfFile?.bookmarks,
						progress: pdfFile?.progress
					}
				},
				'*'
			);
		}, 200);
	}

	// IMPORTANT !! ALWAYS COMPARE THE FILE ID 
	window.addEventListener('message', (event) => {
		if (iframeRef == null) return;

		if (event.data.type === 'PROGRESS' && event.data.data.id === pdfFileId) {
			const id = event.data.data.id;
			const progress = event.data.data.progress;
			sendProgressToServer(progress, id);
		}

		if (event.data.type === 'CONTEXT_MENU_OPEN' && event.data.data.fileId === pdfFileId) {
			const textSelection = event.data.data.selection;
			const page = event.data.data.page;
			let positionX = event.data.data.posX;
			let positionY = event.data.data.posY;

			//add the iframeRef position to the positionX and positionY to get the correct position
			const iframePosition = iframeRef.getBoundingClientRect();

			positionX += iframePosition.left;
			positionY += iframePosition.top;

			customContextMenuProps = {
				selectedText: textSelection,
				page: page,
				position: { x: positionX, y: positionY }
			} as CustomContextMenuProps;
			contextMenuOpen = true;
		}

		if (event.data.type === 'CONTEXT_MENU_CLOSE' && event.data.data.fileId === pdfFileId) {
			contextMenuOpen = false;
		}
	});

	window.oncontextmenu = function () {
		contextMenuOpen = false;
	}

	function sendProgressToServer(progress: number, pdfFileId: string) {
		const url = '/api/auth/pdffile';
		const data = {
			mode: 'setPdfFileProgress',
			id: pdfFileId,
			progress: progress
		};

		fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		});
	}
</script>

{#await pdfFilePromise then pdfFile}
	<iframe
		bind:this={iframeRef}
		on:load={() => iframeOnLoad(pdfFile)}
		src="/pdfjs/web/viewer.html"
		id="file-open-{pdfFileIdEscaped}"
		title={pdfFile.title}
		data-url={pdfFile.path}
		frameborder="0"
	></iframe>
{/await}

{#if contextMenuOpen}
	<CustomContextMenu {customContextMenuProps} open={contextMenuOpen}/>
{/if}