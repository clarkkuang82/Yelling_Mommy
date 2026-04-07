const MAX_BYTE_VALUE = 255;
const MAX_VOLUME = 100;

function calculateVolume(frequencyData) {
  if (frequencyData.length === 0) {
    return 0;
  }

  let sumOfSquares = 0;
  for (let i = 0; i < frequencyData.length; i++) {
    const normalized = frequencyData[i] / MAX_BYTE_VALUE;
    sumOfSquares += normalized * normalized;
  }

  const rms = Math.sqrt(sumOfSquares / frequencyData.length);
  const volume = Math.round(rms * MAX_VOLUME);

  return Math.min(MAX_VOLUME, Math.max(0, volume));
}

module.exports = { calculateVolume };
