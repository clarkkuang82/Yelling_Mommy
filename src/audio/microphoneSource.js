if (typeof require !== 'undefined' && typeof module !== 'undefined') {
  var { calculateVolume } = require('./volumeAnalyser');
}

const BUFFER_SIZE = 256;
const SMOOTHING = 0.8;

async function startMicrophone(onVolumeChange) {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const source = audioContext.createMediaStreamSource(stream);
  const analyser = audioContext.createAnalyser();

  analyser.fftSize = BUFFER_SIZE * 2;
  analyser.smoothingTimeConstant = SMOOTHING;
  source.connect(analyser);

  const frequencyData = new Uint8Array(analyser.frequencyBinCount);
  let animationFrameId = null;

  function readVolume() {
    analyser.getByteFrequencyData(frequencyData);
    const volume = calculateVolume(frequencyData);
    onVolumeChange(volume);
    animationFrameId = requestAnimationFrame(readVolume);
  }

  readVolume();

  return function stop() {
    cancelAnimationFrame(animationFrameId);
    source.disconnect();
    stream.getTracks().forEach(track => track.stop());
    audioContext.close();
  };
}

if (typeof module !== 'undefined') module.exports = { startMicrophone };
