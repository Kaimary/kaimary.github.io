import AppKit
import CoreImage
import CoreImage.CIFilterBuiltins
import Vision
import Foundation

let projectRoot = URL(fileURLWithPath: FileManager.default.currentDirectoryPath)
let outputURL = projectRoot.appendingPathComponent("assets/img/homepage-qr.png")
let avatarURL = projectRoot.appendingPathComponent("assets/img/homepage-qr-center.jpg")
let siteURL = "https://kaimary.github.io/"

let scale: CGFloat = 20
let logoSize: CGFloat = 110
let logoBorder: CGFloat = 8
let qrBlue = NSColor(
  calibratedRed: 24.0 / 255.0,
  green: 61.0 / 255.0,
  blue: 149.0 / 255.0,
  alpha: 1
)

let ciContext = CIContext()
let qrFilter = CIFilter.qrCodeGenerator()
qrFilter.setValue(Data(siteURL.utf8), forKey: "inputMessage")
qrFilter.correctionLevel = "H"

guard let qrImage = qrFilter.outputImage else {
  fatalError("Failed to generate QR")
}

let falseColor = CIFilter(name: "CIFalseColor")!
falseColor.setValue(qrImage, forKey: kCIInputImageKey)
falseColor.setValue(CIColor(cgColor: qrBlue.cgColor), forKey: "inputColor0")
falseColor.setValue(CIColor(cgColor: NSColor.white.cgColor), forKey: "inputColor1")

guard let coloredQR = falseColor.outputImage else {
  fatalError("Failed to recolor QR")
}

let scaledQR = coloredQR.transformed(by: CGAffineTransform(scaleX: scale, y: scale))
guard let qrCG = ciContext.createCGImage(scaledQR, from: scaledQR.extent) else {
  fatalError("Failed to rasterize QR")
}

let qrBitmap = NSBitmapImageRep(cgImage: qrCG)
let canvasSize = NSSize(width: scaledQR.extent.width, height: scaledQR.extent.height)
let canvas = NSImage(size: canvasSize)

guard let avatar = NSImage(contentsOf: avatarURL) else {
  fatalError("Failed to load avatar")
}

canvas.lockFocus()

NSColor.white.setFill()
NSBezierPath(rect: NSRect(origin: .zero, size: canvasSize)).fill()

NSGraphicsContext.current?.cgContext.interpolationQuality = .none
qrBitmap.draw(in: NSRect(origin: .zero, size: canvasSize))

let center = CGPoint(x: canvasSize.width / 2, y: canvasSize.height / 2)
let outerRect = CGRect(
  x: center.x - logoSize / 2 - logoBorder,
  y: center.y - logoSize / 2 - logoBorder,
  width: logoSize + logoBorder * 2,
  height: logoSize + logoBorder * 2
)
let innerRect = CGRect(
  x: center.x - logoSize / 2,
  y: center.y - logoSize / 2,
  width: logoSize,
  height: logoSize
)

NSColor.white.setFill()
NSBezierPath(ovalIn: outerRect).fill()

let clip = NSBezierPath(ovalIn: innerRect)
clip.addClip()
avatar.draw(in: innerRect)

canvas.unlockFocus()

guard
  let tiff = canvas.tiffRepresentation,
  let rep = NSBitmapImageRep(data: tiff),
  let pngData = rep.representation(using: .png, properties: [:])
else {
  fatalError("Failed to encode PNG")
}

try pngData.write(to: outputURL)

let verifyImage = NSImage(contentsOf: outputURL)!
var verifyRect = CGRect(origin: .zero, size: verifyImage.size)
let verifyCG = verifyImage.cgImage(forProposedRect: &verifyRect, context: nil, hints: nil)!
let request = VNDetectBarcodesRequest()
let handler = VNImageRequestHandler(cgImage: verifyCG)
try handler.perform([request])

if let results = request.results, !results.isEmpty {
  for result in results {
    print(result.symbology.rawValue, result.payloadStringValue ?? "nil")
  }
} else {
  print("no-result")
}

print("Generated assets/img/homepage-qr.png")
