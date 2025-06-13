import { MailerOptions } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';

export const mailConfig: MailerOptions = {
  transport: {
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: 'pachonlucassergionicolas@gmail.com',
      pass: 'roen axoq wppd yvxl',
    },
  },
  defaults: {
    from: '"Orto-Whave" <pachonlucassergionicolas@gmail.com>',
  },
  template: {
    dir: join(__dirname, '..', 'templates'),
    adapter: new HandlebarsAdapter(),
    options: {
      strict: true,
    },
  },
}; 