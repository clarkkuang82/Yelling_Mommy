var KID_COUNT = 3;
var VOLUME_THRESHOLD = 30;

var state = createInitialState(KID_COUNT, VOLUME_THRESHOLD);
var currentVolume = 0;

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
      startButton.style.display = 'none';
      instructions.style.display = 'none';
      gameLoop(ctx);
    }).catch(function() {
      startButton.textContent = 'Mic access denied - tap to retry';
    });
  });
}

function onVolumeChange(volume) {
  currentVolume = volume;
}

function gameLoop(ctx) {
  state = tick(state, currentVolume);
  render(ctx, state, currentVolume);
  requestAnimationFrame(function() { gameLoop(ctx); });
}

function resizeCanvas(canvas) {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

document.addEventListener('DOMContentLoaded', setup);
