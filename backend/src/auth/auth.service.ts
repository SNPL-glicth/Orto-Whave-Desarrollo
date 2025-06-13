import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import * as crypto from 'crypto';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
    private mailerService: MailerService,
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

    if (!user) {
      return null;
    }
    if (!user.isVerified) {
      throw new UnauthorizedException('La cuenta no ha sido verificada. Por favor revisa tu correo.');
    }
    if (user.password === hashedPassword) {
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

  async register(userData: any) {
    // Validar campos obligatorios
    if (!userData.nombre || !userData.apellido || !userData.email || !userData.password) {
      throw new BadRequestException('Todos los campos (nombre, apellido, email y contraseña) son obligatorios.');
    }

    const existingUser = await this.usersRepository.findOne({
      where: { email: userData.email },
    });

    if (existingUser) {
      throw new ConflictException('El correo electrónico ya está registrado');
    }

    // Asignar rolId=3 (paciente) por defecto si no se especifica
    const rolId = userData.rolId || 3;

    // Generar código de verificación de 6 dígitos
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    const hashedPassword = crypto
      .createHash('sha256')
      .update(userData.password)
      .digest('hex');

    const newUser = this.usersRepository.create({
      ...userData,
      password: hashedPassword,
      rolId,
      isVerified: false,
      verificationCode,
    });

    await this.usersRepository.save(newUser);

    // Enviar correo de verificación
    await this.mailerService.sendMail({
      to: userData.email,
      subject: 'Verifica tu cuenta en Orto-Whave',
      template: './verification',
      context: {
        verificationCode,
        email: userData.email,
      },
    });

    return {
      message: 'Usuario registrado exitosamente. Por favor revisa tu correo para verificar tu cuenta.',
      email: userData.email,
    };
  }

  async verifyCode(email: string, code: string) {
    const user = await this.usersRepository.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }
    if (user.isVerified) {
      return { message: 'La cuenta ya está verificada.' };
    }
    if (user.verificationCode !== code) {
      throw new UnauthorizedException('Código de verificación incorrecto');
    }
    user.isVerified = true;
    user.verificationCode = null;
    await this.usersRepository.save(user);
    return { message: 'Cuenta verificada exitosamente.' };
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