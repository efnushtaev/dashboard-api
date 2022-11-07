import { UserModel } from '@prisma/client'
import { TYPES } from './../types'
import { IUserService } from './users.service.interface'
import { UserLoginDto } from './dto/user-login.dto'
import { UserRegisterDto } from './dto/user-register.dto'
import { User } from './user.entity'
import { inject, injectable } from 'inversify'
import { IConfigService } from '../config/config.service.interface'
import { IUsersRepository } from './users.repositpry.interface'

@injectable()
export class UserService implements IUserService {
  constructor(
    @inject(TYPES.ConfigService) private configService: IConfigService,
    @inject(TYPES.UsersRepository) private usersRepository: IUsersRepository,
  ) {}
  async createUser({ email, name, password }: UserRegisterDto): Promise<UserModel | null> {
    const newUser = new User(email, name)
    const salt = this.configService.get('SALT')
    await newUser.setPassword(password, Number(salt))
    const exisedUsers = await this.usersRepository.find(email)
    if (!exisedUsers) {
      return this.usersRepository.create(newUser)
    }

    return null
  }
  async validateUser({ password, email }: UserLoginDto): Promise<boolean> {
    const exisedUsers = await this.usersRepository.find(email)
    if (!exisedUsers) {
      return false
    }
    const newUser = new User(exisedUsers.email, exisedUsers?.name, exisedUsers?.password)

    return newUser.comparePassword(password)
  }
}
