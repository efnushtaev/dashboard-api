import { ILogger } from './../logger/logger.interface'
import { Router, Response } from 'express'
import { IControllerRoute } from './route.interface'
import { injectable } from 'inversify'
import 'reflect-metadata'

@injectable()
export abstract class BaseController {
  private readonly _router: Router

  constructor(private logger: ILogger) {
    this._router = Router()
  }

  get router() {
    return this._router
  }

  public created(res: Response) {
    res.sendStatus(201)
  }

  public send<T>(res: Response, code: number, message: T): Response<any, Record<string, any>> {
    res.type('application/json')
    return res.status(code).json(message)
  }

  protected ok<T>(res: Response, message: T) {
    return this.send<T>(res, 200, message)
  }

  protected bindRoutes(routes: IControllerRoute[]) {
    for (const route of routes) {
      this.logger.log(`[${route.method}] ${route.path}`)
      const middleware = route.middlewares?.map((m) => m.execute.bind(m))
      const handler = route.func.bind(this)
      const pipeline = middleware ? [...middleware, handler] : handler
      this.router[route.method](route.path, pipeline)
    }
  }
}
