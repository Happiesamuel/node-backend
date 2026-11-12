import { NextFunction, Request, Response } from "express";
import { z, ZodType } from "zod";
import { ApiError } from "../../utils/ApiError";

type Schemas = {
  body?: ZodType;
  query?: ZodType;
  params?: ZodType;
};

export const validate =
  (schemas: Schemas) => (req: Request, res: Response, next: NextFunction) => {
    const errors: Record<string, unknown> = {};
    const keys = ["body", "query", "params"] as const;
    for (const key of keys) {
      const schema = schemas[key];

      if (!schema) continue;

      const result = schema.safeParse(req[key]);

      if (!result.success) {
        errors[key] = z.flattenError(result.error).fieldErrors;
        continue;
      }
      if (key === "query") {
        Object.defineProperty(req, "query", {
          value: result.data,
          writable: true,
        });
      } else {
        (req as any)[key] = result.data;
      }
    }
    if (Object.keys(errors).length > 0) {
      const message = Object.entries(errors)
        .map(([section, fields]) =>
          Object.entries(fields as Record<string, string[]>)
            .map(([field, msgs]) => `${field}: ${msgs.join(", ")}`)
            .join("; "),
        )
        .join("; ");

      return next(new ApiError(400, `${message}`));
    }
    next();
  };
