
window.addEventListener('message', (event) => {
  if (event.data.type && (event.data.type === 'OPEN_PDF')) {
    const x = PDFViewerApplication.open({
      url: event.data.data.url
    }).then((pdfDocument) => {
      setTimeout(() => {
        
      }, 2000);
    });
  }
});
