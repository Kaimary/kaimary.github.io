import AppKit
import CoreImage
import Foundation

let projectRoot = URL(fileURLWithPath: FileManager.default.currentDirectoryPath)
let inputURL = projectRoot.appendingPathComponent("assets/img/wechat.jpg")
let outputURL = projectRoot.appendingPathComponent("assets/img/wechat.png")

let blueRed: UInt8 = 24
let blueGreen: UInt8 = 61
let blueBlue: UInt8 = 149

let qrLeft = 145
let qrTop = 310
let qrRight = 745
let qrBottom = 946
let darkThreshold = 90
let lightPreserveThreshold = 235

guard let image = NSImage(contentsOf: inputURL) else {
  fatalError("Failed to load wechat image")
}

guard
  let tiff = image.tiffRepresentation,
  let bitmap = NSBitmapImageRep(data: tiff)
else {
  fatalError("Failed to decode wechat image")
}

let width = bitmap.pixelsWide
let height = bitmap.pixelsHigh

guard
  let data = bitmap.bitmapData,
  bitmap.bitsPerPixel >= 24,
  bitmap.bytesPerRow > 0
else {
  fatalError("Unsupported bitmap format")
}

for y in 0..<height {
  for x in 0..<width {
    guard x >= qrLeft, x <= qrRight, y >= qrTop, y <= qrBottom else {
      continue
    }

    let row = y * bitmap.bytesPerRow
    let offset = row + x * (bitmap.bitsPerPixel / 8)
    let r = data[offset]
    let g = data[offset + 1]
    let b = data[offset + 2]

    if r >= lightPreserveThreshold && g >= lightPreserveThreshold && b >= lightPreserveThreshold {
      continue
    }

    data[offset] = blueRed
    data[offset + 1] = blueGreen
    data[offset + 2] = blueBlue
  }
}

guard let pngData = bitmap.representation(using: .png, properties: [:]) else {
  fatalError("Failed to encode wechat image")
}

try pngData.write(to: outputURL)
print("Generated assets/img/wechat.png")
