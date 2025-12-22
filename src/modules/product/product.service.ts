import { prismaClient } from "@/lib/prisma";
import {
  productBySlugSelect,
  productWithPaginationAndFilter,
} from "@/utils/select-query";
import { Prisma } from "@prisma/client";
import { productPaginationAndFilterInput } from "./product.schema";

export class productService {
  static async productsWithFiltersAndPagination(
    options: productPaginationAndFilterInput
  ) {
    const {
      page = 1,
      limit = 20,
      sortBy = "createdAt",
      sortOrder = "desc",
      categorySlug,
      brandSlug,
      size,
      color,
      tag,
      minPrice,
      maxPrice,
    } = options;

    const variantFilter: Prisma.ProductVariantWhereInput = {
      stock: { gt: 0 },
      ...(size?.length ? { size: { value: { in: size } } } : {}),
      ...(color?.length ? { color: { in: color } } : {}),
      ...(minPrice !== undefined || maxPrice !== undefined
        ? { price: { gte: minPrice ?? 0, lte: maxPrice ?? Number.MAX_VALUE } }
        : {}),
    };

    const where: Prisma.ProductWhereInput = {
      ...(categorySlug?.length
        ? { category: { slug: { in: categorySlug } } }
        : {}),
      ...(brandSlug?.length ? { brand: { slug: { in: brandSlug } } } : {}),
      ...(Object.keys(variantFilter).length
        ? { variants: { some: variantFilter } }
        : {}),
      ...(tag ? { tag: tag } : {}),
    };

    return prismaClient.product.findMany({
      where,
      select: productWithPaginationAndFilter,
      orderBy: { [sortBy]: sortOrder },
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  static async productSlug(slug: string) {
    const product = await prismaClient.product.findUniqueOrThrow({
      where: { slug },
      select: productBySlugSelect,
    });

    return product;
  }

  static async productCategories() {
    const categories = await prismaClient.category.findMany({
      select: {
        ...productBySlugSelect.category.select,
        _count: {
          select: { products: true },
        },
      },
    });

    return categories.map((c) => ({
      name: c.name,
      slug: c.slug,
      count: c._count,
    }));
  }

  static async productBrands() {
    const brands = await prismaClient.brand.findMany({
      select: {
        ...productBySlugSelect.brand.select,
        _count: {
          select: { products: true },
        },
      },
    });

    return brands.map((b) => ({
      name: b.name,
      slug: b.slug,
      count: b._count,
    }));
  }

  static async productSizes() {
    const sizes = await prismaClient.size.findMany({
      select: {
        ...productBySlugSelect.variants.select.size.select,
        _count: {
          select: {
            variants: {
              where: {
                stock: { gt: 0 },
              },
            },
          },
        },
      },
    });

    return sizes.map((s) => ({
      name: s.value,
      count: s._count,
    }));
  }

  static async productColors() {
    const colors = await prismaClient.productVariant.groupBy({
      by: ["color"],
      _count: { color: true },
    });

    return colors.map((c) => ({
      name: c.color,
      count: c._count.color,
    }));
  }
}
