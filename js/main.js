WebFont.load({
  google: {
    families: [
      'Special Elite',
      'Fredericka the Great',
    ],
  }
});

const upscale = 2;

let canvas = document.querySelector('#canvas');
canvas.width = 800 * upscale;
canvas.height = 600 * upscale;

let ctx = canvas.getContext('2d');

let downloadButton = document.querySelector('#download-button');
downloadButton.addEventListener('click', () => {
  download(canvas, 'wise.png');
});
let generateButton = document.querySelector('#generate-button');
generateButton.addEventListener('click', () => {
  generateImage();
});

let quotes = quotes1;  // All quotes
// let quotes = quotes2;  // Motivational quotes

let markov = new Markov();
let authors = [];
for (let i = 0; i < quotes.length; ++i) {
  let text = quotes[i].quoteText;
  text = text.replace("'", '');
  markov.addStates(text);
  let author = quotes[i].quoteAuthor;
  authors.push(author ? author : 'Anonymous');
}
markov.train(8);

let imageSources = [
  'images/nathan-anderson-kTaIjvHsyJg-unsplash.jpg',
  'images/theresa-panag-xNsgecFL1R4-unsplash.jpg',
  'images/yousef-espanioly-zirEBF7OnKQ-unsplash.jpg',
  'images/ave-calvar-s-YtQJg1oNg-unsplash.jpg',
  'images/lorenzo-hamers-PEo6OYWiDKE-unsplash.jpg',
];
let images = new Array(imageSources.length);
let numLoadedImages = 0;

for (let i = 0; i < imageSources.length; ++i) {
  images[i] = new Image();
  images[i].src = imageSources[i];
  images[i].addEventListener('load', imageLoaded);
}

function imageLoaded() {
  ++numLoadedImages;
  let allDone = numLoadedImages >= images.length;
  if (allDone) {
    generateImage();
  }
}

function generateImage() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  let image = images[Math.floor(Math.random() * images.length)];
  ctx.drawImage(image,
                (image.width - canvas.width) / 2, (image.height - canvas.height) / 2, canvas.width, canvas.height,
                0, 0, canvas.width, canvas.height);

  ctx.fillStyle = 'rgba(0,0,0,.33)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  let text = '“' + markov.generateRandom(300) + '”';
  text += ' <br> —' + authors[Math.floor(Math.random() * authors.length)];

  let textColor = '#fff';
  let fontStyle = '';
  let fontWeight = '400';
  let fontSize = 50 * upscale;
  let lineHeight = 1.2 * fontSize * upscale;
  let fontFamily = 'Special Elite';
  let textAlign = 'right';

  let font = fontStyle + ' ' + fontWeight + ' ' + fontSize + 'px' +
      '/' + lineHeight + 'px' + ' ' + fontFamily;
  let leftMargin = textAlign === 'left' ? 80 * upscale : canvas.width - 80 * upscale;

  ctx.fillStyle = textColor;
  ctx.textAlign = textAlign;

  canvasMultilineText(ctx, text, {
    rect: {
      x: canvas.width - 60 * upscale,
      y: 280 * upscale,
      width: canvas.width - 2 * 60 * upscale,
      height: canvas.height - 280,
    },
    font: 'Special Elite',
    lineHeight: 1.2,
    minFontSize: 15 * upscale,
    maxFontSize: fontSize,
  });
}

function download(canvas, filename) {
  // https://stackoverflow.com/questions/18480474/how-to-save-an-image-from-canvas
  let link = document.createElement('a');
  link.download = filename;
  link.href = canvas.toDataURL('image/png;base64');
  if (document.createEvent) {
    let clickEvent = document.createEvent('MouseEvents');
    clickEvent.initMouseEvent('click', true, true, window,
                              0, 0, 0, 0, 0, false, false, false,
                              false, 0, null);

    link.dispatchEvent(clickEvent);
  } else if (link.fireEvent) {
    link.fireEvent('onclick');
  }
}
