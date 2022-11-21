import { ConfigService } from './../config/config.service'
import { ValidateMiddleware } from './../common/validate.middleware'
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
import { sign } from 'jsonwebtoken'
import { IConfigService } from '../config/config.service.interface'
import { AuthGuard } from '../common/auth.guard'

@injectable()
export class UserController extends BaseController implements IUserController {
  constructor(
    @inject(TYPES.ILogger) private loggerService: ILogger,
    @inject(TYPES.UserService) private userService: IUserService,
    @inject(TYPES.ConfigService) private configService: IConfigService,
  ) {
    super(loggerService)
    this.bindRoutes([
      {
        path: '/register',
        method: 'post',
        func: this.register,
        middlewares: [new ValidateMiddleware(UserRegisterDto)],
      },
      {
        path: '/login',
        method: 'post',
        func: this.login,
        middlewares: [new ValidateMiddleware(UserLoginDto)],
      },
      {
        path: '/info',
        method: 'get',
        func: this.info,
        middlewares: [new AuthGuard()],
      },
    ])
  }

  private signJWT(email: string, secret: string) {
    return new Promise<string>((resolve, reject) => {
      sign(
        {
          email,
          iat: Math.floor(Date.now() / 1000),
        },
        secret,
        {
          algorithm: 'HS256',
        },
        (err, token) => {
          if (err) {
            reject(err)
          } else {
            resolve(token || '')
          }
        },
      )
    })
  }

  async login({ body }: Request<{}, {}, UserLoginDto>, res: Response, next: NextFunction) {
    const result = await this.userService.validateUser(body)
    if (!result) {
      return next(new HTTPError(401, 'Ошибка авторизации', 'login'))
    }

    const jwt = await this.signJWT(body.email, this.configService.get('SECRET'))
    return this.ok(res, { jwt })
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

  async info({ user }: Request, res: Response, next: NextFunction): Promise<void> {
    const userInfo = await this.userService.getUserInfo(user)
    this.ok(res, { email: userInfo?.email, id: userInfo?.id })
  }
}
