
window.addEventListener('message', (event) => {
  if (event.data.type && (event.data.type === 'OPEN_PDF')) {
    PDFViewerApplication.open({
      url: event.data.data.url
    }).then((pdfDocument) => {
      setTimeout(() => {
        const url = event.data.data.url;
        const bookmarks = event.data.data.bookmarks;
        const progress = event.data.data.progress;
        console.log(progress);
      }, 100);
    });
  }
});
