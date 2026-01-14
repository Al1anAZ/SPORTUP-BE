import { productFilteringOptionsDTO } from "./product.schema";
import { normalizeAggregation } from "@/utils/normalizeAgregation";
import { ProductRepository } from "./product.repository";

export class ProductService {
  static async getProductsWithFiltersAndPagination(
    options: productFilteringOptionsDTO
  ) {
    const products = await ProductRepository.findAll(options);
    return products;
  }

  static async getProductBySlug(slug: string) {
    const product = await ProductRepository.bySlug(slug);

    return product;
  }

  static async getProductCategories() {
    const categories = await ProductRepository.productCategories();

    return normalizeAggregation(categories, {
      name: (c) => c.name,
      slug: (c) => c.slug,
      count: (c) => c._count.products,
    });
  }

  static async getProductBrands() {
    const brands = await ProductRepository.productBrands();

    return normalizeAggregation(brands, {
      name: (b) => b.name,
      slug: (b) => b.slug,
      count: (b) => b._count.products,
    });
  }

  static async getProductSizes() {
    const sizes = await ProductRepository.productSizes();

    return normalizeAggregation(sizes, {
      name: (s) => s.value,
      count: (s) => s._count.variants,
    });
  }

  static async getProductColors() {
    const colors = await ProductRepository.productColors();

    return normalizeAggregation(colors, {
      name: (c) => c.color,
      count: (c) => c._count.color,
    });
  }
  static async getProductTags() {
    const tags = await ProductRepository.productTags();

    return normalizeAggregation(tags, {
      name: (t) => t.tag,
      count: (t) => t._count._all,
    });
  }
}
