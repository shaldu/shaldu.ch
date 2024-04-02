window.addEventListener('message', (event) => {
  if (event.data.type && (event.data.type === 'OPEN_PDF')) {
    PDFViewerApplication.open({
      url: event.data.data.url
    }).then((pdfDocument) => {
      setTimeout(() => {
        const id = event.data.data.id;
        const url = event.data.data.url;
        const bookmarks = event.data.data.bookmarks;
        let progress = event.data.data.progress;
        PDFViewerApplication.fileId = id;
        let currentProgress = 0;

        const container = document.getElementById('viewerContainer');
        
        //get the scroll location from the relative progress
        const scrollLocation = (progress / 100) * container.scrollHeight;
        progress = scrollLocation;
        //scroll to the progress within the container
        container.scrollTop = progress;

        //TODO: figure out 
        container.addEventListener('scroll', (e) => {
          currentProgress = (container.scrollTop / container.scrollHeight) * 100;
        });

        //create a interval to send the progress to the parent window
        setInterval(() => {
          if (currentProgress === progress) {
            return;
          }
          progress = currentProgress;
          window.parent.postMessage({
            type: 'PROGRESS',
            data: {
              url,
              id,
              progress: currentProgress
            }
          }, '*');
        }, 3000);
      }, 100);
    });
  } else if (event.data.type && (event.data.type === 'GOTO_BOOKMARK')) {
    const page = event.data.data.page;
    PDFViewerApplication.page = page;
  }
});

//on right mouse button or mobile long press, event
document.addEventListener('contextmenu', (event) => {

  event.preventDefault();
  const selection = window.getSelection();
  const page = PDFViewerApplication.page;
  closeContextMenu();

    window.parent.postMessage({
      type: 'CONTEXT_MENU_OPEN',
      data: {
        fileId: PDFViewerApplication.fileId,
        selection: selection.toString(),
        page,
        posX: event.clientX,
        posY: event.clientY
      }
    }, '*');
});

function closeContextMenu() {
  window.parent.postMessage({
    type: 'CONTEXT_MENU_CLOSE',
    data: {
      fileId: PDFViewerApplication.fileId,
    }
  }, '*');
}

//on escape key press, event or click outside context menu
document.addEventListener('click', (event) => {
  closeContextMenu();
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeContextMenu();
  }
});