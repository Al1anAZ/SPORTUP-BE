import { ROUTES } from "@/constants";
import { Router } from "express";
import {
  getProductBrands,
  getProductBySlug,
  getProductCategories,
  getProductColors,
  getProducts,
  getProductSizes,
  getProductTags,
} from "./product.controller";
import { validate } from "@/middleware/validateHandler.middleware";
import { productFilteringOptionsSchema } from "./product.schema";


const productRouter = Router();

productRouter.get(
  ROUTES.PRODUCT,
  validate({ query: productFilteringOptionsSchema }),
  getProducts
);
productRouter.get(ROUTES.PRODUCT_BY_SLUG, getProductBySlug);
productRouter.get(ROUTES.CATEGORY, getProductCategories);
productRouter.get(ROUTES.BRAND, getProductBrands);
productRouter.get(ROUTES.SIZE, getProductSizes);
productRouter.get(ROUTES.COLOR, getProductColors);
productRouter.get(ROUTES.TAG, getProductTags);

export default productRouter;
