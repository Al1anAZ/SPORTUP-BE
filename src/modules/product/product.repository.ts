import { prismaClient } from "@/lib/prisma";
import {
  productSelectDBQuery,
  productReducedSelectDBQuery,
} from "@/utils/selectDBQuery";
import { productFilteringOptionsDTO } from "./product.schema";
import { Prisma } from "@prisma/client";
import { PAGINATION_OPTIONS } from "@/constants";

export class ProductRepository {
  static async bySlug(slug: string) {
    return prismaClient.product.findUniqueOrThrow({
      where: { slug },
      select: productReducedSelectDBQuery,
    });
  }

  static async findAll(options?: productFilteringOptionsDTO) {
    const {
      page = PAGINATION_OPTIONS.BASE_PAGE,
      limit = PAGINATION_OPTIONS.BASE_LIMIT,
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
      productFilteringOptionsDTO["sortBy"],
      Prisma.ProductOrderByWithRelationInput
    > = {
      createdAt: { createdAt: sortOrder },
      price: { minPrice: sortOrder },
      priceMax: { maxPrice: sortOrder },
    };

    return prismaClient.product.findMany({
      where,
      select: productSelectDBQuery,
      orderBy: orderByMap[sortBy],
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  static async productCategories() {
    return prismaClient.category.findMany({
      select: {
        ...productReducedSelectDBQuery.category.select,
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
  }
  static async productBrands() {
    return prismaClient.brand.findMany({
      select: {
        ...productSelectDBQuery.brand.select,
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
  }
  static async productSizes() {
    return prismaClient.size.findMany({
      select: {
        ...productSelectDBQuery.variants.select.size.select,
        _count: {
          select: {
            variants: true,
          },
        },
      },
    });
  }
  static async productColors() {
    return prismaClient.productVariant.groupBy({
      by: ["color"],
      where: {
        stock: { gt: 0 },
      },
      _count: { color: true },
    });
  }
  static async productTags() {
    return prismaClient.product.groupBy({
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
  }
}
