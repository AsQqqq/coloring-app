const fs = require('fs').promises;
const path = require('path');

// Проверяем, что fabric доступен
if (!window.fabric) {
  console.error('Fabric.js не загружен. Убедитесь, что fabric.min.js подключен в index.html.');
  throw new Error('Fabric.js не загружен');
}

const canvas = new window.fabric.Canvas('canvas', {
  isDrawingMode: true
});

let images = [];
let currentImage = null;

async function loadImages() {
  const imageSelect = document.getElementById('imageSelect');
  try {
    const files = await fs.readdir(path.join(__dirname, '../assets'));
    images = files.filter(file => /\.(jpg|jpeg|png)$/i.test(file));
    imageSelect.innerHTML = '<option value="">Выберите изображение</option>';
    images.forEach(image => {
      const option = document.createElement('option');
      option.value = image;
      option.textContent = image;
      imageSelect.appendChild(option);
    });
    if (images.includes('sample.png')) {
      imageSelect.value = 'sample.png';
      const imagePath = path.join(__dirname, '../assets', 'sample.png');
      window.fabric.Image.fromURL(`file://${imagePath}`, (img) => {
        canvas.clear();
        img.scaleToWidth(canvas.width);
        canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas));
        currentImage = img;
      });
    }
  } catch (err) {
    console.error('Ошибка загрузки изображений:', err);
  }
}

document.getElementById('imageSelect').addEventListener('change', async (e) => {
  const imageName = e.target.value;
  if (imageName) {
    const imagePath = path.join(__dirname, '../assets', imageName);
    window.fabric.Image.fromURL(`file://${imagePath}`, (img) => {
      canvas.clear();
      img.scaleToWidth(canvas.width);
      canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas));
      currentImage = img;
    });
  } else {
    canvas.clear();
    currentImage = null;
  }
});

document.getElementById('colorPicker').addEventListener('input', (e) => {
  canvas.freeDrawingBrush.color = e.target.value;
});

document.getElementById('brushSize').addEventListener('input', (e) => {
  canvas.freeDrawingBrush.width = parseInt(e.target.value);
});

document.getElementById('brushBtn').addEventListener('click', () => {
  canvas.isDrawingMode = true;
  canvas.freeDrawingBrush.color = document.getElementById('colorPicker').value;
  canvas.freeDrawingBrush.width = parseInt(document.getElementById('brushSize').value);
  document.getElementById('brushBtn').classList.add('active');
  document.getElementById('eraserBtn').classList.remove('active');
  canvas.getElement().classList.remove('eraser');
});

document.getElementById('eraserBtn').addEventListener('click', () => {
  canvas.isDrawingMode = true;
  canvas.freeDrawingBrush.color = '#ffffff';
  canvas.freeDrawingBrush.width = parseInt(document.getElementById('brushSize').value);
  document.getElementById('eraserBtn').classList.add('active');
  document.getElementById('brushBtn').classList.remove('active');
  canvas.getElement().classList.add('eraser');
});

document.getElementById('clearBtn').addEventListener('click', () => {
  if (currentImage) {
    canvas.clear();
    canvas.setBackgroundImage(currentImage, canvas.renderAll.bind(canvas));
  } else {
    canvas.clear();
  }
});

document.getElementById('saveBtn').addEventListener('click', () => {
  const dataURL = canvas.toDataURL({
    format: 'png',
    quality: 1
  });
  const link = document.createElement('a');
  link.href = dataURL;
  link.download = `colored_image_${Date.now()}.png`;
  link.click();
});

document.getElementById('refreshBtn').addEventListener('click', () => {
  loadImages();
});

window.addEventListener('load', () => {
  canvas.freeDrawingBrush = new window.fabric.PencilBrush(canvas);
  canvas.freeDrawingBrush.color = document.getElementById('colorPicker').value;
  canvas.freeDrawingBrush.width = parseInt(document.getElementById('brushSize').value);
  loadImages();
});