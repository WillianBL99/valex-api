import { NextFunction, Request, Response } from "express";
import AppError from "../config/error.js";
import * as companyRepository from "../repositories/companyRepository.js";

export async function apiKeyHeaderValidation( req: Request, res: Response, next: NextFunction ) {
  const apiKey = req.header("x-api-key");

  if( !apiKey ) {
    throw new AppError(
      "Api key not sent",
      422,
      "Api key not sent",
      "Make sure you provide a valid api key"
    )
  }

  const company = await companyRepository.findByApiKey( apiKey );
  if( !company ) {
    throw new AppError(
      "Api key not found",
      404,
      "Api key not found",
      "Make sure you provide a valid api key"
    )
  }

  res.locals.companyData = { companyId: company.id };

  next();
}