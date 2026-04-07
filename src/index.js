var KID_COUNT = 3;
var VOLUME_THRESHOLD = 30;

var state = createInitialState(KID_COUNT, VOLUME_THRESHOLD);
var currentVolume = 0;
var lastTime = 0;

function setup() {
  var canvas = document.getElementById('game-canvas');
  var startButton = document.getElementById('start-button');
  var instructions = document.querySelector('.instructions');
  var ctx = canvas.getContext('2d');

  resizeCanvas(canvas);
  window.addEventListener('resize', function() {
    resizeCanvas(canvas);
    render(ctx, state, currentVolume);
  });

  render(ctx, state, 0);

  startButton.addEventListener('click', function() {
    startMicrophone(onVolumeChange).then(function() {
      document.getElementById('overlay').style.display = 'none';
      lastTime = performance.now();
      requestAnimationFrame(function(timestamp) { gameLoop(ctx, timestamp); });
    }).catch(function() {
      startButton.textContent = 'Mic access denied - tap to retry';
    });
  });
}

function onVolumeChange(volume) {
  currentVolume = volume;
}

function gameLoop(ctx, timestamp) {
  var deltaTime = Math.min((timestamp - lastTime) / 1000, 0.1);
  lastTime = timestamp;

  state = tick(state, currentVolume, deltaTime);
  render(ctx, state, currentVolume);
  requestAnimationFrame(function(ts) { gameLoop(ctx, ts); });
}

function resizeCanvas(canvas) {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

document.addEventListener('DOMContentLoaded', setup);
