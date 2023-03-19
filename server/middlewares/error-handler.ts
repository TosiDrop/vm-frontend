import { NextFunction, Request, Response } from "express";
import { Dto } from "../../client/src/entities/dto";
import { LoggerService } from "../service/logger";
import {
  createErrorResponse,
  ErrorWithCode,
  HttpStatusCode,
} from "../utils/error";

export default async function errorHandlerMiddleware(
  error: unknown,
  req: Request,
  res: Response,
  _next: NextFunction
) {
  let statusCode: HttpStatusCode = HttpStatusCode.INTERNAL_SERVER_ERROR;
  let errorMessage: string;
  if (error instanceof ErrorWithCode) {
    errorMessage = error.message;
    LoggerService.error(`Error at ${req.url}: ${errorMessage}\n${error.stack}`);
    statusCode = error.code;
  } else if (error instanceof Error) {
    errorMessage = error.message;
    LoggerService.error(`Error at ${req.url}: ${errorMessage}\n${error.stack}`);
  } else {
    errorMessage = JSON.stringify(error);
    LoggerService.error(`Error at ${req.url}: ${errorMessage}`);
  }
  return res.status(statusCode).send(createErrorResponse(errorMessage));
}

export const errorHandlerWrapper =
  (func: Function) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await func(req, res);
    } catch (error) {
      next(error);
    }
  };

export const typedErrorHandlerWrapper =
  <T extends Dto.Base>(
    func: (
      req: Request<{}, {}, T["body"], T["query"]>,
      res: Response<T["response"]>
    ) => {}
  ) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await func(req, res);
    } catch (error) {
      next(error);
    }
  };
