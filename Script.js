let drawing = false;
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.addEventListener('mousedown', (e) => {
    drawing = true;
    draw(e);
});

canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', () => {
    drawing = false;
    ctx.beginPath();
});

canvas.addEventListener('mouseout', () => {
    drawing = false;
    ctx.beginPath();
});

function draw(e) {
    if (!drawing) return;
    ctx.lineWidth = 20;  // Brush size
    ctx.lineCap = 'round';
    ctx.strokeStyle = 'black';  // Mask color

    ctx.lineTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
}

document.getElementById('inpaintButton').addEventListener('click', () => {
    const image = canvas.toDataURL('image/png');
    const mask = createMask();

    fetch('http://localhost:5000/inpaint', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image, mask }),
    })
    .then(response => response.json())
    .then(data => {
        const resultImg = document.getElementById('resultImg');
        resultImg.src = data.result;
        resultImg.style.display = 'block';
    });
});

function createMask() {
    // Create a separate canvas for the mask
    const maskCanvas = document.createElement('canvas');
    maskCanvas.width = canvas.width;
    maskCanvas.height = canvas.height;
    const maskCtx = maskCanvas.getContext('2d');

    // Copy the drawn mask to the mask canvas
    maskCtx.drawImage(canvas, 0, 0);

    // Return the mask as a base64-encoded string
    return maskCanvas.toDataURL('image/png');
}
