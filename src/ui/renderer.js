var KID_STYLES = [
  { shirt: '#FF6B6B', pants: '#4A90D9', hair: '#4A3728', shirtDark: '#E05555', pantsDark: '#3A7BC8' },
  { shirt: '#6BCB77', pants: '#9B59B6', hair: '#2C1810', shirtDark: '#55B561', pantsDark: '#8544A0' },
  { shirt: '#FFB347', pants: '#45B7D1', hair: '#5C3A1E', shirtDark: '#E09D31', pantsDark: '#35A1BB' },
];

var frameCount = 0;

function render(ctx, state, volumeLevel) {
  frameCount++;
  var width = ctx.canvas.width;
  var height = ctx.canvas.height;

  ctx.save();
  drawBackground(ctx, width, height, volumeLevel);
  drawFurniture(ctx, width, height);
  drawScatteredToys(ctx, width, height, volumeLevel);
  drawKids(ctx, state.kids, width, height, volumeLevel);
  drawShockwave(ctx, width, height, volumeLevel);
  drawVolumeBar(ctx, volumeLevel, width, height);
  drawScore(ctx, state.score, state.streak, width, height);
  drawReactionLabel(ctx, state.kids, width, height);
  ctx.restore();
}

// --- BACKGROUND ---

function drawBackground(ctx, width, height, volumeLevel) {
  var angry = Math.min(volumeLevel / 100, 1);
  var groundY = height * 0.72;

  // Wall with gradient
  var wallGrad = ctx.createLinearGradient(0, 0, 0, groundY);
  wallGrad.addColorStop(0, lerpColor([255, 252, 245], [255, 200, 190], angry));
  wallGrad.addColorStop(1, lerpColor([245, 235, 220], [255, 180, 170], angry));
  ctx.fillStyle = wallGrad;
  ctx.fillRect(0, 0, width, groundY);

  // Baseboard
  ctx.fillStyle = lerpColor([160, 120, 80], [180, 100, 80], angry);
  ctx.fillRect(0, groundY - 8, width, 8);

  // Floor with wood grain
  var floorGrad = ctx.createLinearGradient(0, groundY, 0, height);
  floorGrad.addColorStop(0, '#C4956A');
  floorGrad.addColorStop(0.5, '#D4A574');
  floorGrad.addColorStop(1, '#B8895E');
  ctx.fillStyle = floorGrad;
  ctx.fillRect(0, groundY, width, height - groundY);

  // Wood plank lines
  ctx.strokeStyle = 'rgba(139, 100, 60, 0.3)';
  ctx.lineWidth = 1;
  for (var y = groundY + 20; y < height; y += 25) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  // Screen shake when loud
  if (volumeLevel > 70) {
    var shake = (volumeLevel - 70) / 30 * 3;
    ctx.translate(
      (Math.sin(frameCount * 0.5) * shake),
      (Math.cos(frameCount * 0.7) * shake * 0.5)
    );
  }
}

