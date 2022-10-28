import { IUserService } from './users.service.interface'
import { UserRegisterDto } from './dto/user-register.dto'
import { IUserController } from './users.interface'
import { TYPES } from './../types'
import { HTTPError } from './../errors/http-error.class'
import { BaseController } from '../common/baseController'
import { NextFunction, Response, Request } from 'express'
import { ILogger } from '../logger/logger.interface'
import { inject, injectable } from 'inversify'
import 'reflect-metadata'
import { UserLoginDto } from './dto/user-login.dto'
import { User } from './user.entity'

@injectable()
export class UserController extends BaseController implements IUserController {
  constructor(
    @inject(TYPES.ILogger) private loggerService: ILogger,
    @inject(TYPES.UserService) private userService: IUserService,
  ) {
    super(loggerService)
    this.bindRoutes([
      { path: '/register', method: 'post', func: this.register },
      { path: '/login', method: 'post', func: this.login },
    ])
  }

  login({ body }: Request<{}, {}, UserLoginDto>, res: Response, next: NextFunction) {
    console.log(body)
    next(new HTTPError(401, 'Ошибка авторизации', 'login'))
  }

  async register(
    { body }: Request<{}, {}, UserRegisterDto>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const result = await this.userService.createUser(body)
    if (!result) {
      return next(new HTTPError(422, 'Такой пользователь уже существует'))
    }
    this.ok(res, { email: result.email })
  }
}
