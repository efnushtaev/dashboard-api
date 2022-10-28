import { IUserService } from './users.service.interface'
import { UserLoginDto } from './dto/user-login.dto'
import { UserRegisterDto } from './dto/user-register.dto'
import { User } from './user.entity'
import { injectable } from 'inversify'

@injectable()
export class UserService implements IUserService {
  async createUser({ email, name, password }: UserRegisterDto): Promise<User | null> {
    const newUser = new User(email, name)
    await newUser.setPassword(password)
    return null
  }
  validateUser(dto: UserLoginDto): boolean {
    return true
  }
}