function drawFurniture(ctx, width, height) {
  var groundY = height * 0.72;

  // Window
  var winX = width * 0.08;
  var winY = height * 0.08;
  var winW = width * 0.18;
  var winH = height * 0.22;

  // Window shadow
  ctx.fillStyle = 'rgba(0,0,0,0.05)';
  roundRect(ctx, winX + 3, winY + 3, winW, winH, 4);
  ctx.fill();

  // Window frame
  ctx.fillStyle = '#F5F0E8';
  roundRect(ctx, winX - 6, winY - 6, winW + 12, winH + 12, 6);
  ctx.fill();
  ctx.strokeStyle = '#B8A88A';
  ctx.lineWidth = 2;
  roundRect(ctx, winX - 6, winY - 6, winW + 12, winH + 12, 6);
  ctx.stroke();

  // Sky
  var skyGrad = ctx.createLinearGradient(winX, winY, winX, winY + winH);
  skyGrad.addColorStop(0, '#87CEEB');
  skyGrad.addColorStop(1, '#B8E4F9');
  ctx.fillStyle = skyGrad;
  ctx.fillRect(winX, winY, winW, winH);

  // Clouds
  ctx.fillStyle = 'rgba(255,255,255,0.8)';
  var cloudX = winX + winW * 0.3 + Math.sin(frameCount * 0.01) * 5;
  drawCloud(ctx, cloudX, winY + winH * 0.3, 12);

  // Window dividers
  ctx.strokeStyle = '#D5C9B5';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(winX + winW / 2, winY);
  ctx.lineTo(winX + winW / 2, winY + winH);
  ctx.moveTo(winX, winY + winH / 2);
  ctx.lineTo(winX + winW, winY + winH / 2);
  ctx.stroke();

  // Picture frame on wall
  var picX = width * 0.75;
  var picY = height * 0.1;
  var picW = width * 0.12;
  var picH = height * 0.12;
  ctx.fillStyle = '#8B7355';
  roundRect(ctx, picX - 4, picY - 4, picW + 8, picH + 8, 3);
  ctx.fill();
  ctx.fillStyle = '#FFF8DC';
  ctx.fillRect(picX, picY, picW, picH);
  // Heart in frame
  ctx.fillStyle = '#FF6B6B';
  ctx.font = (picH * 0.5) + 'px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('♥', picX + picW / 2, picY + picH * 0.7);

  // Couch (background)
  var couchX = width * 0.65;
  var couchY = groundY - 55;
  ctx.fillStyle = '#7B68AE';
  roundRect(ctx, couchX, couchY, width * 0.28, 55, 8);
  ctx.fill();
  ctx.fillStyle = '#8B78BE';
  roundRect(ctx, couchX, couchY, width * 0.28, 35, 8);
  ctx.fill();
  // Couch cushion line
  ctx.strokeStyle = '#6B58A0';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(couchX + width * 0.14, couchY + 5);
  ctx.lineTo(couchX + width * 0.14, couchY + 32);
  ctx.stroke();
  // Arm rests
  ctx.fillStyle = '#7B68AE';
  roundRect(ctx, couchX - 8, couchY - 15, 18, 70, 6);
  ctx.fill();
  roundRect(ctx, couchX + width * 0.28 - 10, couchY - 15, 18, 70, 6);
  ctx.fill();
}

