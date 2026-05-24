import AppKit
import Vision
import Foundation

let projectRoot = URL(fileURLWithPath: FileManager.default.currentDirectoryPath)
let imageURL = projectRoot.appendingPathComponent("assets/img/wechat.png")

guard let image = NSImage(contentsOf: imageURL) else {
  fatalError("Failed to load wechat image")
}

var rect = CGRect(origin: .zero, size: image.size)
guard let cgImage = image.cgImage(forProposedRect: &rect, context: nil, hints: nil) else {
  fatalError("Failed to rasterize wechat image")
}

let request = VNDetectBarcodesRequest()
let handler = VNImageRequestHandler(cgImage: cgImage)
try handler.perform([request])

if let results = request.results, !results.isEmpty {
  for result in results {
    print(result.symbology.rawValue, result.payloadStringValue ?? "nil")
  }
} else {
  print("no-result")
}
