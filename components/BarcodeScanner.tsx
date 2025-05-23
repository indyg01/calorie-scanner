"use client";

import React, { useEffect, useRef } from "react";
import Quagga from "@ericblade/quagga2";

const BarcodeScanner = ({ onDetected }: { onDetected: (code: string) => void }) => {
  const scannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isActive = true;

    if (scannerRef.current) {
      setTimeout(() => {
        if (!isActive) return;

        Quagga.init(
          {
            inputStream: {
              type: "LiveStream",
              target: scannerRef.current as Element,
              constraints: {
                facingMode: "environment",
              },
            },
            decoder: {
              readers: ["ean_reader", "upc_reader"],
            },
          },
          (err) => {
            if (err) {
              console.error("Quagga init error:", err);
              return;
            }
            Quagga.start();
          }
        );

        Quagga.onDetected((data) => {
  const code = data.codeResult.code;

  if (!code) return; // ✅ Skip if code is null or undefined

  Quagga.stop();
  Quagga.offDetected();

  onDetected(code); // ✅ TypeScript now knows this is a string
});

    return () => {
  isActive = false;
  Quagga.stop();
  Quagga.offDetected(); // ✅ no arguments
};

  return (
    <div
      ref={scannerRef}
      className="w-full h-96 bg-gray-300 rounded-lg flex items-center justify-center"
    >
      <p className="text-gray-600">📷 Point your camera at a barcode</p>
    </div>
  );
};

export default BarcodeScanner;