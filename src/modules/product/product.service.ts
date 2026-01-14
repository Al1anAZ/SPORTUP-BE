import { productFilteringOptionsDTO } from "./product.schema";
import { toProductFilterOptions } from "@/utils/toProductFilterOptions";
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

    return toProductFilterOptions(categories, {
      name: (c) => c.name,
      slug: (c) => c.slug,
      count: (c) => c._count.products,
    });
  }

  static async getProductBrands() {
    const brands = await ProductRepository.productBrands();

    return toProductFilterOptions(brands, {
      name: (b) => b.name,
      slug: (b) => b.slug,
      count: (b) => b._count.products,
    });
  }

  static async getProductSizes() {
    const sizes = await ProductRepository.productSizes();

    return toProductFilterOptions(sizes, {
      name: (s) => s.value,
      count: (s) => s._count.variants,
    });
  }

  static async getProductColors() {
    const colors = await ProductRepository.productColors();

    return toProductFilterOptions(colors, {
      name: (c) => c.color,
      count: (c) => c._count.color,
    });
  }
  static async getProductTags() {
    const tags = await ProductRepository.productTags();

    return toProductFilterOptions(tags, {
      name: (t) => t.tag,
      count: (t) => t._count._all,
    });
  }
}
