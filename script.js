let audio1 = new Audio();
audio1.src = "/src/chune2.mp3";
audio1.volume = 0.4;
audio1.currentTime = 101;

const container = document.getElementById("container");
const canvas = document.getElementById("canvas");
// Sets canvas to occupy entire browser window size
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const ctx = canvas.getContext("2d");

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
let audioSource = null;
let analyser = null;

// Add resize event listener
window.addEventListener('resize', function() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

document.body.addEventListener('click', () => {
    audio1.play();
    audioSource = audioCtx.createMediaElementSource(audio1);
    analyser = audioCtx.createAnalyser();
    audioSource.connect(analyser);
    audioSource.connect(audioCtx.destination);

    analyser.fftSize = 512; 
    analyser.minDecibels = -90;
    analyser.maxDecibels = 0;
    analyser.smoothingTimeConstant = 0.85;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    // Recalculate bar width based on window resize to preserve styling
    function getBarWidth() {
        return (canvas.width / bufferLength);
    }

    let x = 0;
    const startColor = { h: 34, s: 100, l: 50 };
    const endColor = { h: 34, s: 100, l: 50 };
    function animate() {
        x = 0;
        const barWidth = getBarWidth();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        analyser.getByteFrequencyData(dataArray);
        for (let i = 0; i < bufferLength; i++) {
            barHeight = dataArray[i];
            // Calculate color for each bar
            // Adjust percent to focus on active frequency range (0-10kHz)
            const percent = i / (bufferLength / 2);
            // Clamp percent to max of 1 to ensure full color range
            const clampedPercent = Math.min(1, percent);

            // Interpolate between start and end colors
            const h = startColor.h + (endColor.h - startColor.h) * clampedPercent;
            const s = startColor.s + (endColor.s - startColor.s) * clampedPercent;
            const l = startColor.l + (endColor.l - startColor.l) * clampedPercent;

            const color = `hsl(${h}, ${s}%, ${l}%)`;
            ctx.fillStyle = color;
            ctx.fillRect(
                x + (canvas.width / 6), // Offset rects to center (prob better way to do this...)
                (canvas.height - barHeight), 
                barWidth, 
                barHeight
            );
            x += barWidth;
        }
        requestAnimationFrame(animate);
    }

    animate();
});
