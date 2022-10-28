import { TYPES } from './types'
import { Server } from 'http'
import express, { Express } from 'express'

import { UserController } from './users/users.controller'
import { ExeptionFilter } from './errors/exeption.filter'
import { ILogger } from './logger/logger.interface'
import { inject, injectable } from 'inversify'
import bodyParser from 'body-parser'
import 'reflect-metadata'

@injectable()
export class App {
  app: Express
  port: number
  server: Server

  constructor(
    @inject(TYPES.ILogger) private logger: ILogger,
    @inject(TYPES.UserController) private userController: UserController,
    @inject(TYPES.ExeptionFilter) private exeptionFilter: ExeptionFilter,
  ) {
    this.app = express()
    this.port = 8001
    this.logger = logger
    this.userController = userController
    this.exeptionFilter = exeptionFilter
  }

  private useMiddleware(): void {
    this.app.use(bodyParser.json())
  }

  private useRoutes(): void {
    this.app.use('/users', this.userController.router)
  }

  private useExeptionFilters(): void {
    this.app.use(this.exeptionFilter.catch.bind(this.exeptionFilter))
  }

  public async init(): Promise<void> {
    this.useMiddleware()
    this.useRoutes()
    this.useExeptionFilters()
    this.server = this.app.listen(this.port)
    this.logger.log(`Сервер запущен на http://localhost:${this.port}`)
  }
}
