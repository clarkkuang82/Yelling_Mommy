const COLORS = {
  wall: '#FFF8E7',
  wallAngry: '#FFD0D0',
  floor: '#D4A574',
  window: '#87CEEB',
  windowFrame: '#8B7355',
  kidSkin: '#FFD699',
  kidHair: '#4A3728',
  kidShirt: '#FF6B6B',
  kidPants: '#4A90D9',
  kidShirtAlt: '#6BCB77',
  kidPantsAlt: '#9B59B6',
  volumeBar: '#FF4444',
  volumeBackground: '#333333',
  scoreText: '#FFFFFF',
  scoreShadow: '#000000',
};

function render(ctx, state, volumeLevel) {
  const width = ctx.canvas.width;
  const height = ctx.canvas.height;

  drawBackground(ctx, width, height, volumeLevel);
  drawKids(ctx, state.kids, width, height);
  drawVolumeBar(ctx, volumeLevel, width, height);
  drawScore(ctx, state.score, state.streak, width);
}

function drawBackground(ctx, width, height, volumeLevel) {
  const angryAmount = Math.min(volumeLevel / 100, 1);
  const wallR = lerp(255, 255, angryAmount);
  const wallG = lerp(248, 208, angryAmount);
  const wallB = lerp(231, 208, angryAmount);

  ctx.fillStyle = `rgb(${wallR}, ${wallG}, ${wallB})`;
  ctx.fillRect(0, 0, width, height * 0.7);

  ctx.fillStyle = COLORS.floor;
  ctx.fillRect(0, height * 0.7, width, height * 0.3);

  const windowX = width * 0.1;
  const windowY = height * 0.1;
  const windowW = width * 0.2;
  const windowH = height * 0.25;

  ctx.fillStyle = COLORS.windowFrame;
  ctx.fillRect(windowX - 4, windowY - 4, windowW + 8, windowH + 8);
  ctx.fillStyle = COLORS.window;
  ctx.fillRect(windowX, windowY, windowW, windowH);

  ctx.strokeStyle = COLORS.windowFrame;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(windowX + windowW / 2, windowY);
  ctx.lineTo(windowX + windowW / 2, windowY + windowH);
  ctx.moveTo(windowX, windowY + windowH / 2);
  ctx.lineTo(windowX + windowW, windowY + windowH / 2);
  ctx.stroke();
}

function drawKids(ctx, kids, width, height) {
  const count = kids.length;
  const spacing = width / (count + 1);

  kids.forEach((kid, index) => {
    const centerX = spacing * (index + 1);
    const groundY = height * 0.7;
    const shirtColor = index % 2 === 0 ? COLORS.kidShirt : COLORS.kidShirtAlt;
    const pantsColor = index % 2 === 0 ? COLORS.kidPants : COLORS.kidPantsAlt;
    drawKid(ctx, centerX, groundY, kid, shirtColor, pantsColor);
  });
}

