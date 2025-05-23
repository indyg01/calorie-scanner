"use client";

import React, { useEffect, useRef } from "react";
import Quagga from "@ericblade/quagga2";

const BarcodeScanner = ({ onDetected }: { onDetected: (code: string) => void }) => {
  const scannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isActive = true;

    const startScanner = () => {
      if (!scannerRef.current) return;

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
        if (!code) return;

        Quagga.stop();
        Quagga.offDetected();

        onDetected(code);
      });
    };

    setTimeout(() => {
      if (isActive) startScanner();
    }, 300);

    return () => {
      isActive = false;
      Quagga.stop();
      Quagga.offDetected();
    };
  }, [onDetected]);

  return (
    <div
  ref={scannerRef}
  id="scanner"
  className="w-full max-w-md h-96 mx-auto bg-gray-300 rounded-lg flex items-center justify-center relative overflow-hidden"
>
  <p className="text-gray-600 absolute z-10">📷 Point your camera at a barcode</p>
</div>
  );
};

export default BarcodeScanner;