function drawScatteredToys(ctx, width, height, volumeLevel) {
  var groundY = height * 0.72;
  var toyY = groundY + 15;
  var bounce = volumeLevel > 50 ? Math.sin(frameCount * 0.3) * 3 : 0;

  // Toy blocks
  ctx.fillStyle = '#FF9999';
  ctx.fillRect(width * 0.15, toyY + bounce, 12, 12);
  ctx.fillStyle = '#99CCFF';
  ctx.fillRect(width * 0.17, toyY - 5 + bounce * 0.7, 10, 10);

  // Ball
  ctx.fillStyle = '#FFDD44';
  ctx.beginPath();
  ctx.arc(width * 0.55, toyY + 6 + bounce * 0.5, 8, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#FFAA00';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(width * 0.55, toyY + 6 + bounce * 0.5, 8, 0.5, 2.5);
  ctx.stroke();

  // Teddy bear shape
  var bearX = width * 0.4;
  ctx.fillStyle = '#C8956A';
  ctx.beginPath();
  ctx.arc(bearX, toyY + 5, 7, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(bearX - 5, toyY - 2, 4, 0, Math.PI * 2);
  ctx.arc(bearX + 5, toyY - 2, 4, 0, Math.PI * 2);
  ctx.fill();
}

// --- KIDS ---

function drawKids(ctx, kids, width, height, volumeLevel) {
  var count = kids.length;
  var groundY = height * 0.72;
  var spacing = width * 0.6 / (count + 1);
  var startX = width * 0.2;

  for (var i = 0; i < kids.length; i++) {
    var centerX = startX + spacing * (i + 1);
    var style = KID_STYLES[i % KID_STYLES.length];
    drawKid(ctx, centerX, groundY, kids[i], style, i);
  }
}

function drawKid(ctx, centerX, groundY, kid, style, index) {
  var amount = kid.kneelingAmount;
  var state = kid.state;

  // Scale factor based on canvas size
  var scale = Math.min(groundY / 400, 1.2);

  var fullHeight = 130 * scale;
  var flatHeight = 30 * scale;
  var bodyHeight = lerp(fullHeight, flatHeight, amount);

  var headRadius = 20 * scale;
  var bodyWidth = 32 * scale;
  var headY = groundY - bodyHeight - headRadius;
  var bodyTop = groundY - bodyHeight;
  var bodyMid = groundY - bodyHeight * 0.45;

  // Trembling when scared
  var tremble = 0;
  if (amount > 0.5) {
    tremble = Math.sin(frameCount * 0.8 + index * 2) * amount * 2;
  }

  ctx.save();
  ctx.translate(tremble, 0);

  // Shadow on ground
  ctx.fillStyle = 'rgba(0,0,0,0.1)';
  ctx.beginPath();
  var shadowWidth = lerp(20, 35, amount) * scale;
  ctx.ellipse(centerX, groundY, shadowWidth, 5 * scale, 0, 0, Math.PI * 2);
  ctx.fill();

  // Legs
  drawLegs(ctx, centerX, groundY, bodyMid, amount, style, scale);

  // Body (torso)
  drawBody(ctx, centerX, bodyTop, bodyMid, groundY, bodyWidth, style, amount, scale);

  // Arms
  drawArms(ctx, centerX, bodyTop, bodyMid, amount, style, scale, state);

  // Head
  drawHead(ctx, centerX, headY, headRadius, style, amount, state, index);

  // Sweat drops when nervous+
  if (amount > 0.15) {
    drawSweatDrops(ctx, centerX, headY, headRadius, amount, index, scale);
  }

  // Exclamation / effects
  if (state === 'flattened') {
    drawDizzyStars(ctx, centerX, headY - headRadius, scale);
  }

  ctx.restore();
}

function drawBody(ctx, centerX, bodyTop, bodyMid, groundY, bodyWidth, style, amount, scale) {
  var halfW = bodyWidth / 2;

  // Shirt with slight round shape
  ctx.fillStyle = style.shirt;
  ctx.beginPath();
  ctx.moveTo(centerX - halfW, bodyTop + 3 * scale);
  ctx.quadraticCurveTo(centerX - halfW - 2 * scale, bodyMid, centerX - halfW + 2 * scale, bodyMid);
  ctx.lineTo(centerX + halfW - 2 * scale, bodyMid);
  ctx.quadraticCurveTo(centerX + halfW + 2 * scale, bodyMid, centerX + halfW, bodyTop + 3 * scale);
  ctx.quadraticCurveTo(centerX, bodyTop - 2 * scale, centerX - halfW, bodyTop + 3 * scale);
  ctx.fill();

  // Shirt collar
  ctx.fillStyle = style.shirtDark;
  ctx.beginPath();
  ctx.ellipse(centerX, bodyTop + 4 * scale, halfW * 0.5, 4 * scale, 0, 0, Math.PI);
  ctx.fill();

  // Pants
  ctx.fillStyle = style.pants;
  ctx.beginPath();
  roundRect(ctx, centerX - halfW, bodyMid, bodyWidth, groundY - bodyMid, 2);
  ctx.fill();

  // Belt
  ctx.fillStyle = '#5C4033';
  ctx.fillRect(centerX - halfW, bodyMid - 1, bodyWidth, 3 * scale);
}

function drawHead(ctx, centerX, headY, radius, style, amount, state, index) {
  // Head circle with slight outline
  ctx.fillStyle = '#FFD699';
  ctx.beginPath();
  ctx.arc(centerX, headY, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#E8C088';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Hair
  ctx.fillStyle = style.hair;
  ctx.beginPath();
  ctx.arc(centerX, headY - radius * 0.2, radius * 1.05, Math.PI * 1.1, Math.PI * 1.9);
  ctx.quadraticCurveTo(centerX + radius, headY - radius * 0.8, centerX + radius * 0.7, headY - radius * 0.1);
  ctx.quadraticCurveTo(centerX, headY - radius * 0.5, centerX - radius * 0.7, headY - radius * 0.1);
  ctx.fill();

  // Ears
  ctx.fillStyle = '#FFD699';
  ctx.beginPath();
  ctx.ellipse(centerX - radius * 0.95, headY, radius * 0.2, radius * 0.3, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(centerX + radius * 0.95, headY, radius * 0.2, radius * 0.3, 0, 0, Math.PI * 2);
  ctx.fill();

  // Cheeks (blush more when scared)
  var blush = Math.min(amount * 0.4, 0.35);
  ctx.fillStyle = 'rgba(255, 120, 120, ' + blush + ')';
  ctx.beginPath();
  ctx.ellipse(centerX - radius * 0.55, headY + radius * 0.25, radius * 0.25, radius * 0.15, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(centerX + radius * 0.55, headY + radius * 0.25, radius * 0.25, radius * 0.15, 0, 0, Math.PI * 2);
  ctx.fill();

  drawFace(ctx, centerX, headY, radius, amount, state, index);
}

function drawFace(ctx, centerX, headY, radius, amount, state, index) {
  var eyeSpacing = radius * 0.35;
  var eyeY = headY - radius * 0.05;
  var eyeSize = radius * 0.14;

  // Eyes change based on reaction
  if (state === 'flattened') {
    // X eyes when flattened
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    drawXEye(ctx, centerX - eyeSpacing, eyeY, eyeSize);
    drawXEye(ctx, centerX + eyeSpacing, eyeY, eyeSize);
  } else if (amount > 0.5) {
    // Wide scared eyes
    var wideAmount = lerp(1, 1.6, (amount - 0.5) * 2);
    ctx.fillStyle = '#FFF';
    ctx.beginPath();
    ctx.ellipse(centerX - eyeSpacing, eyeY, eyeSize * wideAmount, eyeSize * wideAmount * 1.3, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(centerX + eyeSpacing, eyeY, eyeSize * wideAmount, eyeSize * wideAmount * 1.3, 0, 0, Math.PI * 2);
    ctx.fill();
    // Pupils (small, looking up)
    ctx.fillStyle = '#333';
    ctx.beginPath();
    ctx.arc(centerX - eyeSpacing, eyeY - 2, eyeSize * 0.6, 0, Math.PI * 2);
    ctx.arc(centerX + eyeSpacing, eyeY - 2, eyeSize * 0.6, 0, Math.PI * 2);
    ctx.fill();
  } else if (amount > 0.15) {
    // Nervous eyes (slightly wide)
    ctx.fillStyle = '#FFF';
    ctx.beginPath();
    ctx.ellipse(centerX - eyeSpacing, eyeY, eyeSize * 1.1, eyeSize * 1.2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(centerX + eyeSpacing, eyeY, eyeSize * 1.1, eyeSize * 1.2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#333';
    ctx.beginPath();
    ctx.arc(centerX - eyeSpacing, eyeY, eyeSize * 0.6, 0, Math.PI * 2);
    ctx.arc(centerX + eyeSpacing, eyeY, eyeSize * 0.6, 0, Math.PI * 2);
    ctx.fill();
  } else {
    // Normal cheeky eyes
    ctx.fillStyle = '#333';
    ctx.beginPath();
    ctx.arc(centerX - eyeSpacing, eyeY, eyeSize, 0, Math.PI * 2);
    ctx.arc(centerX + eyeSpacing, eyeY, eyeSize, 0, Math.PI * 2);
    ctx.fill();
    // Eye shine
    ctx.fillStyle = '#FFF';
    ctx.beginPath();
    ctx.arc(centerX - eyeSpacing + 1, eyeY - 1, eyeSize * 0.35, 0, Math.PI * 2);
    ctx.arc(centerX + eyeSpacing + 1, eyeY - 1, eyeSize * 0.35, 0, Math.PI * 2);
    ctx.fill();
  }

  // Eyebrows
  ctx.strokeStyle = style_hair_for_index(index);
  ctx.lineWidth = 2;
  ctx.lineCap = 'round';
  var browY = eyeY - eyeSize * 2;
  var browLen = eyeSize * 1.5;
  if (amount > 0.5) {
    // Scared raised eyebrows
    drawBrow(ctx, centerX - eyeSpacing, browY - 3, browLen, -0.3);
    drawBrow(ctx, centerX + eyeSpacing, browY - 3, browLen, 0.3);
  } else if (amount > 0.15) {
    // Worried eyebrows
    drawBrow(ctx, centerX - eyeSpacing, browY - 1, browLen, -0.2);
    drawBrow(ctx, centerX + eyeSpacing, browY - 1, browLen, 0.2);
  } else {
    // Mischievous eyebrows
    drawBrow(ctx, centerX - eyeSpacing, browY, browLen, 0.15);
    drawBrow(ctx, centerX + eyeSpacing, browY, browLen, -0.15);
  }

  // Mouth
  var mouthY = headY + radius * 0.35;
  ctx.strokeStyle = '#333';
  ctx.lineWidth = 2;
  ctx.lineCap = 'round';
  ctx.beginPath();
  if (state === 'flattened') {
    // Wavy scared mouth
    ctx.moveTo(centerX - radius * 0.25, mouthY);
    ctx.quadraticCurveTo(centerX - radius * 0.12, mouthY + 3, centerX, mouthY);
    ctx.quadraticCurveTo(centerX + radius * 0.12, mouthY - 3, centerX + radius * 0.25, mouthY);
  } else if (amount > 0.5) {
    // Open mouth scream
    ctx.fillStyle = '#333';
    ctx.beginPath();
    ctx.ellipse(centerX, mouthY + 2, radius * 0.2, radius * 0.25 * amount, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#FF6B6B';
    ctx.beginPath();
    ctx.ellipse(centerX, mouthY + radius * 0.15, radius * 0.08, radius * 0.06, 0, 0, Math.PI * 2);
    ctx.fill();
    return;
  } else if (amount > 0.15) {
    // Small worried frown
    ctx.arc(centerX, mouthY + radius * 0.15, radius * 0.15, Math.PI * 1.2, Math.PI * 1.8);
  } else {
    // Cheeky grin
    ctx.arc(centerX, mouthY - radius * 0.05, radius * 0.2, 0.1, Math.PI - 0.1);
  }
  ctx.stroke();
}

function drawXEye(ctx, x, y, size) {
  ctx.beginPath();
  ctx.moveTo(x - size, y - size);
  ctx.lineTo(x + size, y + size);
  ctx.moveTo(x + size, y - size);
  ctx.lineTo(x - size, y + size);
  ctx.stroke();
}

function drawBrow(ctx, x, y, length, angle) {
  ctx.beginPath();
  ctx.moveTo(x - length / 2, y + angle * length);
  ctx.lineTo(x + length / 2, y - angle * length);
  ctx.stroke();
}

function style_hair_for_index(index) {
  return KID_STYLES[index % KID_STYLES.length].hair;
}

function drawArms(ctx, centerX, bodyTop, bodyMid, amount, style, scale, state) {
  var armLength = 28 * scale;
  ctx.strokeStyle = '#FFD699';
  ctx.lineWidth = 6 * scale;
  ctx.lineCap = 'round';

  var armY = bodyTop + 12 * scale;
  var halfW = 16 * scale;

  if (state === 'flattened') {
    // Arms spread out flat
    ctx.beginPath();
    ctx.moveTo(centerX - halfW, armY);
    ctx.lineTo(centerX - halfW - armLength * 1.2, armY + 5);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(centerX + halfW, armY);
    ctx.lineTo(centerX + halfW + armLength * 1.2, armY + 5);
    ctx.stroke();
  } else if (amount > 0.5) {
    // Arms up begging
    ctx.beginPath();
    ctx.moveTo(centerX - halfW, armY);
    var upAmount = (amount - 0.5) * 2;
    ctx.lineTo(
      centerX - halfW - armLength * 0.5,
      armY - armLength * lerp(0.3, 0.8, upAmount)
    );
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(centerX + halfW, armY);
    ctx.lineTo(
      centerX + halfW + armLength * 0.5,
      armY - armLength * lerp(0.3, 0.8, upAmount)
    );
    ctx.stroke();

    // Hands (open palms begging)
    ctx.fillStyle = '#FFD699';
    ctx.beginPath();
    ctx.arc(
      centerX - halfW - armLength * 0.5,
      armY - armLength * lerp(0.3, 0.8, upAmount),
      4 * scale, 0, Math.PI * 2
    );
    ctx.fill();
    ctx.beginPath();
    ctx.arc(
      centerX + halfW + armLength * 0.5,
      armY - armLength * lerp(0.3, 0.8, upAmount),
      4 * scale, 0, Math.PI * 2
    );
    ctx.fill();
  } else if (amount > 0.15) {
    // Arms slightly raised, nervous
    var wave = Math.sin(frameCount * 0.15) * 3 * amount;
    ctx.beginPath();
    ctx.moveTo(centerX - halfW, armY);
    ctx.lineTo(centerX - halfW - armLength * 0.7, armY + armLength * 0.2 + wave);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(centerX + halfW, armY);
    ctx.lineTo(centerX + halfW + armLength * 0.7, armY + armLength * 0.2 - wave);
    ctx.stroke();
  } else {
    // Standing: arms on hips (cheeky pose)
    ctx.beginPath();
    ctx.moveTo(centerX - halfW, armY);
    ctx.quadraticCurveTo(
      centerX - halfW - armLength * 0.6, armY + armLength * 0.3,
      centerX - halfW - 3, bodyMid - 2
    );
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(centerX + halfW, armY);
    ctx.quadraticCurveTo(
      centerX + halfW + armLength * 0.6, armY + armLength * 0.3,
      centerX + halfW + 3, bodyMid - 2
    );
    ctx.stroke();
  }
}

function drawLegs(ctx, centerX, groundY, bodyMid, amount, style, scale) {
  ctx.strokeStyle = '#FFD699';
  ctx.lineWidth = 7 * scale;
  ctx.lineCap = 'round';

  var legTop = bodyMid + 4 * scale;
  var halfW = 8 * scale;

  if (amount > 0.85) {
    // Flattened: legs folded under
    ctx.beginPath();
    ctx.moveTo(centerX - halfW, legTop);
    ctx.quadraticCurveTo(centerX - 15 * scale, groundY, centerX - 5 * scale, groundY);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(centerX + halfW, legTop);
    ctx.quadraticCurveTo(centerX + 15 * scale, groundY, centerX + 5 * scale, groundY);
    ctx.stroke();
  } else if (amount > 0.3) {
    // Kneeling: bent legs
    var kneel = (amount - 0.3) / 0.55;
    var kneeX = lerp(12, 8, kneel) * scale;
    ctx.beginPath();
    ctx.moveTo(centerX - halfW, legTop);
    ctx.quadraticCurveTo(centerX - kneeX * 1.5, legTop + (groundY - legTop) * 0.5, centerX - kneeX, groundY);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(centerX + halfW, legTop);
    ctx.quadraticCurveTo(centerX + kneeX * 1.5, legTop + (groundY - legTop) * 0.5, centerX + kneeX, groundY);
    ctx.stroke();
  } else {
    // Standing: straight legs
    var spread = lerp(14, 10, amount) * scale;
    ctx.beginPath();
    ctx.moveTo(centerX - halfW, legTop);
    ctx.lineTo(centerX - spread, groundY);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(centerX + halfW, legTop);
    ctx.lineTo(centerX + spread, groundY);
    ctx.stroke();
  }

  // Shoes
  ctx.fillStyle = '#333';
  if (amount < 0.85) {
    var shoeSpread = lerp(14, 8, amount) * scale;
    drawShoe(ctx, centerX - shoeSpread, groundY, scale, -1);
    drawShoe(ctx, centerX + shoeSpread, groundY, scale, 1);
  }
}

function drawShoe(ctx, x, y, scale, dir) {
  ctx.beginPath();
  ctx.ellipse(x + dir * 5 * scale, y, 8 * scale, 4 * scale, 0, 0, Math.PI * 2);
  ctx.fill();
}

// --- EFFECTS ---

function drawSweatDrops(ctx, centerX, headY, radius, amount, index, scale) {
  var dropCount = amount > 0.7 ? 3 : amount > 0.4 ? 2 : 1;
  ctx.fillStyle = 'rgba(100, 180, 255, 0.7)';

  for (var i = 0; i < dropCount; i++) {
    var dropPhase = (frameCount * 0.05 + index + i * 1.5) % 1;
    var dropX = centerX + radius * (i === 0 ? 0.8 : i === 1 ? -0.7 : 0.3);
    var dropY = headY - radius * 0.5 + dropPhase * radius * 2;
    var dropSize = (1 - dropPhase) * 4 * scale;

    ctx.beginPath();
    ctx.moveTo(dropX, dropY - dropSize);
    ctx.quadraticCurveTo(dropX + dropSize, dropY, dropX, dropY + dropSize);
    ctx.quadraticCurveTo(dropX - dropSize, dropY, dropX, dropY - dropSize);
    ctx.fill();
  }
}

function drawDizzyStars(ctx, centerX, topY, scale) {
  ctx.fillStyle = '#FFD700';
  ctx.font = (12 * scale) + 'px Arial';
  ctx.textAlign = 'center';
  for (var i = 0; i < 3; i++) {
    var angle = (frameCount * 0.05) + i * (Math.PI * 2 / 3);
    var starX = centerX + Math.cos(angle) * 18 * scale;
    var starY = topY - 5 + Math.sin(angle) * 8 * scale;
    ctx.fillText('★', starX, starY);
  }
}

function drawShockwave(ctx, width, height, volumeLevel) {
  if (volumeLevel < 80) return;

  var intensity = (volumeLevel - 80) / 20;
  var groundY = height * 0.72;
  var centerX = width / 2;

  ctx.strokeStyle = 'rgba(255, 100, 100, ' + (intensity * 0.3) + ')';
  ctx.lineWidth = 3;
  for (var i = 0; i < 3; i++) {
    var waveRadius = (frameCount * 3 + i * 30) % 150;
    var alpha = (1 - waveRadius / 150) * intensity * 0.3;
    ctx.strokeStyle = 'rgba(255, 100, 100, ' + alpha + ')';
    ctx.beginPath();
    ctx.arc(centerX, groundY * 0.5, waveRadius, 0, Math.PI * 2);
    ctx.stroke();
  }
}

// --- UI ---

function drawVolumeBar(ctx, volumeLevel, width, height) {
  var barWidth = 24;
  var barHeight = height * 0.45;
  var barX = width - barWidth - 18;
  var barY = height * 0.18;

  // Background
  ctx.fillStyle = 'rgba(30,30,30,0.7)';
  roundRect(ctx, barX - 3, barY - 3, barWidth + 6, barHeight + 6, 8);
  ctx.fill();

  // Empty bar
  ctx.fillStyle = '#444';
  roundRect(ctx, barX, barY, barWidth, barHeight, 5);
  ctx.fill();

  // Filled bar with gradient
  var fillHeight = (volumeLevel / 100) * barHeight;
  if (fillHeight > 0) {
    var grad = ctx.createLinearGradient(0, barY + barHeight - fillHeight, 0, barY + barHeight);
    grad.addColorStop(0, volumeLevel > 70 ? '#FF3333' : volumeLevel > 40 ? '#FFAA33' : '#33CC33');
    grad.addColorStop(1, volumeLevel > 70 ? '#CC0000' : volumeLevel > 40 ? '#CC7700' : '#228822');
    ctx.fillStyle = grad;
    roundRect(ctx, barX, barY + barHeight - fillHeight, barWidth, fillHeight, 5);
    ctx.fill();
  }

  // Label
  ctx.fillStyle = '#FFF';
  ctx.font = 'bold 10px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('VOL', barX + barWidth / 2, barY - 8);

  // Threshold line
  var threshY = barY + barHeight * 0.7;
  ctx.strokeStyle = 'rgba(255,255,255,0.5)';
  ctx.lineWidth = 1;
  ctx.setLineDash([3, 3]);
  ctx.beginPath();
  ctx.moveTo(barX - 5, threshY);
  ctx.lineTo(barX + barWidth + 5, threshY);
  ctx.stroke();
  ctx.setLineDash([]);
}

function drawScore(ctx, score, streak, width, height) {
  // Score panel background
  ctx.fillStyle = 'rgba(30,30,30,0.6)';
  roundRect(ctx, width / 2 - 80, 8, 160, streak >= 3 ? 52 : 36, 12);
  ctx.fill();

  ctx.fillStyle = '#FFF';
  ctx.font = 'bold 22px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('Score: ' + score, width / 2, 32);

  if (streak >= 3) {
    var pulse = 1 + Math.sin(frameCount * 0.15) * 0.1;
    ctx.fillStyle = '#FFD700';
    ctx.font = 'bold ' + Math.round(14 * pulse) + 'px Arial';
    ctx.fillText('STREAK x' + streak + '! 🔥', width / 2, 52);
  }
}

function drawReactionLabel(ctx, kids, width, height) {
  if (!kids.length || kids[0].state === 'idle' || kids[0].state === 'standing') return;

  var labels = {
    'nervous': '😰 Getting nervous...',
    'crouching': '😨 Crouching down!',
    'kneeling': '😱 KNEELING!',
    'flattened': '🙇 TOTALLY FLATTENED!'
  };

  var label = labels[kids[0].state];
  if (!label) return;

  var alpha = Math.min(kids[0].intensity * 2, 1);
  ctx.fillStyle = 'rgba(30,30,30,' + (alpha * 0.6) + ')';
  ctx.font = 'bold 18px Arial';
  ctx.textAlign = 'center';
  var textWidth = ctx.measureText(label).width;
  roundRect(ctx, width / 2 - textWidth / 2 - 12, height * 0.82, textWidth + 24, 32, 8);
  ctx.fill();

  ctx.fillStyle = 'rgba(255,255,255,' + alpha + ')';
  ctx.fillText(label, width / 2, height * 0.82 + 22);
}

// --- HELPERS ---

function drawCloud(ctx, x, y, size) {
  ctx.beginPath();
  ctx.arc(x, y, size, 0, Math.PI * 2);
  ctx.arc(x + size, y - size * 0.3, size * 0.8, 0, Math.PI * 2);
  ctx.arc(x - size * 0.8, y + size * 0.1, size * 0.7, 0, Math.PI * 2);
  ctx.fill();
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function lerp(start, end, amount) {
  return start + (end - start) * amount;
}

function lerpColor(rgb1, rgb2, amount) {
  var r = Math.round(lerp(rgb1[0], rgb2[0], amount));
  var g = Math.round(lerp(rgb1[1], rgb2[1], amount));
  var b = Math.round(lerp(rgb1[2], rgb2[2], amount));
  return 'rgb(' + r + ',' + g + ',' + b + ')';
}

if (typeof module !== 'undefined') module.exports = { render };
