import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    /**
     * Bizim bir varlığımız vardı ve bu bir depoydu aynı zamanda. İşte şimdi o
     * depoyu servise aktaralım ve üzerinde tanımlı olan işlemleri kullanalım.
     */
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) { }

  create(user: CreateUserDto) {
    return this.userRepository.save(user);
  }

  findAll() {
    return this.userRepository.find();
  }

  findOne(id: number) {
    return this.userRepository.findOne(id);
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    await this.userRepository.update(id, updateUserDto);
  }

  async remove(id: number) {
    await this.userRepository.delete(id);
  }
}
