import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { config } from 'dotenv';
import { execSync } from 'child_process';

config();

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  username: process.env.DB_USERNAME || 'ortowhave',
  password: process.env.DB_PASSWORD || 'Root1234a',
  database: process.env.DB_DATABASE || 'orto_whave_db',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: false, // Desactivamos la sincronización automática
  migrationsRun: true, // Ejecutamos las migraciones al iniciar
  logging: true, // Activamos el logging para ver las consultas SQL
  extra: {
    authPlugins: {
      mysql_clear_password: () => () => {
        return execSync('sudo cat /dev/null').toString();
      }
    }
  }
}; 