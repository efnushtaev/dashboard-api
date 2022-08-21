import { HTTPError } from './../errors/http-error.class';
import { BaseController } from "../common/baseController";
import { NextFunction, Response, Request } from "express";
import { ILogger } from '../logger/logger.interface';

export class UserController extends BaseController {
  constructor(logger: ILogger) {
    super(logger);
    this.bindRoutes([
      { path: "/register", method: "post", func: this.register },
      { path: "/login", method: "post", func: this.login },
    ]);
  }

  login(req: Request, res: Response, next: NextFunction) {
    // this.ok(res, "login");
    next (new HTTPError(401, 'Ошибка авторизации', 'login'))
  }

  register(req: Request, res: Response, next: NextFunction) {
    this.ok(res, "login");
  }
}
