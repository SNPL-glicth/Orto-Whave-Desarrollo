import { Controller, Get, Put, Body, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(@Request() req) {
    const user = await this.usersRepository.findOne({
      where: { id: req.user.sub },
      relations: ['rol'],
    });
    if (!user) throw new Error('Usuario no encontrado');
    const { password, ...userData } = user;
    return userData;
  }

  @UseGuards(JwtAuthGuard)
  @Put('me')
  async updateProfile(@Request() req, @Body() updateData: Partial<User>) {
    const user = await this.usersRepository.findOne({ where: { id: req.user.sub } });
    if (!user) throw new Error('Usuario no encontrado');
    // Solo permitir actualizar ciertos campos
    user.nombre = updateData.nombre || user.nombre;
    user.apellido = updateData.apellido || user.apellido;
    user.telefono = updateData.telefono || user.telefono;
    user.direccion = updateData.direccion || user.direccion;
    await this.usersRepository.save(user);
    const { password, ...userData } = user;
    return userData;
  }
} 