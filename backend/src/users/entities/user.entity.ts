import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Role } from '../../roles/entities/role.entity';

@Entity('usuarios')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  nombre: string;

  @Column()
  apellido: string;

  @Column({ nullable: true })
  telefono: string;

  @Column({ nullable: true, type: 'text' })
  direccion: string;

  @Column({ name: 'rol_id' })
  rolId: number;

  @ManyToOne(() => Role)
  @JoinColumn({ name: 'rol_id' })
  rol: Role;

  @Column({ name: 'fecha_creacion', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fechaCreacion: Date;
} 