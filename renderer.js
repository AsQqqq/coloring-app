const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const colorPicker = document.getElementById('colorPicker');

// Загрузка изображения
const img = new Image();
img.src = './assets/sample.png'; // Укажите путь к вашему черно-белому изображению
img.onload = () => {
  canvas.width = img.width;
  canvas.height = img.height;
  ctx.drawImage(img, 0, 0);
};

// Функция flood fill
function floodFill(x, y, fillColor) {
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const { data } = imageData;
  const targetColor = getPixelColor(data, x, y);
  if (colorsMatch(targetColor, fillColor)) return;

  const stack = [[x, y]];
  while (stack.length) {
    const [cx, cy] = stack.pop();
    const pixelColor = getPixelColor(data, cx, cy);
    if (!colorsMatch(pixelColor, targetColor)) continue;

    setPixelColor(data, cx, cy, fillColor);
    if (cx + 1 < canvas.width) stack.push([cx + 1, cy]);
    if (cx - 1 >= 0) stack.push([cx - 1, cy]);
    if (cy + 1 < canvas.height) stack.push([cx, cy + 1]);
    if (cy - 1 >= 0) stack.push([cx, cy - 1]);
  }
  ctx.putImageData(imageData, 0, 0);
}

function getPixelColor(data, x, y) {
  const index = (y * canvas.width + x) * 4;
  return [data[index], data[index + 1], data[index + 2], data[index + 3]];
}

function setPixelColor(data, x, y, color) {
  const index = (y * canvas.width + x) * 4;
  [data[index], data[index + 1], data[index + 2], data[index + 3]] = color;
}

function colorsMatch(c1, c2) {
  return c1[0] === c2[0] && c1[1] === c2[1] && c1[2] === c2[2] && c1[3] === c2[3];
}

function hexToRgba(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return [r, g, b, 255];
}

// Обработка клика по канвасу
canvas.addEventListener('click', (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = Math.floor(e.clientX - rect.left);
  const y = Math.floor(e.clientY - rect.top);
  const fillColor = hexToRgba(colorPicker.value);
  floodFill(x, y, fillColor);
});