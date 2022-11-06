import { IUsersRepository } from './users/users.repositpry.interface'
import { IExeptionFilter } from './errors/exeption.filter.interface'
import { TYPES } from './types'
import { Container, ContainerModule, interfaces } from 'inversify'
import { App } from './app'
import { ExeptionFilter } from './errors/exeption.filter'
import { LoggerService } from './logger/loggerService'
import { UserController } from './users/users.controller'
import { ILogger } from './logger/logger.interface'
import { IUserController } from './users/users.interface'
import { IUserService } from './users/users.service.interface'
import { UserService } from './users/users.service'
import { IConfigService } from './config/config.service.interface'
import { ConfigService } from './config/config.service'
import { PrismaService } from './database/prisma.service'
import { UsersRepository } from './users/users.repository'

export interface IBootstrapReturn {
  appContainer: Container
  app: App
}

export const appBindings = new ContainerModule((bind: interfaces.Bind) => {
  bind<ILogger>(TYPES.ILogger).to(LoggerService).inSingletonScope()
  bind<IExeptionFilter>(TYPES.ExeptionFilter).to(ExeptionFilter).inSingletonScope()
  bind<IUserController>(TYPES.UserController).to(UserController).inSingletonScope()
  bind<IUserService>(TYPES.UserService).to(UserService).inSingletonScope()
  bind<PrismaService>(TYPES.PrismaService).to(PrismaService).inSingletonScope()
  bind<IConfigService>(TYPES.ConfigService).to(ConfigService).inSingletonScope()
  bind<IUsersRepository>(TYPES.UsersRepository).to(UsersRepository).inSingletonScope()
  bind<App>(TYPES.Application).to(App)
})

function bootstrap(): IBootstrapReturn {
  const appContainer = new Container()
  appContainer.load(appBindings)
  const app = appContainer.get<App>(TYPES.Application)
  app.init()

  return {
    app,
    appContainer,
  }
}

export const { app, appContainer } = bootstrap()
