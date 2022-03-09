//* Kaynakların içe aktarımı.
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

/**
 * Bir sınıfı, gelen istekleri alabilen ve yanıtlar üretebilen bir Nest denetleyicisi olarak işaretleyen dekoratör.
 * @param string Endpoint noktası.
 */
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  //* /user POST endpoint işareti.
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  //* /user GET endpoint işareti.
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  //* /user/:id GET endpoint işareti. "id" parametre olarak gelir.
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  //* /user/:id PATCH endpoint işareti. "id" parametre olarak gelir.
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  //* /user/:id DELETE endpoint işareti. "id" parametre olarak gelir.
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
