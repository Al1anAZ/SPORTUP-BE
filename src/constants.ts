export const enum ROUTES {
  USER = "/user",
  AVATAR = "/user/avatar",
  PRODUCT = "/product",
  PRODUCT_BY_SLUG = "/product/:slug",
  BRAND = "/product/brand",
  CATEGORY = "/product/category",
  SIZE = "/product/size",
  COLOR = "/product/color",
  TAG = "/product/tag",
  REGISTER = "/auth/register",
  LOGIN = "/auth/login",
  LOGOUT = "/auth/logout",
  REFRESH_TOKEN = "/auth/refresh-token",
}

export const ERROR_MAP: Record<string, { status: number; msg: string }> = {
  P2025: { status: 404, msg: "Not Found" },
  P2002: { status: 409, msg: "Duplicate record" },
  TokenExpiredError: { status: 401, msg: "Token expired" },
  JsonWebTokenError: { status: 401, msg: "Invalid token" },
  InvalidType: { status: 400, msg: "Invalid Type" },
  RequiredParam: { status: 400, msg: "Empty required param" },
};
