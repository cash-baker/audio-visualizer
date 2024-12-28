let audio1 = new Audio();
audio1.src = "/src/chune.mp3";
audio1.volume = 0.4;

const container = document.getElementById("container");
const canvas = document.getElementById("canvas");
// Sets canvas to occupy entire browser window size
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const ctx = canvas.getContext("2d");

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
let audioSource = null;
let analyser = null;

document.body.addEventListener('click', () => {
    audio1.play();
    audioSource = audioCtx.createMediaElementSource(audio1);
    analyser = audioCtx.createAnalyser();
    audioSource.connect(analyser);
    audioSource.connect(audioCtx.destination);

    analyser.fftSize = 256; 
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    const barWidth = canvas.width / bufferLength; 

    let x = 0;
    function animate() {
        x = 0;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        analyser.getByteFrequencyData(dataArray);
        for (let i = 0; i < bufferLength; i++) {
            barHeight = dataArray[i];
            ctx.fillStyle = "white";
            ctx.fillRect(x, canvas.height - barHeight + 20, barWidth, barHeight);
            x += barWidth;
        }
        requestAnimationFrame(animate);
    }

    animate();
});