function drawKid(ctx, centerX, groundY, kid, shirtColor, pantsColor) {
  const isKneeling = kid.state === 'kneeling';
  const amount = kid.kneelingAmount;

  const fullHeight = 120;
  const kneelHeight = 60;
  const bodyHeight = lerp(fullHeight, kneelHeight, amount);

  const headRadius = 18;
  const headY = groundY - bodyHeight - headRadius;
  const bodyTop = groundY - bodyHeight;
  const bodyMid = groundY - bodyHeight * 0.4;

  ctx.fillStyle = shirtColor;
  ctx.fillRect(centerX - 15, bodyTop, 30, bodyMid - bodyTop);

  ctx.fillStyle = pantsColor;
  ctx.fillRect(centerX - 15, bodyMid, 30, groundY - bodyMid);

  ctx.fillStyle = COLORS.kidSkin;
  ctx.beginPath();
  ctx.arc(centerX, headY, headRadius, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = COLORS.kidHair;
  ctx.beginPath();
  ctx.arc(centerX, headY - 5, headRadius, Math.PI, Math.PI * 2);
  ctx.fill();

  drawFace(ctx, centerX, headY, isKneeling);
  drawArms(ctx, centerX, bodyTop, bodyMid, amount);
  drawLegs(ctx, centerX, groundY, bodyMid, amount);
}

function drawFace(ctx, centerX, headY, isKneeling) {
  ctx.fillStyle = '#333';
  ctx.beginPath();
  ctx.arc(centerX - 6, headY - 2, 2.5, 0, Math.PI * 2);
  ctx.arc(centerX + 6, headY - 2, 2.5, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = '#333';
  ctx.lineWidth = 2;
  ctx.beginPath();
  if (isKneeling) {
    ctx.arc(centerX, headY + 8, 5, 0, Math.PI, true);
  } else {
    ctx.arc(centerX, headY + 4, 5, 0, Math.PI, false);
  }
  ctx.stroke();
}

function drawArms(ctx, centerX, bodyTop, bodyMid, kneelingAmount) {
  const armLength = 25;
  ctx.strokeStyle = COLORS.kidSkin;
  ctx.lineWidth = 5;
  ctx.lineCap = 'round';

  const armY = bodyTop + 10;
  const upAngle = -Math.PI * 0.7;
  const downAngle = Math.PI * 0.3;
  const angle = lerp(upAngle, downAngle, kneelingAmount);

  ctx.beginPath();
  ctx.moveTo(centerX - 15, armY);
  ctx.lineTo(
    centerX - 15 + Math.cos(Math.PI + angle) * armLength,
    armY + Math.sin(Math.PI + angle) * armLength
  );
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(centerX + 15, armY);
  ctx.lineTo(
    centerX + 15 + Math.cos(-angle) * armLength,
    armY + Math.sin(-angle) * armLength
  );
  ctx.stroke();
}

function drawLegs(ctx, centerX, groundY, bodyMid, kneelingAmount) {
  ctx.strokeStyle = COLORS.kidSkin;
  ctx.lineWidth = 5;
  ctx.lineCap = 'round';

  const legTop = bodyMid + 5;
  const legSpread = lerp(12, 5, kneelingAmount);

  ctx.beginPath();
  ctx.moveTo(centerX - 8, legTop);
  ctx.lineTo(centerX - legSpread, groundY);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(centerX + 8, legTop);
  ctx.lineTo(centerX + legSpread, groundY);
  ctx.stroke();
}

function drawVolumeBar(ctx, volumeLevel, width, height) {
  const barWidth = 20;
  const barHeight = height * 0.5;
  const barX = width - barWidth - 15;
  const barY = height * 0.15;

  ctx.fillStyle = COLORS.volumeBackground;
  ctx.fillRect(barX, barY, barWidth, barHeight);

  const fillHeight = (volumeLevel / 100) * barHeight;
  ctx.fillStyle = COLORS.volumeBar;
  ctx.fillRect(barX, barY + barHeight - fillHeight, barWidth, fillHeight);

  ctx.strokeStyle = '#555';
  ctx.lineWidth = 2;
  ctx.strokeRect(barX, barY, barWidth, barHeight);

  ctx.fillStyle = COLORS.scoreText;
  ctx.font = 'bold 11px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('VOL', barX + barWidth / 2, barY - 5);
}

function drawScore(ctx, score, streak, width) {
  ctx.fillStyle = COLORS.scoreShadow;
  ctx.font = 'bold 28px Arial';
  ctx.textAlign = 'center';
  ctx.fillText(`Score: ${score}`, width / 2 + 2, 37);

  ctx.fillStyle = COLORS.scoreText;
  ctx.fillText(`Score: ${score}`, width / 2, 35);

  if (streak >= 3) {
    ctx.fillStyle = '#FFD700';
    ctx.font = 'bold 16px Arial';
    ctx.fillText(`Streak x${streak}!`, width / 2, 58);
  }
}

function lerp(start, end, amount) {
  return start + (end - start) * amount;
}

if (typeof module !== 'undefined') module.exports = { render };
