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
  }
});
