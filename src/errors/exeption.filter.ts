import { ILogger } from './../logger/logger.interface';
import { IExeptionFilter } from "./exeption.filter.interface";
import { Request, Response, NextFunction } from "express";
import { HTTPError } from "./http-error.class";

export class ExeptionFilter implements IExeptionFilter {
  logger: ILogger;
  constructor(logger: ILogger) {
    this.logger = logger;
  }

  catch(
    err: Error | HTTPError,
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    if (err instanceof HTTPError) {
      this.logger.error(
        `[${err.context}] Ошибка ${err.statusCode}: ${err.message}`
      );
      res.status(err.statusCode).send({ err: err.message });
    } else {
      this.logger.error(`${err.message}`);
      res.status(500).send({ err: err.message });
    }
  }
}
