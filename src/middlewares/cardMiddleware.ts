import { NextFunction, Request, Response } from "express";
import AppError from "../config/error.js";

export function apiKeyHeaderValidation( req: Request, _res: Response, next: NextFunction ) {
  const apiKey = req.header("x-api-key");

  if( !apiKey ) {
    throw new AppError(
      "Invalid api key",
      422,
      "Invalid api key",
      "Make sure you provide a valid key"
    )
  }

  next();
}