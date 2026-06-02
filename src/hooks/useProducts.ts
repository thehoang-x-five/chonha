import { useEffect, useState, useCallback } from "react";
import { productService } from "@/services/productService";
import type { Product } from "@/types/product.types";

export function useProductsByStall(stallId: string | undefined) {
  const [data, setData] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const refetch = useCallback(() => {
    if (!stallId) { setLoading(false); return; }
    setLoading(true);
    productService.getProductsByStall(stallId).then(setData).finally(() => setLoading(false));
  }, [stallId]);
  useEffect(refetch, [refetch]);
  return { data, loading, refetch };
}

export function useProduct(productId: string | undefined) {
  const [data, setData] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!productId) { setLoading(false); return; }
    setLoading(true);
    productService.getProductById(productId).then(setData).finally(() => setLoading(false));
  }, [productId]);
  return { data, loading };
}
