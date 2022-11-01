import { TYPES } from './types'
import { Server } from 'http'
import express, { Express } from 'express'

import { ILogger } from './logger/logger.interface'
import { inject, injectable } from 'inversify'
import bodyParser from 'body-parser'
import 'reflect-metadata'
import { IExeptionFilter } from './errors/exeption.filter.interface'
import { IConfigService } from './config/config.service.interface'
import { UserController } from './users/users.controller'
import { PrismaService } from './database/prisma.service'

@injectable()
export class App {
  app: Express
  port: number
  server: Server

  constructor(
    @inject(TYPES.ILogger) private logger: ILogger,
    @inject(TYPES.UserController) private userController: UserController,
    @inject(TYPES.ExeptionFilter) private exeptionFilter: IExeptionFilter,
    @inject(TYPES.ConfigService) private configService: IConfigService,
    @inject(TYPES.PrismaService) private prismaServie: PrismaService,
  ) {
    this.app = express()
    this.port = 8001
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
    this.prismaServie.connect()
    this.server = this.app.listen(this.port)
    this.logger.log(`Сервер запущен на http://localhost:${this.port}`)
  }
}
