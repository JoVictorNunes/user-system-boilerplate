import { Injectable } from '@nestjs/common';
import { v4 as id } from 'uuid';
import { RegisterDTO } from 'users/dto/register.dto';
import { User } from 'users/entities/user.entity';

@Injectable()
export class UsersService {
  private readonly database: Array<User> = [];

  async createUser(data: RegisterDTO) {
    const { email, password } = data;
    const user = {
      id: id(),
      email,
      password,
    };

    this.database.push(user);
    return user;
  }

  async getAllUsers() {
    return this.database;
  }

  async findByEmail(email: string) {
    return this.database.find((user) => user.email === email);
  }

  async findByEmailAndPassword(email: string, password: string) {
    return this.database.find(
      (user) => user.email === email && user.password === password,
    );
  }
}
