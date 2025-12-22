import { ROUTES } from "@/constants";
import { Router } from "express";
import {
  getProductBrands,
  getProductBySlug,
  getProductCategories,
  getProducts,
  getProductSizes,
} from "./product.controller";
import { validate } from "@/middleware/validateHandler.middleware";
import { productPaginationAndFilterSchema } from "./product.schema";

const productRouter = Router();

productRouter.get(
  ROUTES.PRODUCT,
  validate({ query: productPaginationAndFilterSchema }),
  getProducts
);
productRouter.get(ROUTES.PRODUCT_BY_SLUG, getProductBySlug);
productRouter.get(ROUTES.CATEGORY, getProductCategories);
productRouter.get(ROUTES.BRAND, getProductBrands);
productRouter.get(ROUTES.SIZE, getProductSizes);

export default productRouter;
