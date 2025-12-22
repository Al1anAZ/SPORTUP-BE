import { RequestHandler } from "express";
import { productService } from "./product.service";
import { createError } from "@/utils/createError";
import { resolveSelectedVariant } from "@/utils/product-variant-resolver";
import { productPaginationAndFilterInput } from "./product.schema";
import { ValidatedRequest } from "@/types/validation.middleware";

export const getProducts: RequestHandler = async (
  req: ValidatedRequest<undefined, productPaginationAndFilterInput>,
  res,
  next
) => {
  try {
    const products = await productService.productsWithFiltersAndPagination(
      req.validatedQuery
    );
    res.json(products);
  } catch (error) {
    next(error);
  }
};

export const getProductBySlug: RequestHandler = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const { variantId } = req.query;

    if (!slug) {
      throw createError("RequiredParam", "Slug is required");
    }

    const product = await productService.productSlug(slug);

    const selectedVariant = resolveSelectedVariant(
      product.variants,
      Number(variantId)
    );

    res.json({
      ...product,
      selectedVariant,
    });
  } catch (error) {
    next(error);
  }
};

export const getProductCategories: RequestHandler = async (_, res, next) => {
  try {
    const categories = await productService.productCategories();
    res.json(categories);
  } catch (error) {
    next(error);
  }
};

export const getProductBrands: RequestHandler = async (_, res, next) => {
  try {
    const brands = await productService.productBrands();
    res.json(brands);
  } catch (error) {
    next(error);
  }
};

export const getProductSizes: RequestHandler = async (_, res, next) => {
  try {
    const sizes = await productService.productSizes();
    res.json(sizes);
  } catch (error) {
    next(error);
  }
};
