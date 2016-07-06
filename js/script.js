// Define audio information and load
var audio = new Audio();
audio.src = 'Alan Walker - Fade [NCS Release].mp3';
audio.loop = true;
audio.autoplay = true;
audio.crossOrigin = "NCS";

// Define variables for view
var audioContext, view, source, fbc_array, data, len, total;

// Define Audio view Helpers
function createAudioContext() {
    audioContext = new (window.AudioContext || window.webkitAudioContext);
    view = audioContext.createAnalyser();
    view.fftSize = 4096; // change this to more or less triangles
    len = view.fftSize / 35;
    source = audioContext.createMediaElementSource(audio);
    source.connect(view);
    view.connect(audioContext.destination);
}

// Define main variables for canvas start
var canvas, canvasCtx;

// Define Canvas helpers
function createCanvas() {
    canvas = document.getElementById('view');
    canvasCtx = canvas.getContext('2d');
}

function defineSizesCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

// Define math info for draw
var i,
    cx, cy,
    r = 50,
    beginAngle = 0,
    angle,
    twoPI = 2 * Math.PI,
    angleGap = twoPI / 2,
    color = 'rgba(13, 71, 161, 1)';

// Create the animation
function frameLooper() {
    window.requestAnimationFrame(frameLooper);
    fbc_array = new Uint8Array(view.frequencyBinCount);

    canvasCtx.save();
    view.getByteFrequencyData(fbc_array);
    data = fbc_array;
    angle = beginAngle;
    cx = canvas.width / 2;
    cy = canvas.height / 2;
    canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
    canvasCtx.strokeStyle = color;
    canvasCtx.globalCompositeOperation = 'lighter';
    canvasCtx.lineWidth = 10;
    total = 0;
    for (i = 8; i < len; i += 2) {
        angle += 0.2;
        canvasCtx.beginPath();
        canvasCtx.moveTo(cx + data[i] * Math.sin(angle), cy + data[i] * Math.cos(angle));
        canvasCtx.lineTo(cx + data[i] * Math.sin(angle + angleGap), cy + data[i] * Math.cos(angle + angleGap));
        canvasCtx.lineTo(cx + data[i] * Math.sin(angle + angleGap * 2), cy + data[i] * Math.cos(angle + angleGap * 2));
        canvasCtx.closePath();
        canvasCtx.stroke();
        total += data[i];
    }
    beginAngle = (beginAngle + 0.00001 * total) % twoPI;
    canvasCtx.restore();
}

// Init
function init() {
    createAudioContext();
    createCanvas();
    defineSizesCanvas();
    frameLooper();
}

window.addEventListener('load', init, false);
window.addEventListener('resize', defineSizesCanvas, false);
