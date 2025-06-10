import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: false })
  nombre: string;

  @Column({ name: 'activo', default: true })
  activo: boolean;

  @Column({ 
    name: 'fecha_creacion',
    type: 'timestamp', 
    default: () => 'CURRENT_TIMESTAMP' 
  })
  fechaCreacion: Date;
} 