const fs = require("fs");
const path = require("path");
const jpeg = require("jpeg-js");
const { PNG } = require("pngjs");
const QRCode = require("qrcode");

const projectRoot = path.resolve(__dirname, "..");
const siteUrl = "https://kaimary.github.io/";
const avatarPath = path.join(projectRoot, "assets", "img", "homepage-qr-center.jpg");
const outputPath = path.join(projectRoot, "assets", "img", "homepage-qr.png");

const qrColor = { r: 45, g: 108, b: 223, a: 255 };
const backgroundColor = { r: 255, g: 255, b: 255, a: 255 };
const moduleSize = 24;
const quietZone = 4;
const logoSize = 220;

function createCanvas(size) {
  const png = new PNG({ width: size, height: size });
  fillRect(png, 0, 0, size, size, backgroundColor);
  return png;
}

function setPixel(png, x, y, color) {
  if (x < 0 || y < 0 || x >= png.width || y >= png.height) {
    return;
  }

  const idx = (png.width * y + x) << 2;
  png.data[idx] = color.r;
  png.data[idx + 1] = color.g;
  png.data[idx + 2] = color.b;
  png.data[idx + 3] = color.a;
}

function fillRect(png, x, y, width, height, color) {
  for (let py = y; py < y + height; py += 1) {
    for (let px = x; px < x + width; px += 1) {
      setPixel(png, px, py, color);
    }
  }
}

function fillCircle(png, cx, cy, radius, color) {
  const r2 = radius * radius;
  const minX = Math.floor(cx - radius);
  const maxX = Math.ceil(cx + radius);
  const minY = Math.floor(cy - radius);
  const maxY = Math.ceil(cy + radius);

  for (let y = minY; y <= maxY; y += 1) {
    for (let x = minX; x <= maxX; x += 1) {
      const dx = x - cx;
      const dy = y - cy;
      if (dx * dx + dy * dy <= r2) {
        setPixel(png, x, y, color);
      }
    }
  }
}

function fillRoundedRect(png, x, y, width, height, radius, color) {
  const innerLeft = x + radius;
  const innerRight = x + width - radius;
  const innerTop = y + radius;
  const innerBottom = y + height - radius;

  fillRect(png, innerLeft, y, innerRight - innerLeft, height, color);
  fillRect(png, x, innerTop, width, innerBottom - innerTop, color);
  fillCircle(png, x + radius, y + radius, radius, color);
  fillCircle(png, x + width - radius, y + radius, radius, color);
  fillCircle(png, x + radius, y + height - radius, radius, color);
  fillCircle(png, x + width - radius, y + height - radius, radius, color);
}

function isInRange(index, start, end, size) {
  const from = start < 0 ? size + start : start;
  const to = end < 0 ? size + end : end;
  return index >= from && index <= to;
}

function isFinderModule(row, col, size) {
  const ranges = [
    { rowStart: 0, rowEnd: 6, colStart: 0, colEnd: 6 },
    { rowStart: 0, rowEnd: 6, colStart: -7, colEnd: -1 },
    { rowStart: -7, rowEnd: -1, colStart: 0, colEnd: 6 },
  ];

  return ranges.some(
    (range) =>
      isInRange(row, range.rowStart, range.rowEnd, size) &&
      isInRange(col, range.colStart, range.colEnd, size),
  );
}

function drawFinderPattern(png, x, y) {
  fillRoundedRect(png, x, y, 7 * moduleSize, 7 * moduleSize, 24, qrColor);
  fillRoundedRect(
    png,
    x + moduleSize,
    y + moduleSize,
    5 * moduleSize,
    5 * moduleSize,
    18,
    backgroundColor,
  );
  fillRoundedRect(
    png,
    x + 2 * moduleSize,
    y + 2 * moduleSize,
    3 * moduleSize,
    3 * moduleSize,
    14,
    qrColor,
  );
}

function loadAvatar() {
  const jpegData = jpeg.decode(fs.readFileSync(avatarPath), { useTArray: true });
  if (!jpegData || !jpegData.data) {
    throw new Error("Failed to decode avatar JPEG");
  }
  return jpegData;
}

function drawAvatar(png, centerX, centerY, size) {
  const avatar = loadAvatar();
  const radius = size / 2;
  const r2 = radius * radius;
  const left = Math.round(centerX - radius);
  const top = Math.round(centerY - radius);

  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const dx = x + 0.5 - radius;
      const dy = y + 0.5 - radius;
      if (dx * dx + dy * dy > r2) {
        continue;
      }

      const srcX = Math.min(
        avatar.width - 1,
        Math.max(0, Math.floor((x / size) * avatar.width)),
      );
      const srcY = Math.min(
        avatar.height - 1,
        Math.max(0, Math.floor((y / size) * avatar.height)),
      );
      const srcIdx = (avatar.width * srcY + srcX) << 2;
      setPixel(png, left + x, top + y, {
        r: avatar.data[srcIdx],
        g: avatar.data[srcIdx + 1],
        b: avatar.data[srcIdx + 2],
        a: 255,
      });
    }
  }
}

function main() {
  const qr = QRCode.create(siteUrl, { errorCorrectionLevel: "H", margin: 0 });
  const moduleCount = qr.modules.size;
  const padding = quietZone * moduleSize;
  const size = moduleCount * moduleSize + padding * 2;
  const centerX = size / 2;
  const centerY = size / 2;
  const exclusionRadius = logoSize / 2 + moduleSize * 0.35;
  const png = createCanvas(size);

  for (let row = 0; row < moduleCount; row += 1) {
    for (let col = 0; col < moduleCount; col += 1) {
      if (!qr.modules.get(row, col) || isFinderModule(row, col, moduleCount)) {
        continue;
      }

      const x = padding + col * moduleSize;
      const y = padding + row * moduleSize;
      const dx = x + moduleSize / 2 - centerX;
      const dy = y + moduleSize / 2 - centerY;
      if (dx * dx + dy * dy <= exclusionRadius * exclusionRadius) {
        continue;
      }

      fillCircle(
        png,
        x + moduleSize / 2,
        y + moduleSize / 2,
        moduleSize * 0.205,
        qrColor,
      );
    }
  }

  drawFinderPattern(png, padding, padding);
  drawFinderPattern(png, padding + (moduleCount - 7) * moduleSize, padding);
  drawFinderPattern(png, padding, padding + (moduleCount - 7) * moduleSize);
  drawAvatar(png, centerX, centerY, logoSize);

  fs.writeFileSync(outputPath, PNG.sync.write(png));
  console.log(`Generated ${path.relative(projectRoot, outputPath)}`);
}

main();
