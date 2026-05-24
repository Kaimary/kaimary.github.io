const fs = require("fs");
const path = require("path");
const QRCode = require("qrcode");

const projectRoot = path.resolve(__dirname, "..");
const siteUrl = "https://kaimary.github.io/";
const outputPath = path.join(projectRoot, "assets", "img", "homepage-qr.svg");
const avatarPath = path.join(projectRoot, "assets", "img", "homepage-qr-center.jpg");

const qrColor = "#2d6cdf";
const backgroundColor = "#ffffff";
const moduleSize = 10;
const quietZone = 4;
const logoSize = 92;
const canvasPadding = quietZone * moduleSize;
const finderRanges = [
  { rowStart: 0, rowEnd: 6, colStart: 0, colEnd: 6 },
  { rowStart: 0, rowEnd: 6, colStart: -7, colEnd: -1 },
  { rowStart: -7, rowEnd: -1, colStart: 0, colEnd: 6 },
];

function isInRange(index, start, end, size) {
  const from = start < 0 ? size + start : start;
  const to = end < 0 ? size + end : end;
  return index >= from && index <= to;
}

function isFinderModule(row, col, size) {
  return finderRanges.some(
    (range) =>
      isInRange(row, range.rowStart, range.rowEnd, size) &&
      isInRange(col, range.colStart, range.colEnd, size),
  );
}

function isFinderCore(row, col, size) {
  const cores = [
    { rowStart: 2, rowEnd: 4, colStart: 2, colEnd: 4 },
    { rowStart: 2, rowEnd: 4, colStart: -5, colEnd: -3 },
    { rowStart: -5, rowEnd: -3, colStart: 2, colEnd: 4 },
  ];

  return cores.some(
    (range) =>
      isInRange(row, range.rowStart, range.rowEnd, size) &&
      isInRange(col, range.colStart, range.colEnd, size),
  );
}

function buildRoundedRect(x, y, width, height, radius, fill) {
  return `<rect x="${x}" y="${y}" width="${width}" height="${height}" rx="${radius}" ry="${radius}" fill="${fill}"/>`;
}

function buildCircle(cx, cy, radius, fill) {
  return `<circle cx="${cx}" cy="${cy}" r="${radius}" fill="${fill}"/>`;
}

function buildFinderPattern(x, y) {
  return [
    buildRoundedRect(x, y, 7 * moduleSize, 7 * moduleSize, 16, qrColor),
    buildRoundedRect(
      x + moduleSize,
      y + moduleSize,
      5 * moduleSize,
      5 * moduleSize,
      12,
      backgroundColor,
    ),
    buildRoundedRect(
      x + 2 * moduleSize,
      y + 2 * moduleSize,
      3 * moduleSize,
      3 * moduleSize,
      9,
      qrColor,
    ),
  ].join("");
}

function buildEmbeddedAvatar() {
  const avatarBytes = fs.readFileSync(avatarPath);
  return `data:image/jpeg;base64,${avatarBytes.toString("base64")}`;
}

function buildSvg(qr) {
  const moduleCount = qr.modules.size;
  const size = moduleCount * moduleSize + canvasPadding * 2;
  const avatarOffset = (size - logoSize) / 2;
  const avatarHref = buildEmbeddedAvatar();
  const avatarCenter = size / 2;
  const avatarRadius = logoSize / 2;
  const exclusionRadius = avatarRadius + moduleSize * 0.35;
  const dots = [];

  for (let row = 0; row < moduleCount; row += 1) {
    for (let col = 0; col < moduleCount; col += 1) {
      if (!qr.modules.get(row, col)) {
        continue;
      }

      if (isFinderModule(row, col, moduleCount)) {
        continue;
      }

      const x = canvasPadding + col * moduleSize;
      const y = canvasPadding + row * moduleSize;
      const dx = x + moduleSize / 2 - avatarCenter;
      const dy = y + moduleSize / 2 - avatarCenter;
      if (dx * dx + dy * dy <= exclusionRadius * exclusionRadius) {
        continue;
      }

      if (isFinderCore(row, col, moduleCount)) {
        continue;
      }

      dots.push(buildCircle(x + moduleSize / 2, y + moduleSize / 2, 2.05, qrColor));
    }
  }

  const topLeftFinder = buildFinderPattern(canvasPadding, canvasPadding);
  const topRightFinder = buildFinderPattern(
    canvasPadding + (moduleCount - 7) * moduleSize,
    canvasPadding,
  );
  const bottomLeftFinder = buildFinderPattern(
    canvasPadding,
    canvasPadding + (moduleCount - 7) * moduleSize,
  );

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" role="img" aria-labelledby="homepageQrTitle homepageQrDesc">
  <title id="homepageQrTitle">Homepage QR code for Yuankai Fan</title>
  <desc id="homepageQrDesc">A stylized QR code pointing to ${siteUrl}</desc>
  <defs>
    <clipPath id="avatarClip">
      <circle cx="${size / 2}" cy="${size / 2}" r="${logoSize / 2}"/>
    </clipPath>
  </defs>
  <rect width="${size}" height="${size}" fill="${backgroundColor}"/>
  ${dots.join("")}
  ${topLeftFinder}
  ${topRightFinder}
  ${bottomLeftFinder}
  <image href="${avatarHref}" x="${avatarOffset}" y="${avatarOffset}" width="${logoSize}" height="${logoSize}" preserveAspectRatio="xMidYMid slice" clip-path="url(#avatarClip)"/>
</svg>`;
}

function main() {
  const qr = QRCode.create(siteUrl, { errorCorrectionLevel: "H", margin: 0 });
  const svg = buildSvg(qr);
  fs.writeFileSync(outputPath, svg);
  console.log(`Generated ${path.relative(projectRoot, outputPath)}`);
}

main();
