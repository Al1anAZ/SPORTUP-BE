import { Schemas, ValidatedRequest } from "@/types/validation.middleware";
import { RequestHandler } from "express";

export const validate =
  <TBody = any, TQuery = any, TParams = any>(
    schemas: Schemas<TBody, TQuery, TParams>
  ): RequestHandler =>
  (req, _, next) => {
    try {
      const validateReq = req as ValidatedRequest<TBody, TQuery, TParams>;

      if (schemas.body) {
        validateReq.validatedBody = schemas.body.parse(req.body);
      }

      if (schemas.query) {
        validateReq.validatedQuery = schemas.query.parse(req.query);
      }

      if (schemas.params) {
        validateReq.validatedParams = schemas.params.parse(req.params);
      }

      next();
    } catch (error) {
      next(error);
    }
  };
