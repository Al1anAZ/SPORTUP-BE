import z from "zod";
import { Request } from "express";

export interface ValidatedRequest<TBody = any, TQuery = any, TParams = any>
  extends Request {
  validatedBody?: TBody;
  validatedQuery?: TQuery;
  validatedParams?: TParams;
}

export type Schemas<TBody, TQuery, TParams> = {
  body?: z.ZodType<TBody>;
  query?: z.ZodType<TQuery>;
  params?: z.ZodType<TParams>;
};
