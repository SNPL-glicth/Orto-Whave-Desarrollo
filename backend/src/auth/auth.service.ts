import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const hashedPassword = crypto
      .createHash('sha256')
      .update(password)
      .digest('hex');

    const user = await this.usersRepository.findOne({
      where: { email },
      relations: ['rol'],
    });

    if (user && user.password === hashedPassword) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = {
      email: user.email,
      sub: user.id,
      rol: user.rol.nombre,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        nombre: user.nombre,
        apellido: user.apellido,
        rol: user.rol.nombre,
      },
      redirect: this.getRedirectPath(user.rol.nombre),
    };
  }

  private getRedirectPath(rol: string): string {
    const redirectPaths = {
      administrador: '/dashboard/admin',
      doctor: '/dashboard/doctor',
      paciente: '/dashboard/patient',
    };
    return redirectPaths[rol] || '/';
  }
} 