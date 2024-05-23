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
  } else if (event.data.type && (event.data.type === 'MARK_WORD')) {
    markWord(event.data.data.title, event.data.data.color, event.data.data.id);
  } else if (event.data.type && (event.data.type === 'UNMARK_WORD')) {
    unmarkWord(event.data.data.id);
  }
});

function unmarkWord(id) {
  const eventBus = PDFViewerApplication.eventBus;
  eventBus.on('pagechanging', (data) => {
    const page = data.pageNumber;
    const pdfViewer = PDFViewerApplication.pdfViewer;
    const pdfPageView = pdfViewer.getPageView(page - 1);
    const textlayer = pdfPageView.textLayer;
    if (!textlayer) {
      return;
    }
    //mark the word in the text layer
    const textDivs = textlayer.textDivs;
    if (!textDivs) {
      return;
    }
    textDivs.forEach((textDiv) => {
      const spans = textDiv.querySelectorAll('.marked-word');
      spans.forEach((span) => {
        if (span.getAttribute('data-word-id') === id) {
          const text = textDiv.textContent;
          const index = text.indexOf(span.textContent);
          const before = text.substring(0, index);
          const after = text.substring(index + span.textContent.length);
          textDiv.textContent = before + span.textContent + after;
          span.remove();
        }
      });
    });
  });
}

//find the word in the pdf and mark all the occurences with the provided color and the class marked-word and the data-word-id attribute
function markWord(title, color, id) {
  //trigger function on page change
  const eventBus = PDFViewerApplication.eventBus;
  eventBus.on('pagechanging', (data) => {
    const page = data.pageNumber;
    const pdfViewer = PDFViewerApplication.pdfViewer;
    const pdfPageView = pdfViewer.getPageView(page - 1);
    const textlayer = pdfPageView.textLayer;
    if (!textlayer) {
      return;
    }
    //mark the word in the text layer
    const textDivs = textlayer.textDivs;
    if (!textDivs) {
      return;
    }
    textDivs.forEach((textDiv) => {
      //make it work for japanese characters
      
      if (checkIfWordExists(textDiv.textContent, title)) {
        //wrap just the word in a span element
        const text = textDiv.textContent;
        const index = text.toLowerCase().indexOf(title.toLowerCase());
        const before = text.substring(0, index);
        const after = text.substring(index + title.length);
        const word = text.substring(index, index + title.length);
        const span = document.createElement('span');
        span.textContent = word;
        span.style.backgroundColor = color;
        if (checkDarkContrast(color)) {
          span.style.color = 'white';
        }        
        //replace the word in the text layer
        textDiv.textContent = before;
        textDiv.appendChild(span);
        textDiv.appendChild(document.createTextNode(after));
        span.setAttribute('data-word-id', id);
        span.classList.add('marked-word');
        span.onclick = () => {
          clickedMarkWord(id);
        }
      }
    });

  });
}

function clickedMarkWord(id) {
  window.parent.postMessage({
    type: 'MARK_WORD_CLICK',
    data: {
      id
    }
  }, '*');
}

function checkIfWordExists(text, word) {
  // Regular expression for case-insensitive partial word match (looser)
  const regex = new RegExp(`${word}`, 'gi');
  return regex.test(text);
}

//check if the color is dark or light for contrast
function checkDarkContrast(color) {
  const rgb = color.match(/\d+/g);
  const brightness = Math.round(((parseInt(rgb[0]) * 299) +
    (parseInt(rgb[1]) * 587) +
    (parseInt(rgb[2]) * 114)) / 1000);
  return brightness < 125;
}

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