import { RequestHandler } from "express";
import { ProductService } from "./product.service";
import { createError } from "@/utils/createError";
import { findSelectedVariant } from "@/utils/findSelectedVariant";
import { productFilteringOptionsDTO } from "./product.schema";
import { ValidatedRequest } from "@/types/validation.middleware";

export const getProducts: RequestHandler = async (
  req: ValidatedRequest<undefined, productFilteringOptionsDTO>,
  res,
  next
) => {
  try {
    const products = await ProductService.getProductsWithFiltersAndPagination(
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

    const product = await ProductService.getProductBySlug(slug);

    const selectedVariant = findSelectedVariant(
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
    const categories = await ProductService.getProductCategories();
    res.json(categories);
  } catch (error) {
    next(error);
  }
};

export const getProductBrands: RequestHandler = async (_, res, next) => {
  try {
    const brands = await ProductService.getProductBrands();
    res.json(brands);
  } catch (error) {
    next(error);
  }
};

export const getProductSizes: RequestHandler = async (_, res, next) => {
  try {
    const sizes = await ProductService.getProductSizes();
    res.json(sizes);
  } catch (error) {
    next(error);
  }
};

export const getProductColors: RequestHandler = async (_, res, next) => {
  try {
    const colors = await ProductService.getProductColors();
    res.json(colors);
  } catch (error) {
    next(error);
  }
};

export const getProductTags: RequestHandler = async (_, res, next) => {
  try {
    const tags = await ProductService.getProductTags();
    res.json(tags);
  } catch (error) {
    next(error);
  }
};
