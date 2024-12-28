let audio1 = new Audio();
audio1.src = "chune.mp3";

const container = document.getElementById("container");
const canvas = document.getElementById("canvas");
// Sets canvas to occupy entire browser window size
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const ctx = canvas.getContext("2d");