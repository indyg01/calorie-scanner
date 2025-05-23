"use client";

import { useState } from "react";
import BarcodeScanner from "@/components/BarcodeScanner";

export default function Home() {
  const [barcode, setBarcode] = useState<string | null>(null);

  type Product = {
  product_name: string;
  brands: string;
  image_front_url: string;
  nutriments: {
    energy_kcal_100g: number;
    fat_100g: number;
    carbohydrates_100g: number;
    proteins_100g: number;
  };
};

const [product, setProduct] = useState<Product | null>(null);  const [error, setError] = useState<string | null>(null);

  const fetchProductData = async (code: string) => {
    try {
      const res = await fetch(`https://world.openfoodfacts.org/api/v0/product/${code}.json`);
      const data = await res.json();

      if (data.status === 1) {
        setProduct(data.product);
        setError(null);
      } else {
        setError("Product not found.");
        setProduct(null);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch product.");
      setProduct(null);
    }
  };

  const handleDetected = (code: string) => {
    setBarcode(code);
    fetchProductData(code);
  };

  return (
  <div className="min-h-screen p-4 bg-gray-100">
    <h1 className="text-2xl font-bold mb-4">Calorie Scanner App</h1>

    {!product && !error && <BarcodeScanner onDetected={handleDetected} />}

    {barcode && (
      <p className="mt-4 text-gray-700">🔍 Scanned Barcode: {barcode}</p>
    )}

    {product && (
      <div className="mt-6 bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-2">{product.product_name}</h2>
        ...
      </div>
    )}

    {error && <p className="mt-6 text-red-600">{error}</p>}
  </div>
);
}