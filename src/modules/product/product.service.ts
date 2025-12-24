import { prismaClient } from "@/lib/prisma";
import {
  productBySlugSelect,
  productWithPaginationAndFilter,
} from "@/utils/selectQuery";
import { Prisma } from "@prisma/client";
import { productPaginationAndFilterInput } from "./product.schema";
import { normalizeAggregation } from "@/utils/normalizeAgregation";

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

    const variantWhere: Prisma.ProductVariantWhereInput = {};

    if (size?.length) {
      variantWhere.size = { value: { in: size } };
    }

    if (color?.length) {
      variantWhere.color = { in: color };
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      variantWhere.price = {
        gte: minPrice ?? 0,
        lte: maxPrice ?? Number.MAX_VALUE,
      };
    }

    const where: Prisma.ProductWhereInput = {
      ...(categorySlug?.length && {
        category: { slug: { in: categorySlug } },
      }),
      ...(brandSlug?.length && {
        brand: { slug: { in: brandSlug } },
      }),
      ...(Object.keys(variantWhere).length && {
        variants: {
          some: {
            stock: { gt: 0 },
            ...variantWhere,
          },
        },
      }),
      ...(tag && { tag }),
    };

    const orderByMap: Record<
      productPaginationAndFilterInput["sortBy"],
      Prisma.ProductOrderByWithRelationInput
    > = {
      createdAt: { createdAt: sortOrder },
      name: { name: sortOrder },
      price: { minPrice: sortOrder },
      priceMax: { maxPrice: sortOrder },
    };

    return prismaClient.product.findMany({
      where,
      select: productWithPaginationAndFilter,
      orderBy: orderByMap[sortBy],
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
          select: {
            products: {
              where: {
                variants: {
                  some: {
                    stock: { gt: 0 },
                  },
                },
              },
            },
          },
        },
      },
    });

    return normalizeAggregation(categories, {
      name: (c) => c.name,
      slug: (c) => c.slug,
      count: (c) => c._count.products,
    });
  }

  static async productBrands() {
    const brands = await prismaClient.brand.findMany({
      select: {
        ...productBySlugSelect.brand.select,
        _count: {
          select: {
            products: {
              where: {
                variants: {
                  some: {
                    stock: { gt: 0 },
                  },
                },
              },
            },
          },
        },
      },
    });

    return normalizeAggregation(brands, {
      name: (b) => b.name,
      slug: (b) => b.slug,
      count: (b) => b._count.products,
    });
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

    return normalizeAggregation(sizes, {
      name: (s) => s.value,
      count: (s) => s._count.variants,
    });
  }

  static async productColors() {
    const colors = await prismaClient.productVariant.groupBy({
      by: ["color"],
      where: {
        stock: { gt: 0 },
      },
      _count: { color: true },
    });

    return normalizeAggregation(colors, {
      name: (c) => c.color,
      count: (c) => c._count.color,
    });
  }
  static async productTags() {
    const tags = await prismaClient.product.groupBy({
      by: ["tag"],
      where: {
        variants: {
          some: {
            stock: { gt: 0 },
          },
        },
      },
      _count: {
        _all: true,
      },
    });

    return normalizeAggregation(tags, {
      name: (t) => t.tag,
      count: (t) => t._count._all
    })
  }
}
