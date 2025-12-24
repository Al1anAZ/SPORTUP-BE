import { ProductVariantDTO } from "@/types/product";

export const resolveSelectedVariant = (
  variants: ProductVariantDTO[],
  variantId?: number
) => {
  if (variantId) {
    const found = variants.find((v) => v.id === variantId);
    if (found) return found;
  }

  return variants.find((v) => v.stock > 0) || variants[0] || null;
};
