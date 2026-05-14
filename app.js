const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Настройки
const PIXEL_SIZE = 20;
const GRID_WIDTH = 50;
const GRID_HEIGHT = 50;
const COLORS = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ffffff', '#000000'];

let currentColor = COLORS[0];
let zoom = 1;
let offsetX = 0;
let offsetY = 0;
let isDrawing = false;

// Инициализация
canvas.width = GRID_WIDTH * PIXEL_SIZE;
canvas.height = GRID_HEIGHT * PIXEL_SIZE;

// Создаём сетку пикселей
let pixels = Array(GRID_HEIGHT).fill(null).map(() => Array(GRID_WIDTH).fill('#1a1a2e'));

// Создаём палитру цветов
const colorPicker = document.getElementById('colorPicker');
COLORS.forEach((color, index) => {
    const btn = document.createElement('div');
    btn.className = 'color-btn';
    btn.style.backgroundColor = color;
    if (index === 0) btn.classList.add('active');
    btn.onclick = () => {
        currentColor = color;
        document.querySelectorAll('.color-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
    };
    colorPicker.appendChild(btn);
});

// Рисование
function drawPixel(x, y) {
    const pixelX = Math.floor((x - offsetX) / (PIXEL_SIZE * zoom));
    const pixelY = Math.floor((y - offsetY) / (PIXEL_SIZE * zoom));
    
    if (pixelX >= 0 && pixelX < GRID_WIDTH && pixelY >= 0 && pixelY < GRID_HEIGHT) {
        pixels[pixelY][pixelX] = currentColor;
        render();
    }
}

function render() {
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    for (let y = 0; y < GRID_HEIGHT; y++) {
        for (let x = 0; x < GRID_WIDTH; x++) {
            ctx.fillStyle = pixels[y][x];
            ctx.fillRect(
                x * PIXEL_SIZE * zoom + offsetX,
                y * PIXEL_SIZE * zoom + offsetY,
                PIXEL_SIZE * zoom,
                PIXEL_SIZE * zoom
            );
        }
    }
    
    // Сетка
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 0.5;
    for (let x = 0; x <= GRID_WIDTH; x++) {
        ctx.beginPath();
        ctx.moveTo(x * PIXEL_SIZE * zoom + offsetX, offsetY);
        ctx.lineTo(x * PIXEL_SIZE * zoom + offsetX, GRID_HEIGHT * PIXEL_SIZE * zoom + offsetY);
        ctx.stroke();
    }
    for (let y = 0; y <= GRID_HEIGHT; y++) {
        ctx.beginPath();
        ctx.moveTo(offsetX, y * PIXEL_SIZE * zoom + offsetY);
        ctx.lineTo(GRID_WIDTH * PIXEL_SIZE * zoom + offsetX, y * PIXEL_SIZE * zoom + offsetY);
        ctx.stroke();
    }
}

// События мыши
canvas.addEventListener('mousedown', (e) => {
    isDrawing = true;
    const rect = canvas.getBoundingClientRect();
    drawPixel(e.clientX - rect.left, e.clientY - rect.top);
});

canvas.addEventListener('mousemove', (e) => {
    if (!isDrawing) return;
    const rect = canvas.getBoundingClientRect();
    drawPixel(e.clientX - rect.left, e.clientY - rect.top);
});

canvas.addEventListener('mouseup', () => isDrawing = false);
canvas.addEventListener('mouseleave', () => isDrawing = false);

// Функции управления
function clearCanvas() {
    pixels = Array(GRID_HEIGHT).fill(null).map(() => Array(GRID_WIDTH).fill('#1a1a2e'));
    render();
}

function zoomIn() {
    zoom *= 1.2;
    render();
}

function zoomOut() {
    zoom /= 1.2;
    render();
}

// Первый рендер
render();
