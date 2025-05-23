"use client";

import { useState } from "react";
import BarcodeScanner from "@/components/BarcodeScanner";

export default function Home() {
  const [barcode, setBarcode] = useState<string | null>(null);
  const [product, setProduct] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

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

      {product && (
        <div className="mt-6 bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">{product.product_name}</h2>
          <p className="mb-1">Brand: {product.brands}</p>
          <p className="mb-1">Calories per 100g: {product.nutriments?.energy_kcal_100g}</p>
          <p className="mb-1">Fat: {product.nutriments?.fat_100g}g</p>
          <p className="mb-1">Carbs: {product.nutriments?.carbohydrates_100g}g</p>
          <p className="mb-1">Protein: {product.nutriments?.proteins_100g}g</p>

          {product.image_front_url && (
            <img src={product.image_front_url} alt="Product" className="w-32 mt-4" />
          )}
        </div>
      )}

      {error && <p className="mt-6 text-red-600">{error}</p>}
    </div>
  );
}