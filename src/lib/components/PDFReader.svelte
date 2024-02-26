<script lang="ts">
	export let pdfFileId: string | null = null;
	export let pdfFileIdEscaped: string | null = null;

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

	//create a listener for the pdf iframe type: 'PROGRESS',
	window.addEventListener('message', (event) => {
		if (event.data.type === 'PROGRESS' && event.data.data.id === pdfFileId) {
			const id = event.data.data.id;
			const progress = event.data.data.progress;
			sendProgressToServer(progress, id);
		}
	});

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
		on:load={() => iframeOnLoad(pdfFile)}
		src="/pdfjs/web/viewer.html"
		id="file-open-{pdfFileIdEscaped}"
		title={pdfFile.title}
		data-url={pdfFile.path}
		frameborder="0"
	></iframe>
{/await}