// История изменений для undo
const history = [];
const maxHistory = 50; // Ограничение на размер истории

// Переменная для хранения выбранного цвета
let selectedColor = "#FF6B6B"; // По умолчанию яркий коралловый

// Сохранение состояния в историю
function saveHistory(element, oldColor) {
    if (history.length >= maxHistory) {
        history.shift(); // Удаляем старое действие, если стек полон
    }
    history.push({ element, color: oldColor });
}

// Обработчик выбора цвета из палитры
const swatches = document.querySelectorAll('.color-swatch');
swatches.forEach(swatch => {
    swatch.addEventListener('click', () => {
        swatches.forEach(s => s.classList.remove('active'));
        document.querySelector('.custom-color').classList.remove('active');
        swatch.classList.add('active');
        selectedColor = swatch.getAttribute('data-color');
    });
});

// Обработчик кастомного цвета
document.getElementById('customColor').addEventListener('input', function() {
    swatches.forEach(s => s.classList.remove('active'));
    this.classList.add('active');
    selectedColor = this.value;
});

// Обработчик клика по SVG для раскрашивания
const svg = document.getElementById('drawing');
svg.addEventListener('click', (e) => {
    const target = e.target;
    if (target.tagName === 'polygon' || target.tagName === 'circle' || target.tagName === 'path' || target.tagName === 'rect') {
        const oldColor = target.getAttribute('fill') || '#fff';
        saveHistory(target, oldColor);
        target.setAttribute('fill', selectedColor);
    }
});

// Обработчик кнопки "Очистить"
document.getElementById('resetButton').addEventListener('click', () => {
    const elements = svg.querySelectorAll('rect, path, polygon, circle');
    elements.forEach(el => {
        const oldColor = el.getAttribute('fill') || '#fff';
        if (oldColor !== '#fff') {
            saveHistory(el, oldColor);
            el.setAttribute('fill', '#fff');
        }
    });
    swatches.forEach(s => s.classList.remove('active'));
    document.querySelector('.custom-color').classList.remove('active');
    swatches[0].classList.add('active');
    selectedColor = swatches[0].getAttribute('data-color');
});

// Обработчик кнопки "Вернуть" (Undo)
document.getElementById('undoButton').addEventListener('click', () => {
    if (history.length > 0) {
        const lastAction = history.pop();
        lastAction.element.setAttribute('fill', lastAction.color);
    }
});