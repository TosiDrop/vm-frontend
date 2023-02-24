import { NextFunction, Request, Response } from "express";
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
    console.log(`Error at ${req.url}: ${errorMessage}\n${error.stack}`);
    statusCode = error.code;
  } else if (error instanceof Error) {
    errorMessage = error.message;
    console.log(`Error at ${req.url}: ${errorMessage}\n${error.stack}`);
  } else {
    errorMessage = JSON.stringify(error);
    console.log(`Error at ${req.url}: ${errorMessage}`);
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